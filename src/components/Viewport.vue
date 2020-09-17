<template>
  <div class="wrapper" ref="canvasWrapper">
    <canvas class="canvas" ref="canvas" />
  </div>
</template>

<style scoped>
.wrapper {
  position: relative;
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
      props.updated.on(render);

      cameraControls = new OrbitControls(camera, renderer.domElement);

      // stats
      stats.dom.style.position = 'absolute';
      stats.showPanel(0);
      canvasWrapper.value?.appendChild(stats.dom);
    });

    onUnmounted(() => {
      props.updated.off(render);

      resizeObserver.unobserve(canvas.value);
      resizeObserver.disconnect();

      cameraControls?.dispose();
      renderer?.dispose();
    });

    const render = () => {
      renderer?.render(props.scene, camera);
      stats.update();
    };

    return {
      canvas,
      canvasWrapper,
    };
  },
});
</script>
