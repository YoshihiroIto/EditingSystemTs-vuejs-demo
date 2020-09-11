<template>
  <canvas ref="canvas" />
</template>

<style scoped>
canvas {
  width: 100%;
  height: 100%;
}
</style>

<script lang="ts">
import { defineComponent, onMounted, onUnmounted, ref } from '@vue/composition-api';
import { Camera, Scene, WebGLRenderer } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { TypedEvent } from '../../externals/EditingSystemTs/src/TypedEvent';
import { CameraHelper } from '../foundations/CameraHelper';

type Props = {
  scene: Scene;
  camera: Camera;
  updated: TypedEvent;
};

export default defineComponent({
  props: {
    scene: { default: null },
    camera: { default: null },
    updated: { default: null },
  },
  setup(props: Props) {
    const canvas = ref<HTMLCanvasElement>();

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const resizeObserver: ResizeObserver = new ResizeObserver(entries => {
      const w = entries[0].contentRect.width;
      const h = entries[0].contentRect.height;

      CameraHelper.SetAspect(props.camera, w / h);
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

      cameraControls = new OrbitControls(props.camera, renderer.domElement);
    });

    onUnmounted(() => {
      props.updated.off(render);

      resizeObserver.unobserve(canvas.value);
      resizeObserver.disconnect();

      cameraControls?.dispose();
      renderer?.dispose();
    });

    const render = () => renderer?.render(props.scene, props.camera);

    return {
      canvas,
    };
  },
});
</script>
