<template>
  <div>
    <div
      :style="{ 'padding-left': indent }"
      :class="isSelected ? 'itemSelected' : 'item'"
      @click="onClickItem(data, $event)"
    >
      <div
        v-if="hasChildren"
        :class="isSelected ? 'expanderWrapperSelected' : 'expanderWrapper'"
        @click="onClickExpander"
      >
        <font-awesome-icon class="expander" :icon="isExpanded ? 'chevron-down' : 'chevron-right'" />
      </div>

      <slot name="itemTemplate" :data="data" />
    </div>

    <div v-show="isExpanded">
      <TreeViewItem
        v-for="(child, childIndex) in data.children"
        :root="root"
        :data="child"
        :key="childIndex"
        :depth="depth + 1"
      >
        <template v-for="slotName of Object.keys(slots)" #[slotName]="data">
          <slot :name="slotName" v-bind="data" />
        </template>
      </TreeViewItem>
    </div>
  </div>
</template>

<style scoped lang="scss">
$selected-color: #6d99ff;
$hover-color: #eee;

.item {
  display: flex;
  flex-flow: row no-wrap;
  cursor: pointer;

  &:hover {
    background: $hover-color;
  }
}

.itemSelected {
  @extend .item;
  background: $selected-color;

  &:hover {
    background: lighten($selected-color, 5%);
  }
}

.expander {
  margin: 4px 4px;
  width: 12px;
  height: 12px;
}

.expanderWrapper:hover {
  background: darken($hover-color, 10%);
}

.expanderWrapperSelected:hover {
  background: $selected-color;
}
</style>

<script lang="ts">
import { computed, defineComponent, ref, SetupContext } from '@vue/composition-api';
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
    data: { type: Object as () => HasChildren, default: null },
    root: { type: TreeViewContext, default: null },
    depth: { type: Number, default: 0 },
  },
  setup(props: Props, context: SetupContext) {
    const calcHasChildren = () => props.data.children != null && props.data.children.length > 0;

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
      isExpanded,
      isSelected,
      hasChildren,
      indent,
      onClickItem,
      onClickExpander,
      slots: context.slots,
    };
  },
});
</script>
