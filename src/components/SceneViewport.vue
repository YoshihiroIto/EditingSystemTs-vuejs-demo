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
import { SeObject3D } from '@/se/SeObject3D';
import { ThObject3D } from '@/th/ThObject';
import { defineComponent, onMounted, onUnmounted, ref, SetupContext, watch } from '@vue/composition-api';
import { Assert } from '../../externals/EditingSystemTs/src/Assert';
import { CompositeDisposable } from '../../externals/EditingSystemTs/src/CompositeDisposable';
import { from } from 'linq-to-typescript';
import { PerspectiveCamera, WebGLRenderer } from 'three';
import Stats from 'three/examples/jsm/libs/stats.module';
import { TypedEvent } from '../../externals/EditingSystemTs/src/TypedEvent';
import { CameraHelper } from '../foundations/CameraHelper';
import { SceneViewportController } from './SceneViewportController';
import { SceneViewportHelper } from './SceneViewportHelper';
import ResizeObserver from 'resize-observer-polyfill';
import {
  SceneViewportControllerMode,
  SceneViewportControllerModes,
  SceneViewportControllerSpace,
  SceneViewportControllerSpaces,
} from './SceneViewportConstants';

type Props = {
  scene: ThObject3D | null;
  selectedObject: SeObject3D | null;
  updated: TypedEvent | null;
};

export default defineComponent({
  props: {
    scene: { default: null },
    selectedObject: { default: null },
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

    let renderer: WebGLRenderer;
    let controller: SceneViewportController;

    const trash = new CompositeDisposable();

    onMounted(() => {
      Assert.isNotNull(props.scene);

      resizeObserver.observe(container.value as Element);
      props.updated?.on(requestRender);

      renderer = new WebGLRenderer({
        antialias: true,
        canvas: canvas.value,
      });
      renderer.setPixelRatio(window.devicePixelRatio);

      controller = new SceneViewportController(props.scene, camera, renderer.domElement, requestRender);
      controller.beginContinuousEditing.on(() => context.emit('begin-continuous-editing'));
      controller.endContinuousEditing.on(() => context.emit('end-continuous-editing'));
      controller.objectsPicked.on((_, e) => context.emit('update:selectedObject', e.objects[0].model));

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

    const onCanvasMouseEnter = () => (controller.enabledGizmo = true);
    const onCanvasMouseMove = () => (controller.enabledGizmo = true);
    const onCanvasMouseLeave = () => (controller.enabledGizmo = false);

    ///////////////////////////////////////////////////////////////////////////
    // selectedObject
    ///////////////////////////////////////////////////////////////////////////
    watch(
      () => props.selectedObject,
      (newObj: SeObject3D | null) => {
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
    let isRequestRender = false;

    const requestRender = () => {
      if (isRequestRender) {
        return;
      }

      const animate = () => {
        render();
        isRequestRender = false;
      };

      isRequestRender = true;
      requestAnimationFrame(animate);
    };

    const frameCount = ref(0);
    const resizeCount = ref(0);
    const render = () => {
      Assert.isNotNull(props.scene);

      ++frameCount.value;

      // canvas size
      {
        // ref: https://threejsfundamentals.org/threejs/lessons/threejs-responsive.html
        const domElement = renderer.domElement;
        const width = domElement.clientWidth;
        const height = domElement.clientHeight;
        const needResize = domElement.width !== width || domElement.height !== height;

        if (needResize) {
          renderer.setSize(width, height, false);
          CameraHelper.SetAspect(camera, width / height);

          ++resizeCount.value;
        }
      }

      // Enable only own contoller
      for (const c of SceneViewportController.allInstances()) {
        c.enabledGizmo = c === controller;
      }

      renderer.render(props.scene, camera);
      stats.update();
    };

    ///////////////////////////////////////////////////////////////////////////
    // shortcut keys
    ///////////////////////////////////////////////////////////////////////////
    const onKeyDown = (e: KeyboardEvent) => {
      switch (e.keyCode) {
        case 16: // [SHIFT]
          controller.isSnap = true;
          break;

        case 87: // W
          controllerMode.value = SceneViewportControllerModes.Translate;
          break;

        case 69: // E
          controllerMode.value = SceneViewportControllerModes.Rotate;
          break;

        case 82: // R
          controllerMode.value = SceneViewportControllerModes.Scale;
          break;

        case 81: // Q
          controllerSpace.value =
            controllerSpace.value == SceneViewportControllerSpaces.World
              ? SceneViewportControllerSpaces.Local
              : SceneViewportControllerSpaces.World;

          break;
      }
    };

    const onKeyUp = (e: KeyboardEvent) => {
      // [SHIFT]
      if (e.keyCode == 16) {
        controller.isSnap = false;
      }
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
