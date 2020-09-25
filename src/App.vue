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

    <SceneViewport
      class="viewport"
      :scene="rootSceneViewModel"
      :selectedObject.sync="testModel.selectedObject"
      :updated="updated"
      @begin-continuous-editing="onBeginContinuousEditing"
      @end-continuous-editing="onEndContinuousEditing"
    />
    <ObjectTreeView class="treeview" :children="children" :selectedObject.sync="testModel.selectedObject" />
    <ObjectInspector
      class="inspector"
      :target="testModel.selectedObject"
      @begin-continuous-editing="onBeginContinuousEditing"
      @end-continuous-editing="onEndContinuousEditing"
    />
  </div>
</template>

<style scoped lang="scss">
$base-gap: 4px;
$window-width: calc(100vw - #{$base-gap * 2});
$window-height: calc(100vh - #{$base-gap * 2});

.app {
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

.header {
  grid-area: header;
}

.pane-base {
  overflow: auto;
  white-space: nowrap;
  padding: $base-gap;
  border: 1px solid #aab;
}

.viewport {
  grid-area: viewport;
}

.treeview {
  @extend .pane-base;
  grid-area: treeview;
}

.inspector {
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
import { defineComponent, onUnmounted, ref } from '@vue/composition-api';
import { container } from 'tsyringe';
import { History } from '../externals/EditingSystemTs/src/History';
import { EventArgs } from '../externals/EditingSystemTs/src/TypedEvent';
import { TestModel } from './models/TestModel';
import { RootScene } from './models/RootScene';
import { RootSceneViewModel } from './view-models/RootSceneViewModel';

import NumberEditor from './components/controls/NumberEditor.vue';
import TextBox from './components/controls/TextBox.vue';
import SceneViewport from './components/SceneViewport.vue';
import ObjectTreeView from './components/ObjectTreeView.vue';
import ObjectInspector from './components/ObjectInspector.vue';
import { SeObject3D } from './se/SeObject3D';
import { SeVector3 } from './se/math/SeVector3';
import { isRedo, isUndo } from './components/ComponentHelper';
import { Color } from 'three/src/math/Color';

export default defineComponent({
  name: 'App',
  components: {
    NumberEditor,
    TextBox,
    SceneViewport,
    ObjectTreeView,
    ObjectInspector,
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
      if (isUndo(e)) {
        e.preventDefault();
        _history.undo();
      } else if (isRedo(e)) {
        e.preventDefault();
        _history.redo();
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
      rootSceneViewModel.background = new Color(0x24292e);
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
