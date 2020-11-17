<template>
  <div>
    <TreeView :children="children" @select-item="onSelectItem" :isSelectedAction="isSelectedAction">
      <template #itemTemplate="item">
        {{ item.data.name }}
        ({{ item.data.definition.name }}, isSelected:{{ item.data.isSelected }})
        <!-- {{ item.data.rotation }} -->
      </template>
    </TreeView>
  </div>
</template>

<script lang="ts">
import { dic } from '@/di/dic';
import { UseCase } from '@/di/useCase';
import { Entity } from '@/models/entity/Entity';
import { SetSelectedEntitiesUseCase } from '@/useCases/edit/SetSelectedEntitiesUseCase';
import { defineComponent } from '@vue/composition-api';
import TreeView from './controls/TreeView.vue';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
type Props = {
  children: Entity[] | null;
};

export default defineComponent({
  props: {
    children: { default: null },
  },
  components: {
    TreeView,
  },
  setup: () => {
    let setSelectedEntities: SetSelectedEntitiesUseCase | null = null;

    const onSelectItem = (e: unknown) => {
      setSelectedEntities ??= dic().resolve<SetSelectedEntitiesUseCase>(UseCase.setSelectedEntities);
      setSelectedEntities.invoke(e as Entity);
    };

    const isSelectedAction = (item: Entity | null) => {
      return item == null ? false : item.isSelected;
    };

    return {
      onSelectItem,
      isSelectedAction,
    };
  },
});
</script>
