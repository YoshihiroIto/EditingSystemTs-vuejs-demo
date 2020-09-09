<template>
  <div id="app">
    {{ testModel.valueA }}
    <br />
    (undo:{{ history.undoRedoCount[0] }}, redo:{{ history.undoRedoCount[1] }})
    <br />
    <button @click="undo">undo</button>
    <button @click="redo">redo</button>
    <button @click="inc">inc</button>
    <button @click="dec">dec</button>
    <br />
    <br />
    <NumberEditor
      @begin-continuous-editing="onBeginContinuousEditing"
      @end-continuous-editing="onEndContinuousEditing"
      :value.sync="testModel.valueA"
    />
    {{ testModel.valueA }}
    <br />
    <button @click="addCubes">Add cubes</button>
    <br />
    <div id="horizontal-container">
      <Viewport :scene="rootSceneViewModel" :camera="camera" :updated="updated" :width="800" :height="600" />
      <ObjectTreeView :children="children" />
    </div>
  </div>
</template>

<style scoped>
#horizontal-container {
  display: grid;
  column-gap: 16px;
  grid-template-columns: 800px 1fr;
}
</style>

<script lang="ts">
import { defineComponent, onUnmounted, ref } from '@vue/composition-api';
import { TestModel } from './models/TestModel';
import { RootScene } from './models/RootScene';

import { RootSceneViewModel } from './view-models/RootSceneViewModel';
import { container } from 'tsyringe';
import { History } from '../externals/EditingSystemTs/src/History';
import createReadonlyObservableArray from '../externals/EditingSystemTs/src/ReadOnlyObservableArray';

import NumberEditor from './components/NumberEditor.vue';
import Viewport from './components/Viewport.vue';
import ObjectTreeView from './components/ObjectTreeView.vue';

export default defineComponent({
  name: 'App',
  components: {
    NumberEditor,
    Viewport,
    ObjectTreeView,
  },
  setup() {
    const _history = container.resolve(History);
    const _testModel = container.resolve(TestModel);

    const history = ref(_history);
    const testModel = ref(_testModel);
    const valueA = ref(_testModel.valueA);

    const undo = () => _history.undo();
    const redo = () => _history.redo();
    const inc = () => ++_testModel.valueA;
    const dec = () => --_testModel.valueA;

    const onBeginContinuousEditing = () => {
      if (_history.isInBatch == false) {
        _history.beginBatch();
      }
    };

    const onEndContinuousEditing = () => {
      if (_history.isInBatch) {
        _history.endBatch();
      }
    };

    document.body.onkeydown = (e: KeyboardEvent) => {
      if (e.ctrlKey) {
        switch (e.key) {
          case 'z':
            e.preventDefault();
            _history.undo();
            break;

          case 'y':
            e.preventDefault();
            _history.redo();
            break;
        }
      }
    };

    try {
      _history.beginPause();

      // rootScene
      const rootScene = container.resolve(RootScene);
      const updated = rootScene.updated;

      // rootSceneViewModel
      const rootSceneViewModel = container.resolve(RootSceneViewModel);
      rootSceneViewModel.setup(rootScene);

      const camera = rootSceneViewModel.camera;
      const children = rootScene.children;

      //
      const addCubes = () => {
        try {
          _history.beginBatch();

          for (let i = 0; i != 20; ++i) {
            rootScene.addCube();
          }
        } finally {
          _history.endBatch();
        }
      };

      onUnmounted(() => {
        rootSceneViewModel.dispose();
      });

      return {
        history,
        testModel,
        valueA,

        undo,
        redo,
        inc,
        dec,

        onBeginContinuousEditing,
        onEndContinuousEditing,

        rootSceneViewModel,
        camera,
        updated,
        children,

        addCubes,
      };
    } finally {
      _history.endPause();
    }
  },
});
</script>
