<template>
  <canvas ref="canvas" :width="width" :height="height" />
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, watch } from '@vue/composition-api';
import { Camera, Scene, WebGLRenderer } from 'three';
import { TypedEvent } from '../../externals/EditingSystemTs/src/TypedEvent';
import { CameraHelper } from '../models/CameraHelper';

type Props = {
  scene: Scene;
  camera: Camera;
  updated: TypedEvent;
  width: number;
  height: number;
};

export default defineComponent({
  props: {
    scene: { default: null },
    camera: { default: null },
    updated: { default: null },
    width: { default: 1 },
    height: { default: 1 },
  },
  setup(props: Props) {
    const canvas = ref<HTMLCanvasElement>();

    let renderer: WebGLRenderer;

    onMounted(() => {
      renderer = new WebGLRenderer({
        antialias: true,
        canvas: canvas.value,
      });
    });

    props.updated.on(() => renderer.render(props.scene, props.camera));

    const setAspect = () => CameraHelper.SetAspect(props.camera, props.width / props.height);

    watch(() => props.width, setAspect);
    watch(() => props.height, setAspect);

    setAspect();

    return {
      canvas,
    };
  },
});
</script>
