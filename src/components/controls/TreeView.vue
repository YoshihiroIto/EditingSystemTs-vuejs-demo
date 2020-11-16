<template>
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
import { defineComponent, SetupContext, watch } from '@vue/composition-api';
import TreeViewItem from './TreeViewItem.vue';
import { TreeViewContext } from './TreeViewContext';

type Props = {
  selectedItem: unknown;
};

export default defineComponent({
  props: {
    children: { default: null },
    selectedItem: { type: Object, default: null },
  },
  components: {
    TreeViewItem,
  },
  setup(props: Props, context: SetupContext) {
    const root = new TreeViewContext(item => context.emit('select-item', item), props.selectedItem);

    watch(
      () => props.selectedItem,
      newValue => root.SelectItem(newValue)
    );

    return {
      root,
      slots: context.slots,
    };
  },
});
</script>
