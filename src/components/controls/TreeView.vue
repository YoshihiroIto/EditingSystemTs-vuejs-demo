﻿<template>
  <div id="container">
    <TreeViewItem v-for="(child, index) in children" :data="child" :key="index" :root="root" :depth="0">
      <template v-for="slotName of Object.keys(slots)" #[slotName]="data">
        <slot :name="slotName" v-bind="data" />
      </template>
    </TreeViewItem>
  </div>
</template>

<style scoped lang="scss">
#container {
  width: max-content;
}
</style>

<script lang="ts">
import { defineComponent, SetupContext } from '@vue/composition-api';
import TreeViewItem from './TreeViewItem.vue';
import { TreeViewContext } from './TreeViewContext';

type Props = {
  isSelectedAction: (item: unknown) => boolean;
  isMultiselection: boolean;
};

export default defineComponent({
  props: {
    children: { default: null },
    isSelectedAction: { type: Function, default: null },
    isMultiselection: { type: Boolean, default: false },
  },
  components: {
    TreeViewItem,
  },
  setup(props: Props, context: SetupContext) {
    const root = new TreeViewContext(
      items => context.emit('set-selected-items', items),
      items => context.emit('toggle-selected-items', items),
      props.isSelectedAction,
      props.isMultiselection
    );

    return {
      root,
      slots: context.slots,
    };
  },
});
</script>
