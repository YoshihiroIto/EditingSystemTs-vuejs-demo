<template>
  <div id="app" class="app">
    <div class="header">
      <div class="block">
        (undo:{{ history.undoRedoCount[0] }}, redo:{{ history.undoRedoCount[1] }})
        <button @click="undo">Undo</button>
        <button @click="redo">Redo</button>
        <button @click="clearHistory">Clear history</button>
      </div>

      <div class="block">
        <div class="block">
          <button @click="inc">Inc</button>
          <button @click="dec">Dec</button>
          <NumberEditor
            @begin-continuous-editing="onBeginContinuousEditing"
            @end-continuous-editing="onEndContinuousEditing"
            :min="-500"
            :max="500"
            :step="0.01"
            :value.sync="testModel.valueNumber"
          />
          {{ testModel.valueNumber }}
        </div>

        <div class="block block_h_2nd">
          <TextBox
            @begin-continuous-editing="onBeginContinuousEditing"
            @end-continuous-editing="onEndContinuousEditing"
            :value.sync="testModel.valueString"
          />
          {{ testModel.valueString }}
        </div>
      </div>

      <div class="block">
        <button @click="addCubes">Add cubes</button>
        <button @click="addChild">Add child</button>
      </div>
    </div>

    <Viewport class="viewport" :scene="rootSceneViewModel" :updated="updated" />
    <ObjectTreeView class="tree" :children="children" :selectedObject.sync="testModel.selectedObject" />
    <Inspector class="inspector" :selectedObject="testModel.selectedObject" />
  </div>
</template>

<style scoped>
.app {
  display: grid;

  max-height: calc(100vh - 8px);
  min-height: calc(100vh - 8px);
  height: calc(100vh - 8px);
  max-width: calc(100vw - 8px);
  min-width: calc(100vw - 8px);
  width: calc(100vw - 8px);

  margin: 4px;
  gap: 4px;

  grid-template-rows: auto 1fr 1fr;
  grid-template-columns: 1fr 400px;

  grid-template-areas:
    'header   header'
    'viewport tree'
    'viewport inspector';
}

.header {
  grid-area: header;
}

.viewport {
  grid-area: viewport;
}

.tree {
  grid-area: tree;
  overflow: auto;
  white-space: nowrap;

  padding: 4px;
  border: 1px solid #aab;
}

.inspector {
  grid-area: inspector;
  overflow: auto;
  white-space: nowrap;

  padding: 4px;
  border: 1px solid #aab;
}

.block {
  display: flex;
  flex-flow: row no-wrap;
  margin-top: 4px;
}

.block_h_2nd {
  margin-left: 64px;
}
</style>

<script lang="ts">
import { defineComponent, onUnmounted, ref } from '@vue/composition-api';
import { container } from 'tsyringe';
import { History } from '../externals/EditingSystemTs/src/History';
import { EventArgs } from '../externals/EditingSystemTs/src/TypedEvent';
import { TestModel } from './models/TestModel';
import { RootScene } from './models/RootScene';
import { RootSceneViewModel } from './view-models/RootSceneViewModel';

import NumberEditor from './components/controls/NumberEditor.vue';
import TextBox from './components/controls/TextBox.vue';
import Viewport from './components/Viewport.vue';
import ObjectTreeView from './components/ObjectTreeView.vue';
import Inspector from './components/Inspector.vue';
import { SeObject3D } from './se/SeObject3D';
import { SeVector3 } from './se/math/SeVector3';

export default defineComponent({
  name: 'App',
  components: {
    NumberEditor,
    TextBox,
    Viewport,
    ObjectTreeView,
    Inspector,
  },
  setup() {
    const _history = container.resolve(History);
    const _testModel = container.resolve(TestModel);

    const history = ref(_history);
    const testModel = ref(_testModel);

    const undo = () => _history.undo();
    const redo = () => _history.redo();
    const clearHistory = () => _history.clear();
    const inc = () => ++_testModel.valueNumber;
    const dec = () => --_testModel.valueNumber;

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
      _history.edited.on(() => updated.emit(null, EventArgs.empty));

      _history.beginPause();

      // rootScene
      const rootScene = container.resolve(RootScene);
      const updated = rootScene.updated;

      // rootSceneViewModel
      const rootSceneViewModel = container.resolve(RootSceneViewModel);
      rootSceneViewModel.setup(rootScene);

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

      const addChild = () => {
        let parent = rootScene as SeObject3D;

        while (parent.children.length > 0) {
          parent = parent.children[0];
        }

        try {
          _history.beginBatch();

          const cube = rootScene.createCube();
          parent.add(cube);

          cube.position = new SeVector3(5, 0, 0);
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

        undo,
        redo,
        clearHistory,
        inc,
        dec,

        onBeginContinuousEditing,
        onEndContinuousEditing,

        rootSceneViewModel,
        updated,
        children,

        addCubes,
        addChild,
      };
    } finally {
      _history.endPause();
    }
  },
});
</script>
