<template>
  <div v-if="children != null">
    <TreeViewItem @click.native="onItemClicked(child)" v-for="(child, index) in children" :data="child" :key="index">
      <template v-for="slotName of Object.keys($scopedSlots)" #[slotName]="data">
        <slot :name="slotName" v-bind="data" />
      </template>
    </TreeViewItem>
  </div>
</template>

<script lang="ts">
import { defineComponent, SetupContext } from '@vue/composition-api';
import TreeViewItem from './TreeViewItem.vue';

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
    const onItemClicked = (e: unknown) => {
      context.emit('selectedItem', e);
    };

    return {
      onItemClicked,
    };
  },
});
</script>
