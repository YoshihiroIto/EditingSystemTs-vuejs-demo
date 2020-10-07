<template>
  <div>
    <TreeView :children="children" @selectItem="onSelectItem" :selectedItem="selectedEntity">
      <template #itemTemplate="item">
        {{ item.data.name }}
        ({{ item.data.definitionName }}, isSelected:{{ item.data.isSelected }})
        <!-- {{ item.data.rotation }} -->
      </template>
    </TreeView>
  </div>
</template>

<script lang="ts">
import { Entity } from '@/models/entity/Entity';
import { defineComponent, SetupContext } from '@vue/composition-api';
import TreeView from './controls/TreeView.vue';

type Props = {
  children: Entity[] | null;
  selectedEntity: Entity | null;
};

export default defineComponent({
  props: {
    children: { default: null },
    selectedEntity: { default: null },
  },
  components: {
    TreeView,
  },
  setup: (props: Props, context: SetupContext) => {
    const onSelectItem = (e: unknown) => context.emit('update:selectedEntity', e);

    return {
      onSelectItem,
    };
  },
});
</script>
