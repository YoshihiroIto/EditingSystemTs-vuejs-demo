<template>
  <div id="container" ref="container" @keydown="onKeyDown" @keyup="onKeyUp">
    <SceneViewportToolbar :mode.sync="controllerMode" :space.sync="controllerSpace" id="toolbar" ref="toolbar" />

    <div id="canvas-wrapper" ref="canvasWrapper">
      <canvas
        id="canvas"
        ref="canvas"
        @mouseenter="onCanvasMouseEnter"
        @mousemove="onCanvasMouseMove"
        @mouseleave="onCanvasMouseLeave"
      />

      <div id="info">
        FrameCount: {{ frameCount }}<br />
        ResizeCount: {{ resizeCount }}
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
#container {
  display: grid;

  grid-template-columns: 1fr;
  grid-template-rows: auto 1fr;

  grid-template-areas:
    'toolbar'
    'canvas';
}

#toolbar {
  grid-area: toolbar;
}

#canvas-wrapper {
  grid-area: canvas;
  position: relative;
}

#info {
  position: absolute;
  color: lightgray;
  font-size: small;
  top: 0px;
  left: 84px;
}

#canvas {
  width: 100%;
  height: 100%;
  display: block;

  &:focus {
    outline: none;
  }
}
</style>

<script lang="ts">
import SceneViewportToolbar from './SceneViewportToolbar.vue';
import { Entity } from '@/models/entity/Entity';
import { ThObject3D } from '@/th/ThObject';
import { defineComponent, onMounted, onUnmounted, ref, SetupContext, watch } from '@vue/composition-api';
import { Assert } from '../../externals/EditingSystemTs/src/Assert';
import { CompositeDisposable } from '../../externals/EditingSystemTs/src/CompositeDisposable';
import { from } from 'linq-to-typescript';
import { PerspectiveCamera } from 'three';
import Stats from 'three/examples/jsm/libs/stats.module';
import { TypedEvent } from '../../externals/EditingSystemTs/src/TypedEvent';
import { SceneViewportController } from './SceneViewportController';
import { SceneViewportHelper } from './SceneViewportHelper';
import ResizeObserver from 'resize-observer-polyfill';
import {
  SceneViewportControllerMode,
  SceneViewportControllerModes,
  SceneViewportControllerSpace,
  SceneViewportControllerSpaces,
} from './SceneViewportConstants';
import { ViewportRenderer } from '@/runtime/ViewportRenderer';

type Props = {
  scene: ThObject3D | null;
  selectedEntity: Entity | null;
  updated: TypedEvent | null;
};

