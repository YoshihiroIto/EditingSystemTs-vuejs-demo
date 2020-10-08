<template>
  <div id="app" tabindex="0">
    <div id="header" class="block">
      undo:{{ historyState.undoCount }}, redo:{{ historyState.redoCount }}
      <button :disabled="historyState.canUndo === false" class="block_sep" @click="undo.invoke()">Undo</button>
      <button :disabled="historyState.canRedo === false" @click="redo.invoke()">Redo</button>
      <button :disabled="historyState.canClear === false" @click="clearHistory.invoke()">Clear history</button>

      <button class="block_sep" @click="addBoxes">Add boxes</button>
      <button :disabled="project.selectedEntity === null" @click="addChildBox">Add child box</button>
      <button @click="addPoints">Add points</button>
    </div>

    <SceneViewport
      id="viewport1"
      :scene="sceneViewModel"
      :selectedEntity.sync="project.selectedEntity"
      :updated="updated"
      @begin-continuous-editing="beginContinuousEditing"
      @end-continuous-editing="endContinuousEditing"
    />

    <SceneViewport
      id="viewport2"
      :scene="sceneViewModel"
      :selectedEntity.sync="project.selectedEntity"
      :updated="updated"
      @begin-continuous-editing="beginContinuousEditing"
      @end-continuous-editing="endContinuousEditing"
    />

    <EntityTreeView id="treeview" :children="children" :selectedEntity.sync="project.selectedEntity" />

    <EntityInspector
      id="inspector"
      :target="project.selectedEntity"
      @begin-continuous-editing="beginContinuousEditing"
      @end-continuous-editing="endContinuousEditing"
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

  grid-template-columns: 1fr 1fr 400px;
  grid-template-rows: auto 1fr 1fr;

  grid-template-areas:
    'header    header    header'
    'viewport1 viewport2 treeview'
    'viewport1 viewport2 inspector';

  &:focus {
    outline: none;
  }
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

#viewport1 {
  grid-area: viewport1;
}

#viewport2 {
  grid-area: viewport2;
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
import { computed, defineComponent, reactive, ref } from '@vue/composition-api';
import { container } from 'tsyringe';
import { SceneViewModel } from './viewModels/SceneViewModel';

import SceneViewport from './components/SceneViewport.vue';
import EntityTreeView from './components/EntityTreeView.vue';
import EntityInspector from './components/EntityInspector.vue';
import { isRedo, isUndo } from './components/ComponentHelper';
import { Project } from './models/Project';
import { UseCase } from './Di';
import { UndoUseCase } from './useCases/history/UndoUseCase';
import { RedoUseCase } from './useCases/history/RedoUseCase';
import { ClearHistoryUseCase } from './useCases/history/ClearHistoryUseCase';
import { BeginBatchEditingUseCase } from './useCases/history/BeginBatchEditingUseCase';
import { EndBatchEditingUseCase } from './useCases/history/EndBatchEditingUseCase';
import { GetEditedUseCase } from './useCases/history/GetEditedUseCase';
import { GetHistoryStateUseCase } from './useCases/history/GetHistoryStateUseCase';

import using from './foundations/Using';
import { PauseEditingBlock } from './foundations/PauseEditingBlock';

import { AppTest } from './models/AppTest';
import { Entity } from './models/entity/Entity';

export default defineComponent({
  components: {
    SceneViewport,
    EntityTreeView,
    EntityInspector,
  },
  setup() {
    return using(container.resolve(PauseEditingBlock), () => {
      const undo = container.resolve<UndoUseCase>(UseCase.undo);
      const redo = container.resolve<RedoUseCase>(UseCase.redo);
      const clearHistory = container.resolve<ClearHistoryUseCase>(UseCase.clearHistory);
      const beginBatchEditing = container.resolve<BeginBatchEditingUseCase>(UseCase.beginBatchEditing);
      const endBatchEditing = container.resolve<EndBatchEditingUseCase>(UseCase.endBatchEditing);
      const getEdited = container.resolve<GetEditedUseCase>(UseCase.getEditedUseCase);
      const getHistoryState = container.resolve<GetHistoryStateUseCase>(UseCase.getHistoryState);

      const project = reactive(container.resolve(Project));
      const historyState = computed(() => getHistoryState.invoke());
      const appTest = container.resolve(AppTest);

      const rootScene = project.rootScene as Entity;
      appTest.setup(rootScene);

      const beginContinuousEditing = () => {
        if (getHistoryState.invoke().isInBatch == false) {
          beginBatchEditing.invoke();
        }
      };

      const endContinuousEditing = () => {
        if (getHistoryState.invoke().isInBatch) {
          endBatchEditing.invoke();
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

      return {
        project,
        historyState,

        undo,
        redo,
        clearHistory,

        beginContinuousEditing,
        endContinuousEditing,

        sceneViewModel: SceneViewModel.create(rootScene),
        children: ref(rootScene.children),
        updated: getEdited.invoke(),

        addBoxes: () => appTest.addEntities('box', false),
        addChildBox: () => appTest.addChildEntity('box'),
        addPoints: () => appTest.addEntities('point', true),
      };
    });
  },
});
</script>
