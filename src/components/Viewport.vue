<template>
  <div class="wrapper" ref="canvasWrapper">
    <canvas class="canvas" ref="canvas" height="60" />
    <div class="info">FrameCount: {{ frameCount }}</div>
  </div>
</template>

<style scoped>
.wrapper {
  position: relative;
}

.info {
  position: absolute;
  color: lightgray;
  font-size: small;
  top: 50px;
  left: 0px;
}

.canvas {
  width: 100%;
  height: 100%;
}
</style>

<script lang="ts">
import { defineComponent, onMounted, onUnmounted, ref } from '@vue/composition-api';
import { PerspectiveCamera, Scene, WebGLRenderer } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { TypedEvent } from '../../externals/EditingSystemTs/src/TypedEvent';
import { CameraHelper } from '../foundations/CameraHelper';
import Stats from 'three/examples/jsm/libs/stats.module';

type Props = {
  scene: Scene;
  updated: TypedEvent;
};

export default defineComponent({
  props: {
    scene: { default: null },
    updated: { default: null },
  },
  setup(props: Props) {
    const canvas = ref<HTMLCanvasElement>();
    const canvasWrapper = ref<HTMLDivElement>();
    const stats = Stats();

    // camera
    const camera = new PerspectiveCamera(45, 600 / 400, 0.1, 1000);
    camera.position.set(0, 0, 20);
    camera.lookAt(0, 0, 0);

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const resizeObserver: ResizeObserver = new ResizeObserver(entries => {
      const w = entries[0].contentRect.width;
      const h = entries[0].contentRect.height;

      CameraHelper.SetAspect(camera, w / h);
      renderer?.setSize(w, h, false);

      requestRender();
    });

    let renderer: WebGLRenderer | null = null;
    let cameraControls: OrbitControls | null = null;

    onMounted(() => {
      renderer = new WebGLRenderer({
        antialias: true,
        canvas: canvas.value,
      });
      renderer.setPixelRatio(window.devicePixelRatio);

      resizeObserver.observe(canvas.value);
      props.updated.on(requestRender);

      cameraControls = new OrbitControls(camera, renderer.domElement);
      cameraControls.addEventListener('change', requestRender);

      // stats
      stats.dom.style.position = 'absolute';
      stats.showPanel(0);
      canvasWrapper.value?.appendChild(stats.dom);
    });

    onUnmounted(() => {
      cameraControls?.removeEventListener('change', requestRender);

      props.updated.off(requestRender);

      resizeObserver.unobserve(canvas.value);
      resizeObserver.disconnect();

      cameraControls?.dispose();
      renderer?.dispose();
    });

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
    const render = () => {
      ++frameCount.value;

      renderer?.render(props.scene, camera);
      stats.update();
    };

    return {
      canvas,
      canvasWrapper,
      frameCount,
    };
  },
});
</script>
