<template>
  <input
    type="text"
    :value="value"
    @focusin="textFocusin"
    @focusout="textFocusout"
    @keydown="textKeyDown"
    @input="$emit('update:value', $event.target.value)"
  />
</template>

<script lang="ts">
import { defineComponent, SetupContext } from '@vue/composition-api';
import { isEditingConfirmation } from '../ComponentHelper';

type Props = {
  value: string;
};

export default defineComponent({
  props: {
    value: { type: String, default: '' },
  },
  setup(props: Props, context: SetupContext) {
    const emitBeginContinuousEditing = () => context.emit('begin-continuous-editing');
    const emitEndContinuousEditing = () => context.emit('end-continuous-editing');

    const textFocusin = emitBeginContinuousEditing;
    const textFocusout = emitEndContinuousEditing;

    const textKeyDown = (e: KeyboardEvent) => {
      if (isEditingConfirmation(e)) {
        emitEndContinuousEditing();
        emitBeginContinuousEditing();
      }
    };

    return {
      textFocusin,
      textFocusout,
      //
      textKeyDown,
    };
  },
});
</script>
