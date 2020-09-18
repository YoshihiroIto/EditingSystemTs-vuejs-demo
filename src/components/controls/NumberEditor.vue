<template>
  <div>
    <input
      type="number"
      :value="value"
      @keydown="textKeyDown"
      @keyup="textKeyUp"
      @focusin="textFocusin"
      @focusout="textFocusout"
      @input="$emit('update:value', parseInt($event.target.value))"
    />

    <input
      id="slider"
      type="range"
      min="0"
      max="1000"
      step="1"
      :value="value"
      @mousedown="sliderMouseDown"
      @mouseup="sliderMouseUp"
      @input="$emit('update:value', parseInt($event.target.value))"
    />
  </div>
</template>
<style scoped>
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

type Props = {
  value: number;
};

export default defineComponent({
  props: {
    value: { type: Number, default: 0 },
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

      if (e.key == 'Enter') {
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
