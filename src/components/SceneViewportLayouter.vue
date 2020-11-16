<template>
  <div class="container" ref="container" tabindex="0">
    <SceneViewport
      id="viewport1"
      ref="viewport1"
      :scene="scene"
      :selectedEntity="selectedEntity"
      :updated="updated"
      @begin-continuous-editing="beginContinuousEditing"
      @end-continuous-editing="endContinuousEditing"
    />

    <SceneViewport
      id="viewport2"
      ref="viewport2"
      :scene="scene"
      :selectedEntity="selectedEntity"
      :updated="updated"
      @begin-continuous-editing="beginContinuousEditing"
      @end-continuous-editing="endContinuousEditing"
    />
  </div>
</template>

<style scoped lang="scss">
$base-gap: 4px;

.container {
  display: grid;

  width: 100%;
  height: 100%;

  gap: $base-gap;

  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr;

  grid-template-areas: 'viewport1 viewport2';

  &:focus {
    outline: none;
  }
}

#viewport1 {
  grid-area: viewport1;
}

#viewport2 {
  grid-area: viewport2;
}
</style>

<script lang="ts">
import SceneViewport from './SceneViewport.vue';
import { defineComponent, onMounted, onUnmounted, ref } from '@vue/composition-api';
import { Entity } from '../models/entity/Entity';
import { ThObject3D } from '../th/ThObject';
import { TypedEvent } from '../../externals/EditingSystemTs/src/TypedEvent';
import { Assert } from '../../externals/EditingSystemTs/src/Assert';
import ResizeObserver from 'resize-observer-polyfill';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
type Props = {
  scene: ThObject3D | null;
  selectedEntity: Entity | null;
  updated: TypedEvent | null;
  beginContinuousEditing: unknown | null;
  endContinuousEditing: unknown | null;
};

export default defineComponent({
  props: {
    scene: { default: null },
    selectedEntity: { default: null },
    updated: { default: null },
    beginContinuousEditing: { default: null },
    endContinuousEditing: { default: null },
  },
  components: {
    SceneViewport,
  },
  setup() {
    const container = ref<HTMLElement>();
    const viewport1 = ref<InstanceType<typeof SceneViewport>>();
    const viewport2 = ref<InstanceType<typeof SceneViewport>>();

    const resizeObserver: ResizeObserver = new ResizeObserver(entries => {
      Assert.isNotNull(viewport1.value);
      Assert.isNotNull(viewport2.value);

      const height = entries[0].contentRect.height + 'px';

      (viewport1.value.$el as HTMLElement).style.height = height;
      (viewport2.value.$el as HTMLElement).style.height = height;
    });

    onMounted(() => {
      resizeObserver.observe(container.value as Element);
    });

    onUnmounted(() => {
      resizeObserver.unobserve(container.value as Element);
      resizeObserver.disconnect();
    });

    return {
      container,
      viewport1,
      viewport2,
    };
  },
});
</script>
