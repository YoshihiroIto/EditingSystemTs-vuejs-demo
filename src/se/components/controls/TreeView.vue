<template>
  <div v-if="children != null">
    <TreeViewItem v-for="(child, index) in children" :data="child" :key="index">
      <template v-for="slotName of Object.keys($scopedSlots)" #[slotName]="data">
        <slot :name="slotName" v-bind="data"></slot>
      </template>
    </TreeViewItem>
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api';
import TreeViewItem from './TreeViewItem.vue';

export default defineComponent({
  props: {
    children: { default: null },
  },
  components: {
    TreeViewItem,
  },
});
</script>
