<template>
  <div id="container" ref="container">
    <div id="toolbar" ref="toolbar" />
    <div id="canvas-wrapper" ref="canvasWrapper">
      <canvas id="canvas" ref="canvas" />
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

  height: 48px;
  background: lightgray;
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
}
</style>

<script lang="ts">
import { SeObject3D } from '@/se/SeObject3D';
import { ThObject3D } from '@/th/ThObject';
import { defineComponent, onMounted, onUnmounted, ref, SetupContext, watch } from '@vue/composition-api';
import { Assert } from '../../externals/EditingSystemTs/src/Assert';
import { from } from 'linq-to-typescript';
import { PerspectiveCamera, WebGLRenderer } from 'three';
import Stats from 'three/examples/jsm/libs/stats.module';
import { TypedEvent } from '../../externals/EditingSystemTs/src/TypedEvent';
import { CameraHelper } from '../foundations/CameraHelper';
import { SceneViewportController } from './SceneViewportController';
import { SceneViewportHelper } from './SceneViewportHelper';

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
  setup(props: Props, context: SetupContext) {
    const container = ref<HTMLCanvasElement>();
    const toolbar = ref<HTMLCanvasElement>();
    const canvasWrapper = ref<HTMLDivElement>();
    const canvas = ref<HTMLCanvasElement>();
    const stats = Stats();

    // camera
    const camera = new PerspectiveCamera(45, 600 / 400, 0.1, 1000);
    camera.position.set(0, 0, 20);
    camera.lookAt(0, 0, 0);

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const resizeObserver: ResizeObserver = new ResizeObserver(entries => {
      Assert.isNotNull(canvasWrapper.value);
      Assert.isNotNull(toolbar.value);

      // const w = entries[0].contentRect.width;
      const h = entries[0].contentRect.height - toolbar.value.clientHeight;

      // canvasWrapper.value.style.width = w + 'px';
      canvasWrapper.value.style.height = h + 'px';

      requestRender();
    });

    let renderer: WebGLRenderer | null = null;
    let controller: SceneViewportController | null = null;
    let helper: SceneViewportHelper | null = null;

    onMounted(() => {
      Assert.isNotNull(props.scene);

      renderer = new WebGLRenderer({
        antialias: true,
        canvas: canvas.value,
      });
      renderer.setPixelRatio(window.devicePixelRatio);

      resizeObserver.observe(container.value);
      props.updated?.on(requestRender);

      controller = new SceneViewportController(props.scene, camera, renderer.domElement, requestRender);
      controller.beginContinuousEditing.on(() => context.emit('begin-continuous-editing'));
      controller.endContinuousEditing.on(() => context.emit('end-continuous-editing'));
      controller.objectsPicked.on((_, e) => context.emit('update:selectedObject', e.objects[0].model));

      helper = new SceneViewportHelper(props.scene);

      // stats
      stats.dom.style.position = 'absolute';
      stats.showPanel(2);
      canvasWrapper.value?.appendChild(stats.dom);
    });

    onUnmounted(() => {
      props.updated?.off(requestRender);

      resizeObserver.unobserve(canvas.value);
      resizeObserver.disconnect();

      helper?.dispose();
      controller?.dispose();
      renderer?.dispose();
    });

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

    let frameCount = ref(0);
    let resizeCount = ref(0);
    const render = () => {
      if (renderer == null) {
        return;
      }
      if (props.scene == null) {
        return;
      }

      // canvas size
      {
        const canvas = renderer.domElement;
        const width = canvas.clientWidth;
        const height = canvas.clientHeight;
        const needResize = canvas.width !== width || canvas.height !== height;

        if (needResize) {
          renderer.setSize(width, height, false);
          CameraHelper.SetAspect(camera, width / height);

          ++resizeCount.value;
        }
      }

      ++frameCount.value;

      renderer?.render(props.scene, camera);
      stats.update();
    };

    return {
      container,
      toolbar,
      canvasWrapper,
      canvas,
      frameCount,
      resizeCount,
    };
  },
});
</script>
