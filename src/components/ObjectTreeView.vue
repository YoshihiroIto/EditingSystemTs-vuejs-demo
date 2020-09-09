<template>
  <div>
    <TreeView :children="children">
      <template #itemTemplate="item">
        {{ item.data.constructor.name }}
        <!-- {{ item.data.position }} -->
        {{ item.data.rotation }}
      </template>
    </TreeView>
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api';
// import { HasChildren } from './controls/HasChildren';
import TreeView from './controls/TreeView.vue';

// type Props = {
//   children: HasChildren[] | null;
// };

export default defineComponent({
  props: {
    children: { default: null },
  },
  components: {
    TreeView,
  },
  // setup: (props: Props) => {
  //   console.log(props.children);
  // },
});
</script>
