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
    <br />
    <Viewport :scene="scene" :camera="camera" :updated="updated" :width="800" :height="600" />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from '@vue/composition-api';
import { TestModel } from './models/TestModel';

import { RootScene } from './models/RootScene';
import { container } from 'tsyringe';
import { History } from '../externals/EditingSystemTs/src/History';

import NumberEditor from './components/NumberEditor.vue';
import Viewport from './components/Viewport.vue';

export default defineComponent({
  name: 'App',
  components: {
    NumberEditor,
    Viewport,
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

    const rootScene = container.resolve(RootScene);

    const scene = ref(rootScene);
    const camera = ref(rootScene.camera);
    const updated = ref(rootScene.updated);

    for (let i = 0; i != 30; ++i) {
      rootScene.addCube();
    }

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

      scene,
      camera,
      updated,
    };
  },
});
</script>
