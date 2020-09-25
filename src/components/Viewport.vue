<template>
  <div class="wrapper" ref="canvasWrapper">
    <canvas class="canvas" ref="canvas" height="60" />
    <div class="info">FrameCount: {{ frameCount }}</div>
  </div>
</template>

<style scoped lang="scss">
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
import { SeObject3D } from '@/se/SeObject3D';
import { ThObject3D } from '@/th/ThObject';
import { defineComponent, onMounted, onUnmounted, ref, SetupContext, watch } from '@vue/composition-api';
import { Assert } from '../../externals/EditingSystemTs/src/Assert';
import { from } from 'linq-to-typescript';
import { PerspectiveCamera, WebGLRenderer } from 'three';
import Stats from 'three/examples/jsm/libs/stats.module';
import { TypedEvent } from '../../externals/EditingSystemTs/src/TypedEvent';
import { CameraHelper } from '../foundations/CameraHelper';
import { ViewportController } from './ViewportController';
import { ViewportHelper } from './ViewportHelper';

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
    let controller: ViewportController | null = null;
    let helper: ViewportHelper | null = null;

    onMounted(() => {
      Assert.isNotNull(props.scene);

      renderer = new WebGLRenderer({
        antialias: true,
        canvas: canvas.value,
      });
      renderer.setPixelRatio(window.devicePixelRatio);

      resizeObserver.observe(canvas.value);
      props.updated?.on(requestRender);

      controller = new ViewportController(props.scene, camera, renderer.domElement, requestRender);
      controller.beginContinuousEditing.on(() => context.emit('begin-continuous-editing'));
      controller.endContinuousEditing.on(() => context.emit('end-continuous-editing'));
      controller.objectsPicked.on((_, e) => context.emit('update:selectedObject', e.objects[0].model));

      helper = new ViewportHelper(props.scene);

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
    const render = () => {
      Assert.isNotNull(props.scene);

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
