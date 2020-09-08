<template>
  <div>
    <label :class="[hasChildren ? $style.hasChildren : $style.doNotHasChildren]">
      <input type="checkbox" v-model="isExpanded" v-if="hasChildren" />
      <slot name="itemTemplate" :data="itemData" />
    </label>

    <div :class="$style.children" v-if="isExpanded">
      <TreeViewItem v-for="(child, index) in children" :data="child" :key="index">
        <template v-for="slotName of Object.keys($scopedSlots)" #[slotName]="data">
          <slot :name="slotName" v-bind="data" />
        </template>
      </TreeViewItem>
    </div>
  </div>
</template>

<style module>
.children {
  padding-left: 24px;
}

.doNotHasChildren {
  padding-left: 24px;
}

.hasChildren {
  padding-left: 0px;
}
</style>

<script lang="ts">
import { computed, defineComponent, ref } from '@vue/composition-api';
import { HasChildren } from './HasChildren';

type Props = {
  data: HasChildren;
};

export default defineComponent({
  name: 'TreeViewItem',
  props: {
    data: { default: null },
  },
  setup(props: Props) {
    const itemData = ref(props.data);
    const children = ref(props.data.children);
    const isExpanded = ref(true);
    const hasChildren = computed(() => children.value != null && children.value.length > 0);

    return {
      itemData,
      children,
      isExpanded,
      hasChildren,
    };
  },
});
</script>
