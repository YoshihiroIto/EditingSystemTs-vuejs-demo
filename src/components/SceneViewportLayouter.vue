<template>
  <div class="container" tabindex="0">
    <SceneViewport
      id="viewport1"
      :scene="scene"
      :selectedEntity.sync="selectedEntityInternal"
      :updated="updated"
      @begin-continuous-editing="beginContinuousEditing"
      @end-continuous-editing="endContinuousEditing"
    />

    <SceneViewport
      id="viewport2"
      :scene="scene"
      :selectedEntity.sync="selectedEntityInternal"
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

import { defineComponent, ref, SetupContext, watch } from '@vue/composition-api';
import { Entity } from '../models/entity/Entity';
import { ThObject3D } from '@/th/ThObject';
import { TypedEvent } from 'externals/EditingSystemTs/src/TypedEvent';

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
  setup(props: Props, context: SetupContext) {
    const selectedEntityInternal = ref(props.selectedEntity);

    watch(selectedEntityInternal, v => context.emit('update:selectedEntity', v));

    watch(
      () => props.selectedEntity,
      v => (selectedEntityInternal.value = v)
    );

    return {
      selectedEntityInternal,
    };
  },
});
</script>
