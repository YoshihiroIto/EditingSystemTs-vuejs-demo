<template>
  <div>
    <input
      type="number"
      :value="value"
      :min="min"
      :max="max"
      :step="step"
      @keydown="textKeyDown"
      @keyup="textKeyUp"
      @focusin="textFocusin"
      @focusout="textFocusout"
      @input="$emit('update:value', parseFloat($event.target.value))"
    />

    <input
      id="slider"
      type="range"
      :value="value"
      :min="min"
      :max="max"
      :step="step"
      @mousedown="sliderMouseDown"
      @mouseup="sliderMouseUp"
      @input="$emit('update:value', parseFloat($event.target.value))"
    />
  </div>
</template>
<style scoped lang="scss">
#slider {
  vertical-align: middle;
}

/* Hide spin buttons */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
input[type='number'] {
  -moz-appearance: textfield;
}
</style>

<script lang="ts">
import { defineComponent, SetupContext } from '@vue/composition-api';
import { isEditingConfirmation } from '../ComponentHelper';

type Props = {
  value: number;
  min: number;
  max: number;
  step: number;
};

export default defineComponent({
  props: {
    value: { type: Number, default: 0 },
    min: { type: Number, default: -100 },
    max: { type: Number, default: +100 },
    step: { type: Number, default: 1 },
  },
  setup(props: Props, context: SetupContext) {
    const emitBeginContinuousEditing = () => context.emit('begin-continuous-editing');
    const emitEndContinuousEditing = () => context.emit('end-continuous-editing');

    const sliderMouseDown = emitBeginContinuousEditing;
    const sliderMouseUp = emitEndContinuousEditing;
    const textFocusin = emitBeginContinuousEditing;
    const textFocusout = emitEndContinuousEditing;

    const textKeyDown = (e: KeyboardEvent) => {
      if (e.repeat == false) {
        if (e.key == 'ArrowUp' || e.key == 'ArrowDown') {
          emitBeginContinuousEditing();
        }
      }

      if (isEditingConfirmation(e)) {
        emitEndContinuousEditing();
        emitBeginContinuousEditing();
      }
    };

    const textKeyUp = (e: KeyboardEvent) => {
      if (e.key == 'ArrowUp' || e.key == 'ArrowDown') {
        emitEndContinuousEditing();
      }
    };

    return {
      sliderMouseDown,
      sliderMouseUp,
      //
      textKeyDown,
      textKeyUp,
      textFocusin,
      textFocusout,
    };
  },
});
</script>
