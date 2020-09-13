<template>
  <div>
    <div :style="{ 'padding-left': indent }" class="item" @click="onClick(itemData, $event)">
      <input type="checkbox" v-model="isExpanded" v-show="hasChildren" id="Expander" />

      <slot name="itemTemplate" :data="itemData" />
    </div>

    <div :class="children" v-show="isExpanded">
      <TreeViewItem
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
</style>

<script lang="ts">
import { computed, defineComponent, ref } from '@vue/composition-api';
import { HasChildren } from './HasChildren';
import { TreeViewContext } from './TreeView.vue';

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
    const hasChildren = computed(() => calcHasChildren());
    const indent = computed(() => (props.depth + (calcHasChildren() ? 0 : 1)) * 20 + 'px');
    const onClick = (item: unknown, e: MouseEvent) => {
      if (e.target instanceof Element) {
        if (e.target.id == 'Expander') {
          return;
        }
      }

      return props.root.SelectItem(item);
    };

    return {
      itemData,
      children,
      isExpanded,
      hasChildren,
      indent,
      onClick,
    };
  },
});
</script>
