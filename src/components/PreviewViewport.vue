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
import { defineComponent, onMounted, onUnmounted, ref } from '@vue/composition-api';
import { Assert } from '../../externals/EditingSystemTs/src/Assert';
import { CompositeDisposable } from '../../externals/EditingSystemTs/src/CompositeDisposable';
import { PerspectiveCamera } from 'three';
import { AppState } from '@/models/AppState';
import { dic } from '@/di/dic';
import { RuntimePlayer } from '@/runtime/RuntimePlayer';
import ResizeObserver from 'resize-observer-polyfill';

export default defineComponent({
  setup() {
    const container = ref<HTMLElement>();
    const canvasWrapper = ref<HTMLElement>();
    const canvas = ref<HTMLCanvasElement>();
    //
    const appState = dic().resolve(AppState);
    let runtimePlayer: RuntimePlayer | null = null;

    let isStarted = false;

    ///////////////////////////////////////////////////////////////////////////
    // camera
    ///////////////////////////////////////////////////////////////////////////
    const camera = new PerspectiveCamera(45, 600 / 400, 0.1, 1000);
    camera.position.set(0, 0, 20);
    camera.lookAt(0, 0, 0);

    const resizeObserver: ResizeObserver = new ResizeObserver(entries => {
      Assert.isNotNull(canvas.value);
      Assert.isNotNull(canvasWrapper.value);
      Assert.isNotNull(appState?.previewer);
      Assert.isNotNull(runtimePlayer);

      // const w = entries[0].contentRect.width;
      const h = entries[0].contentRect.height;

      // canvasWrapper.value.style.width = w + 'px';
      canvasWrapper.value.style.height = h + 'px';

      if (isStarted === false) {
        runtimePlayer.start(appState.previewer.project, canvas.value);

        appState.previewer.start();
        isStarted = true;
      }
    });

    const trash = new CompositeDisposable();

    onMounted(() => {
      runtimePlayer = dic().resolve(RuntimePlayer);
      trash.push(runtimePlayer);

      resizeObserver.observe(container.value as Element);
    });

    onUnmounted(() => {
      resizeObserver.unobserve(canvas.value as Element);
      resizeObserver.disconnect();

      runtimePlayer = null;
      trash.dispose();
    });

    return {
      container,
      canvasWrapper,
      canvas,
    };
  },
});
</script>
