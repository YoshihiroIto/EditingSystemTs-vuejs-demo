<template>
  <div id="container" ref="container">
    <div id="canvas-wrapper" ref="canvasWrapper">
      <canvas id="canvas" ref="canvas" />
    </div>
  </div>
</template>

<style scoped lang="scss">
#container {
  display: grid;

  grid-template-columns: 1fr;
  grid-template-rows: 1fr;

  grid-template-areas: 'canvas';
}

#canvas-wrapper {
  grid-area: canvas;
  position: relative;
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
import { Entity } from '@/models/entity/Entity';
import { ThObject3D } from '@/th/ThObject';
import { defineComponent, onMounted, onUnmounted, ref } from '@vue/composition-api';
import { Assert } from '../../externals/EditingSystemTs/src/Assert';
import { CompositeDisposable } from '../../externals/EditingSystemTs/src/CompositeDisposable';
import { PerspectiveCamera } from 'three';
import { TypedEvent } from '../../externals/EditingSystemTs/src/TypedEvent';
import ResizeObserver from 'resize-observer-polyfill';
import { ViewportRenderer } from '@/runtime/ViewportRenderer';

type Props = {
  scene: ThObject3D | null;
  selectedEntity: Entity | null;
  updated: TypedEvent | null;
};

export default defineComponent({
  props: {
    scene: { default: null },
    updated: { default: null },
  },
  components: {},
  setup(props: Props) {
    const container = ref<HTMLElement>();
    const canvasWrapper = ref<HTMLElement>();
    const canvas = ref<HTMLCanvasElement>();

    ///////////////////////////////////////////////////////////////////////////
    // camera
    ///////////////////////////////////////////////////////////////////////////
    const camera = new PerspectiveCamera(45, 600 / 400, 0.1, 1000);
    camera.position.set(0, 0, 20);
    camera.lookAt(0, 0, 0);

    const resizeObserver: ResizeObserver = new ResizeObserver(entries => {
      Assert.isNotNull(canvasWrapper.value);

      // const w = entries[0].contentRect.width;
      const h = entries[0].contentRect.height;

      // canvasWrapper.value.style.width = w + 'px';
      canvasWrapper.value.style.height = h + 'px';

      requestRender();
    });

    let renderer: ViewportRenderer;

    const trash = new CompositeDisposable();

    onMounted(() => {
      Assert.isNotNull(canvas.value);

      resizeObserver.observe(container.value as Element);
      props.updated?.on(requestRender);

      renderer = new ViewportRenderer(canvas.value);

      trash.push(renderer);
    });

    onUnmounted(() => {
      props.updated?.off(requestRender);

      resizeObserver.unobserve(canvas.value as Element);
      resizeObserver.disconnect();

      trash.dispose();
    });

    ///////////////////////////////////////////////////////////////////////////
    // render
    ///////////////////////////////////////////////////////////////////////////
    const requestRender = () => {
      if (props.scene == null) {
        return;
      }
      renderer.requestRender(props.scene, camera);
    };

    return {
      container,
      canvasWrapper,
      canvas,
    };
  },
});
</script>
