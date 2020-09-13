<template>
  <div>
    <div :class="[hasChildren ? 'hasChildren' : 'doNotHasChildren']">
      <input type="checkbox" v-model="isExpanded" v-show="hasChildren" />

      <div @click="onClick(itemData)">
        <slot name="itemTemplate" :data="itemData" />
      </div>
    </div>

    <div :class="children" v-show="isExpanded">
      <TreeViewItem v-for="(child, childIndex) in children" :root="root" :data="child" :key="childIndex">
        <template v-for="slotName of Object.keys($scopedSlots)" #[slotName]="data">
          <slot :name="slotName" v-bind="data" />
        </template>
      </TreeViewItem>
    </div>
  </div>
</template>

<style scoped>
.children {
  padding-left: 20px;
}

.doNotHasChildren {
  padding-left: 20px;

  display: flex;
  flex-flow: row no-wrap;
}

.hasChildren {
  padding-left: 0px;

  display: flex;
  flex-flow: row no-wrap;
}
</style>

<script lang="ts">
import { computed, defineComponent, ref } from '@vue/composition-api';
import { HasChildren } from './HasChildren';
import { TreeViewContext } from './TreeView.vue';

type Props = {
  data: HasChildren;
  root: TreeViewContext;
};

export default defineComponent({
  name: 'TreeViewItem',
  props: {
    data: { default: null },
    root: { default: null },
  },
  setup(props: Props) {
    const itemData = ref(props.data);
    const children = ref(props.data.children);
    const isExpanded = ref(true);
    const hasChildren = computed(() => children.value != null && children.value.length > 0);
    const onClick = (e: unknown) => props.root.SelectItem(e);

    return {
      itemData,
      children,
      isExpanded,
      hasChildren,
      onClick,
    };
  },
});
</script>
