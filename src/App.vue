<template>
  <div id="app" @keydown="onKeyDown" tabindex="0">
    <div id="header" class="block">
      undo:{{ undoRedoCount[0] }}, redo:{{ undoRedoCount[1] }}
      <button class="block_sep" @click="undo.invoke()">Undo</button>
      <button @click="redo.invoke()">Redo</button>
      <button @click="clearHistory.invoke()">Clear history</button>

      <button class="block_sep" @click="addCubes">Add cubes</button>
      <button @click="addChild">Add child</button>
    </div>

    <SceneViewport
      id="viewport"
      :scene="rootSceneViewModel"
      :selectedObject.sync="project.selectedObject"
      :updated="updated"
      @begin-continuous-editing="beginBatchEditing.invoke()"
      @end-continuous-editing="endBatchEditing.invoke()"
    />

    <ObjectTreeView id="treeview" :children="children" :selectedObject.sync="project.selectedObject" />

    <ObjectInspector
      id="inspector"
      :target="project.selectedObject"
      @begin-continuous-editing="beginBatchEditing.invoke()"
      @end-continuous-editing="endBatchEditing.invoke()"
    />
  </div>
</template>

<style scoped lang="scss">
$base-gap: 4px;
$window-width: calc(100vw - #{$base-gap * 2});
$window-height: calc(100vh - #{$base-gap * 2});

#app {
  display: grid;

  max-width: $window-width;
  min-width: $window-width;
  width: $window-width;
  max-height: $window-height;
  min-height: $window-height;
  height: $window-height;

  margin: $base-gap;
  gap: $base-gap;

  grid-template-columns: 1fr 400px;
  grid-template-rows: auto 1fr 1fr;

  grid-template-areas:
    'header   header'
    'viewport treeview'
    'viewport inspector';
}

#header {
  grid-area: header;
}

.pane-base {
  overflow: auto;
  white-space: nowrap;
  padding: $base-gap;
  border: 1px solid #aab;
}

#viewport {
  grid-area: viewport;
}

#treeview {
  @extend .pane-base;
  grid-area: treeview;
}

#inspector {
  @extend .pane-base;
  grid-area: inspector;
}

.block {
  display: flex;
  flex-flow: row no-wrap;
  margin-top: $base-gap;
}

.block_sep {
  margin-left: 64px;
}
</style>

<script lang="ts">
import { computed, defineComponent, onUnmounted, reactive, ref } from '@vue/composition-api';
import { container } from 'tsyringe';
import { EventArgs } from '../externals/EditingSystemTs/src/TypedEvent';
import { RootScene } from './models/RootScene';
import { RootSceneViewModel } from './viewModels/RootSceneViewModel';

import SceneViewport from './components/SceneViewport.vue';
import ObjectTreeView from './components/ObjectTreeView.vue';
import ObjectInspector from './components/ObjectInspector.vue';
import { SeObject3D } from './se/SeObject3D';
import { SeVector3 } from './se/math/SeVector3';
import { isRedo, isUndo } from './components/ComponentHelper';
import { Project } from './models/Project';
import { UseCase } from './Di';
import { UndoUseCase } from './useCases/history/UndoUseCase';
import { RedoUseCase } from './useCases/history/RedoUseCase';
import { ClearHistoryUseCase } from './useCases/history/ClearHistoryUseCase';
import { BeginBatchEditingUseCase } from './useCases/history/BeginBatchEditingUseCase';
import { EndBatchEditingUseCase } from './useCases/history/EndBatchEditingUseCase';
import { BeginPauseEditingUseCase } from './useCases/history/BeginPauseEditingUseCase';
import { EndPauseEditingUseCase } from './useCases/history/EndPauseEditingUseCase';
import { GetEditedUseCase } from './useCases/history/GetEditedUseCase';
import { GetUndoRedoCountUseCase } from './useCases/history/GetUndoRedoCountUseCase';

import using from './foundations/Using';
import { BatchEditingBlock } from './models/BatchEditingBlock';
import { PauseEditingBlock } from './models/PauseEditingBlock';

export default defineComponent({
  name: 'App',
  components: {
    SceneViewport,
    ObjectTreeView,
    ObjectInspector,
  },
  setup() {
    return using(container.resolve(PauseEditingBlock), () => {
      const undo = container.resolve<UndoUseCase>(UseCase.undo);
      const redo = container.resolve<RedoUseCase>(UseCase.redo);
      const clearHistory = container.resolve<ClearHistoryUseCase>(UseCase.clearHistory);
      const beginBatchEditing = container.resolve<BeginBatchEditingUseCase>(UseCase.beginBatchEditing);
      const endBatchEditing = container.resolve<EndBatchEditingUseCase>(UseCase.endBatchEditing);
      const beginPauseEditing = container.resolve<BeginPauseEditingUseCase>(UseCase.beginPauseEditing);
      const endPauseEditing = container.resolve<EndPauseEditingUseCase>(UseCase.endPauseEditing);
      const getEdited = container.resolve<GetEditedUseCase>(UseCase.getEditedUseCase);
      const getUndoRedoCount = container.resolve<GetUndoRedoCountUseCase>(UseCase.getUndoRedoCount);

      const project = reactive(container.resolve(Project));
      const undoRedoCount = computed(() => getUndoRedoCount.invoke());
      const rootScene = container.resolve(RootScene);

      const onKeyDown = (e: KeyboardEvent) => {
        if (isUndo(e)) {
          e.preventDefault();
          undo.invoke();
        } else if (isRedo(e)) {
          e.preventDefault();
          redo.invoke();
        }
      };

      const addCubes = () => {
        using(container.resolve(BatchEditingBlock), () => {
          for (let i = 0; i != 20; ++i) {
            rootScene.addCube();
          }
        });
      };

      const addChild = () => {
        let parent = rootScene as SeObject3D;

        while (parent.children.length > 0) {
          parent = parent.children[0];
        }

        using(container.resolve(BatchEditingBlock), () => {
          const cube = rootScene.createCube();
          parent.add(cube);

          cube.position = new SeVector3(5, 0, 0);
        });
      };

      const emitUpdated = () => rootScene.updated.emit(null, EventArgs.empty);
      getEdited.invoke().on(emitUpdated);

      const rootSceneViewModel = container.resolve(RootSceneViewModel);
      rootSceneViewModel.setup(rootScene);

      onUnmounted(() => {
        getEdited.invoke().off(emitUpdated);
        rootSceneViewModel.dispose();
      });

      return {
        project,
        undoRedoCount,

        undo,
        redo,
        clearHistory,
        beginBatchEditing,
        endBatchEditing,
        beginPauseEditing,
        endPauseEditing,

        rootSceneViewModel,
        children: ref(rootScene.children),
        updated: rootScene.updated,

        addCubes,
        addChild,

        onKeyDown,
      };
    });
  },
});
</script>
