<template>
  <div id="app">
    <div id="header">
      <div class="block">
        (undo:{{ history.undoRedoCount[0] }}, redo:{{ history.undoRedoCount[1] }})
        <button @click="undo.invoke()">Undo</button>
        <button @click="redo.invoke()">Redo</button>
        <button @click="clearHistory.invoke()">Clear history</button>
      </div>

      <div class="block">
        <button @click="addCubes">Add cubes</button>
        <button @click="addChild">Add child</button>
      </div>
    </div>

    <SceneViewport
      id="viewport"
      :scene="rootSceneViewModel"
      :selectedObject.sync="project.selectedObject"
      :updated="updated"
      @begin-continuous-editing="onBeginContinuousEditing"
      @end-continuous-editing="onEndContinuousEditing"
    />
    <ObjectTreeView id="treeview" :children="children" :selectedObject.sync="project.selectedObject" />
    <ObjectInspector
      id="inspector"
      :target="project.selectedObject"
      @begin-continuous-editing="onBeginContinuousEditing"
      @end-continuous-editing="onEndContinuousEditing"
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

.block_h_2nd {
  margin-left: 64px;
}
</style>

<script lang="ts">
import { defineComponent, onUnmounted, reactive, ref } from '@vue/composition-api';
import { container } from 'tsyringe';
import { History } from '../externals/EditingSystemTs/src/History';
import { EventArgs } from '../externals/EditingSystemTs/src/TypedEvent';
import { RootScene } from './models/RootScene';
import { RootSceneViewModel } from './viewModels/RootSceneViewModel';

import SceneViewport from './components/SceneViewport.vue';
import ObjectTreeView from './components/ObjectTreeView.vue';
import ObjectInspector from './components/ObjectInspector.vue';
import { SeObject3D } from './se/SeObject3D';
import { SeVector3 } from './se/math/SeVector3';
import { isRedo, isUndo } from './components/ComponentHelper';
import { Color } from 'three/src/math/Color';
import { Project } from './models/Project';
import { UseCase } from './Di';
import { UndoUseCase } from './useCases/history/UndoUseCase';
import { RedoUseCase } from './useCases/history/RedoUseCase';
import { ClearHistoryUseCase } from './useCases/history/ClearHistoryUseCase';

export default defineComponent({
  name: 'App',
  components: {
    SceneViewport,
    ObjectTreeView,
    ObjectInspector,
  },
  setup() {
    const undo = container.resolve<UndoUseCase>(UseCase.undo);
    const redo = container.resolve<RedoUseCase>(UseCase.redo);
    const clearHistory = container.resolve<ClearHistoryUseCase>(UseCase.clearHistory);

    const project = reactive(container.resolve(Project));
    const history = reactive(container.resolve(History));

    const onBeginContinuousEditing = () => {
      if (history.isInBatch == false) {
        history.beginBatch();
      }
    };

    const onEndContinuousEditing = () => {
      if (history.isInBatch) {
        history.endBatch();
      }
    };

    document.body.onkeydown = (e: KeyboardEvent) => {
      if (isUndo(e)) {
        e.preventDefault();
        undo.invoke();
      } else if (isRedo(e)) {
        e.preventDefault();
        redo.invoke();
      }
    };

    // rootScene
    const rootScene = container.resolve(RootScene);
    const updated = rootScene.updated;

    const emitUpdated = () => updated.emit(null, EventArgs.empty);

    try {
      history.edited.on(emitUpdated);

      history.beginPause();

      // rootSceneViewModel
      const rootSceneViewModel = container.resolve(RootSceneViewModel);
      rootSceneViewModel.background = new Color(0x24292e);
      rootSceneViewModel.setup(rootScene);

      const children = ref(rootScene.children);

      //
      const addCubes = () => {
        try {
          history.beginBatch();

          for (let i = 0; i != 20; ++i) {
            rootScene.addCube();
          }
        } finally {
          history.endBatch();
        }
      };

      const addChild = () => {
        let parent = rootScene as SeObject3D;

        while (parent.children.length > 0) {
          parent = parent.children[0];
        }

        try {
          history.beginBatch();

          const cube = rootScene.createCube();
          parent.add(cube);

          cube.position = new SeVector3(5, 0, 0);
        } finally {
          history.endBatch();
        }
      };

      onUnmounted(() => {
        history.edited.off(emitUpdated);
        rootSceneViewModel.dispose();
      });

      return {
        project,
        history,

        undo,
        redo,
        clearHistory,

        onBeginContinuousEditing,
        onEndContinuousEditing,

        rootSceneViewModel,
        updated,
        children,

        addCubes,
        addChild,
      };
    } finally {
      history.endPause();
    }
  },
});
</script>
