<template>
  <div>
    <TreeView :children="children" @selectItem="onSelectItem" :selectedItem="selectedObject">
      <template #itemTemplate="item">
        <div>
          {{ item.data.name }}
          {{ item.data.position }}
          <!-- {{ item.data.rotation }} -->
        </div>
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
    const onSelectItem = (e: unknown) => context.emit('update:selectedObject', e);

    return {
      onSelectItem,
    };
  },
});
</script>
