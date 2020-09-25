<template>
  <div>
    <template v-if="target != null">
      name:
      <TextBox
        @begin-continuous-editing="emitBeginContinuousEditing"
        @end-continuous-editing="emitEndContinuousEditing"
        :value.sync="target.name"
      />

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
import { nameof } from '@/foundations/Nameof';
import { createComputedVector3 } from './ComponentHelper';
import VectorEditor from './controls/VectorEditor.vue';
import TextBox from './controls/TextBox.vue';

type Props = {
  target: SeObject3D | null;
};

export default defineComponent({
  props: {
    target: { default: null },
  },
  components: {
    VectorEditor,
    TextBox,
  },
  setup: (props: Props, context: SetupContext) => {
    const emitBeginContinuousEditing = () => context.emit('begin-continuous-editing');
    const emitEndContinuousEditing = () => context.emit('end-continuous-editing');

    const [positionX, positionY, positionZ] = createComputedVector3(() => props.target, nameof<SeObject3D>('position'));
    const [rotationX, rotationY, rotationZ] = createComputedVector3(() => props.target, nameof<SeObject3D>('rotation'));

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
      npi: -Math.PI,
      ppi: Math.PI,
    };
  },
});
</script>