export default defineComponent({
  props: {
    scene: { default: null },
    selectedEntity: { default: null },
    updated: { default: null },
  },
  components: {
    SceneViewportToolbar,
  },
  setup(props: Props, context: SetupContext) {
    const container = ref<HTMLElement>();
    const toolbar = ref<InstanceType<typeof SceneViewportToolbar>>();
    const canvasWrapper = ref<HTMLElement>();
    const canvas = ref<HTMLCanvasElement>();
    const stats = Stats();
    const frameCount = ref(0);
    const resizeCount = ref(0);

    ///////////////////////////////////////////////////////////////////////////
    // controller
    ///////////////////////////////////////////////////////////////////////////
    const controllerMode = ref(SceneViewportControllerModes.Translate as SceneViewportControllerMode);
    const controllerSpace = ref(SceneViewportControllerSpaces.World as SceneViewportControllerSpace);

    watch(controllerMode, value => (controller.mode = value));
    watch(controllerSpace, value => (controller.space = value));

    ///////////////////////////////////////////////////////////////////////////
    // camera
    ///////////////////////////////////////////////////////////////////////////
    const camera = new PerspectiveCamera(45, 600 / 400, 0.1, 1000);
    camera.position.set(0, 0, 20);
    camera.lookAt(0, 0, 0);

    const resizeObserver: ResizeObserver = new ResizeObserver(entries => {
      Assert.isNotNull(canvasWrapper.value);
      Assert.isNotNull(toolbar.value);

      // const w = entries[0].contentRect.width;
      const h = entries[0].contentRect.height - toolbar.value.$el.clientHeight;

      // canvasWrapper.value.style.width = w + 'px';
      canvasWrapper.value.style.height = h + 'px';

      requestRender();
    });

    let renderer: ViewportRenderer;
    let controller: SceneViewportController;

    const trash = new CompositeDisposable();

    onMounted(() => {
      Assert.isNotNull(props.scene);
      Assert.isNotNull(canvas.value);

      resizeObserver.observe(container.value as Element);
      props.updated?.on(requestRender);

      renderer = new ViewportRenderer(canvas.value, {
        onRender: () => ++frameCount.value,
        onResize: () => ++resizeCount.value,
      });

      controller = new SceneViewportController(props.scene, camera, canvas.value, requestRender);
      controller.beginContinuousEditing.on(() => context.emit('begin-continuous-editing'));
      controller.endContinuousEditing.on(() => context.emit('end-continuous-editing'));
      controller.entitiesPicked.on((_, e) => context.emit('update:selectedEntity', e.entities[0]));

      trash.push(renderer);
      trash.push(controller);
      trash.push(new SceneViewportHelper(props.scene));

      // stats
      stats.dom.style.position = 'absolute';
      stats.showPanel(2);
      canvasWrapper.value?.appendChild(stats.dom);
    });

    onUnmounted(() => {
      props.updated?.off(requestRender);

      resizeObserver.unobserve(canvas.value as Element);
      resizeObserver.disconnect();

      trash.dispose();
    });

    const onCanvasMouseEnter = () => (controller.IsVisibleGizmo = true);
    const onCanvasMouseMove = () => (controller.IsVisibleGizmo = true);
    const onCanvasMouseLeave = () => (controller.IsVisibleGizmo = false);

    ///////////////////////////////////////////////////////////////////////////
    // selectedEntity
    ///////////////////////////////////////////////////////////////////////////
    watch(
      () => props.selectedEntity,
      (newObj: Entity | null) => {
        Assert.isNotNull(props.scene);

        let isAttached = false;

        if (newObj != null) {
          const obj = from(props.scene.allChildren()).firstOrDefault(x => {
            return (x as ThObject3D).model === newObj;
          });

          if (obj != null) {
            controller?.attachTargetObject(obj as ThObject3D);
            isAttached = true;
          }
        }

        if (isAttached == false) {
          controller?.detachTargetObject();
        }
      }
    );

    ///////////////////////////////////////////////////////////////////////////
    // render
    ///////////////////////////////////////////////////////////////////////////
    const requestRender = () => {
      Assert.isNotNull(props.scene);
      renderer.requestRender(props.scene, camera);
    };

    ///////////////////////////////////////////////////////////////////////////
    // shortcut keys
    ///////////////////////////////////////////////////////////////////////////
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.shiftKey) {
        controller.isSnap = true;
      }
      if (e.ctrlKey && controller.IsVisibleGizmo) {
        controller.enabled = false;
      } else {
        switch (e.key.toLowerCase()) {
          case 'w':
            controllerMode.value = SceneViewportControllerModes.Translate;
            break;

          case 'e':
            controllerMode.value = SceneViewportControllerModes.Rotate;
            break;

          case 'r':
            controllerMode.value = SceneViewportControllerModes.Scale;
            break;

          case 'q':
            controllerSpace.value =
              controllerSpace.value === SceneViewportControllerSpaces.World
                ? SceneViewportControllerSpaces.Local
                : SceneViewportControllerSpaces.World;
            break;
        }
      }
    };

    const onKeyUp = () => {
      controller.isSnap = false;
      controller.enabled = true;
    };

    return {
      container,
      toolbar,
      canvasWrapper,
      canvas,
      frameCount,
      resizeCount,
      //
      controllerMode,
      controllerSpace,
      //
      onKeyDown,
      onKeyUp,
      //
      onCanvasMouseEnter,
      onCanvasMouseMove,
      onCanvasMouseLeave,
    };
  },
});
</script>
