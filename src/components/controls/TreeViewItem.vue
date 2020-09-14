<template>
  <div>
    <div
      :style="{ 'padding-left': indent }"
      :class="isSelected ? 'itemSelected' : 'item'"
      @click="onClickItem(itemData, $event)"
    >
      <div
        v-if="hasChildren"
        :class="isSelected ? 'expanderWrapperSelected' : 'expanderWrapper'"
        @click="onClickExpander"
      >
        <font-awesome-icon class="expander" :icon="isExpanded ? 'chevron-down' : 'chevron-right'" />
      </div>

      <slot name="itemTemplate" :data="itemData" />
    </div>

    <TreeViewItem
      v-show="isExpanded"
      v-for="(child, childIndex) in children"
      :root="root"
      :data="child"
      :key="childIndex"
      :depth="depth + 1"
    >
      <template v-for="slotName of Object.keys($scopedSlots)" #[slotName]="data">
        <slot :name="slotName" v-bind="data" />
      </template>
    </TreeViewItem>
  </div>
</template>

<style scoped>
.item {
  display: flex;
  flex-flow: row no-wrap;
  cursor: pointer;
}

.item:hover {
  background-color: #eee;
}

.itemSelected {
  display: flex;
  flex-flow: row no-wrap;
  cursor: pointer;

  background-color: #aaf;
}

.itemSelected:hover {
  background-color: #ccf;
}

.expander {
  margin: 4px 4px;
  width: 12px;
  height: 12pxk;
}

.expanderWrapper:hover {
  background: #ccc;
}

.expanderWrapperSelected:hover {
  background-color: #aaf;
}
</style>

<script lang="ts">
import { computed, defineComponent, ref } from '@vue/composition-api';
import { HasChildren } from './HasChildren';
import { TreeViewContext } from './TreeViewContext';

type Props = {
  data: HasChildren;
  root: TreeViewContext;
  depth: number;
};

export default defineComponent({
  name: 'TreeViewItem',
  props: {
    data: { default: null },
    root: { default: null },
    depth: { default: 0 },
  },
  setup(props: Props) {
    const calcHasChildren = () => children.value != null && children.value.length > 0;

    const itemData = ref(props.data);
    const children = ref(props.data.children);
    const isExpanded = ref(true);
    const isSelected = computed(() => props.root.IsSelectedItem(props.data));
    const hasChildren = computed(() => calcHasChildren());
    const indent = computed(() => (props.depth + (calcHasChildren() ? 0 : 1)) * 20 + 'px');

    const onClickItem = (item: unknown, e: MouseEvent) => {
      if (e.ctrlKey) {
        props.root.ToggleSelectItem(item);
      } else {
        props.root.SelectItem(item);
      }
    };

    const onClickExpander = (e: Event) => {
      isExpanded.value = !isExpanded.value;
      e.stopPropagation();
    };

    return {
      itemData,
      children,
      isExpanded,
      isSelected,
      hasChildren,
      indent,
      onClickItem,
      onClickExpander,
    };
  },
});
</script>
