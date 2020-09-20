<template>
  <div>
    <template v-if="target != null">
      name: {{ target.name }}
      <br />
      objectDefinitionName: {{ target.objectDefinitionName }}
      <br />

      <br />
      position:
      <VectorEditor
        @begin-continuous-editing="emitBeginContinuousEditing"
        @end-continuous-editing="emitEndContinuousEditing"
        :min="-10"
        :max="10"
        :valueX.sync="positionX"
        :valueY.sync="positionY"
        :valueZ.sync="positionZ"
      />

      <br />
      rotation:
      <VectorEditor
        @begin-continuous-editing="emitBeginContinuousEditing"
        @end-continuous-editing="emitEndContinuousEditing"
        :min="npi"
        :max="ppi"
        :valueX.sync="rotationX"
        :valueY.sync="rotationY"
        :valueZ.sync="rotationZ"
      />
    </template>

    <template v-else>unselected</template>
  </div>
</template>

<script lang="ts">
import { defineComponent, SetupContext } from '@vue/composition-api';
import { SeObject3D } from '@/se/SeObject3D';
import VectorEditor from './controls/VectorEditor.vue';
import { createComputedVector3 } from './ComponentHelper';

type Props = {
  target: SeObject3D | null;
};

export default defineComponent({
  props: {
    target: { default: null },
  },
  components: {
    VectorEditor,
  },
  setup: (props: Props, context: SetupContext) => {
    const emitBeginContinuousEditing = () => context.emit('begin-continuous-editing');
    const emitEndContinuousEditing = () => context.emit('end-continuous-editing');

    const [positionX, positionY, positionZ] = createComputedVector3(
      () => props.target?.position,
      v => {
        if (props.target?.position != null) {
          props.target.position = v;
        }
      }
    );

    const [rotationX, rotationY, rotationZ] = createComputedVector3(
      () => props.target?.rotation,
      v => {
        if (props.target?.rotation != null) {
          props.target.rotation = v;
        }
      }
    );

    const npi = -Math.PI;
    const ppi = Math.PI;

    return {
      emitBeginContinuousEditing,
      emitEndContinuousEditing,
      //
      positionX,
      positionY,
      positionZ,
      rotationX,
      rotationY,
      rotationZ,
      //
      npi,
      ppi,
    };
  },
});
</script>
