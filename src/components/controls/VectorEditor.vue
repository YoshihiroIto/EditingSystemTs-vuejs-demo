<template>
  <div id="container">
    <div>X:</div>
    <div>
      <NumberEditor
        :value.sync="x"
        :min="min"
        :max="max"
        :step="step"
        @begin-continuous-editing="emitBeginContinuousEditing"
        @end-continuous-editing="emitEndContinuousEditing"
      />
    </div>

    <div>Y:</div>
    <div>
      <NumberEditor
        :value.sync="y"
        :min="min"
        :max="max"
        :step="step"
        @begin-continuous-editing="emitBeginContinuousEditing"
        @end-continuous-editing="emitEndContinuousEditing"
      />
    </div>

    <div>Z:</div>
    <div>
      <NumberEditor
        :value.sync="z"
        :min="min"
        :max="max"
        :step="step"
        @begin-continuous-editing="emitBeginContinuousEditing"
        @end-continuous-editing="emitEndContinuousEditing"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
#container {
  display: grid;

  grid-template-columns: auto 1fr;
  grid-template-rows: 1fr 1fr 1fr;
}
</style>

<script lang="ts">
import { defineComponent, SetupContext, computed } from '@vue/composition-api';
import NumberEditor from './NumberEditor.vue';

type Props = {
  valueX: number;
  valueY: number;
  valueZ: number;
  min: number;
  max: number;
  step: number;
};

export default defineComponent({
  props: {
    valueX: { type: Number, default: 0 },
    valueY: { type: Number, default: 0 },
    valueZ: { type: Number, default: 0 },
    min: { type: Number, default: -1 },
    max: { type: Number, default: +1 },
    step: { type: Number, default: 0.001 },
  },
  components: {
    NumberEditor,
  },
  setup(props: Props, context: SetupContext) {
    const emitBeginContinuousEditing = () => context.emit('begin-continuous-editing');
    const emitEndContinuousEditing = () => context.emit('end-continuous-editing');

    const x = computed({
      get: () => props.valueX,
      set: (value: number) => context.emit('update:valueX', value),
    });

    const y = computed({
      get: () => props.valueY,
      set: (value: number) => context.emit('update:valueY', value),
    });

    const z = computed({
      get: () => props.valueZ,
      set: (value: number) => context.emit('update:valueZ', value),
    });

    return {
      x,
      y,
      z,
      emitBeginContinuousEditing,
      emitEndContinuousEditing,
    };
  },
});
</script>
