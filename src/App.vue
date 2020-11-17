<template>
  <div id="app" tabindex="0">
    <div id="header" class="block">
      undo:{{ historyState.undoCount }}, redo:{{ historyState.redoCount }}

      <label class="block_sep">
        <input type="checkbox" v-model="appState.isInPreview" />
        Preview
      </label>

      <button :disabled="historyState.canUndo === false" class="block_sep" @click="undo.invoke()">Undo</button>
      <button :disabled="historyState.canRedo === false" @click="redo.invoke()">Redo</button>
      <button :disabled="historyState.canClear === false" @click="clearHistory.invoke()">Clear history</button>

      <button class="block_sep" @click="addBoxes">Add boxes</button>
      <button :disabled="appState.selectedEntity === null" @click="addChildBox">Add child box</button>
      <button @click="addPoints">Add points</button>
      <button @click="addHavingChildrenBox">Add HavingChildrenBox</button>
      <button @click="addThreeGens">Add ThreeGens</button>
    </div>

    <SceneViewportLayouter
      id="sceneViewport"
      v-if="appState.isInPreview === false"
      :scene="sceneViewModel"
      :selectedEntity="appState.selectedEntity"
      :updated="updated"
      :beginContinuousEditing="beginContinuousEditing"
      :endContinuousEditing="endContinuousEditing"
    />

    <PreviewViewport id="previewViewport" v-else />

    <EntityTreeView id="treeview" :children="children" :selectedEntity="appState.selectedEntity" />

    <EntityInspector
      id="inspector"
      :target="appState.selectedEntity"
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

  grid-template-columns: 1fr 400px;
  grid-template-rows: auto 1fr 1fr;

  grid-template-areas:
    'header   header'
    'viewport treeview'
    'viewport inspector';

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

#sceneViewport {
  grid-area: viewport;
}

#previewViewport {
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
import SceneViewportLayouter from './components/SceneViewportLayouter.vue';
import PreviewViewport from './components/PreviewViewport.vue';
import EntityTreeView from './components/EntityTreeView.vue';
import EntityInspector from './components/EntityInspector.vue';

import { computed, defineComponent, reactive, ref } from '@vue/composition-api';
import { SceneViewModel } from './viewModels/SceneViewModel';
import { Project } from './models/Project';
import { AppState } from './models/AppState';
import { UseCase } from './di/useCase';
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

import { dic } from '@/di/dic';

export default defineComponent({
  components: {
    SceneViewportLayouter,
    PreviewViewport,
    EntityTreeView,
    EntityInspector,
  },
  setup() {
    return using(dic().resolve(PauseEditingBlock), () => {
      const undo = dic().resolve<UndoUseCase>(UseCase.undo);
      const redo = dic().resolve<RedoUseCase>(UseCase.redo);
      const clearHistory = dic().resolve<ClearHistoryUseCase>(UseCase.clearHistory);
      const beginBatchEditing = dic().resolve<BeginBatchEditingUseCase>(UseCase.beginBatchEditing);
      const endBatchEditing = dic().resolve<EndBatchEditingUseCase>(UseCase.endBatchEditing);
      const getEdited = dic().resolve<GetEditedUseCase>(UseCase.getEdited);
      const getHistoryState = dic().resolve<GetHistoryStateUseCase>(UseCase.getHistoryState);

      const project = reactive(dic().resolve(Project));
      const appState = reactive(dic().resolve(AppState));
      const historyState = computed(() => getHistoryState.invoke());
      const appTest = dic().resolve(AppTest);

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

      return {
        appState,
        historyState,

        undo,
        redo,
        clearHistory,

        beginContinuousEditing,
        endContinuousEditing,

        sceneViewModel: SceneViewModel.create(rootScene),
        children: ref(rootScene.children),
        updated: getEdited.invoke(),

        addBoxes: () => appTest.addEntities('box', false, 20),
        addChildBox: () => appTest.addChildEntity('box'),
        addPoints: () => appTest.addEntities('point', true, 20),
        addHavingChildrenBox: () => appTest.addEntities('havingChildrenBox', true, 1),
        addThreeGens: () => appTest.addEntities('threeGens', true, 1),
      };
    });
  },
});
</script>
