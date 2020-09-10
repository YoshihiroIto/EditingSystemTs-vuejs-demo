<template>
  <div>
    <TreeView :children="children" @selectedItem="onSelectedItem">
      <template #itemTemplate="item">
        {{ item.data.name }}
        {{ item.data.position }}
        <!-- {{ item.data.rotation }} -->
      </template>
    </TreeView>
  </div>
</template>

<script lang="ts">
import { SeObject3D } from '@/se/SeObject3D';
import { defineComponent, SetupContext } from '@vue/composition-api';
import TreeView from './controls/TreeView.vue';

type Props = {
  children: SeObject3D[] | null;
  selectedObject: SeObject3D | null;
};

export default defineComponent({
  props: {
    children: { default: null },
    selectedObject: { default: null },
  },
  components: {
    TreeView,
  },
  setup: (props: Props, context: SetupContext) => {
    const onSelectedItem = (e: unknown) => {
      context.emit('update:selectedObject', e);
    };

    return {
      onSelectedItem,
    };
  },
});
</script>
