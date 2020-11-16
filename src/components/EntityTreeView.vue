<template>
  <div>
    <TreeView :children="children" @select-item="onSelectItem" :selectedItem="selectedEntity">
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
  setup: () => {
    let setSelectedEntities: SetSelectedEntitiesUseCase | null = null;

    const onSelectItem = (e: unknown) => {
      setSelectedEntities ||= dic().resolve<SetSelectedEntitiesUseCase>(UseCase.setSelectedEntities);
      setSelectedEntities.invoke(e as Entity);
    };

    return {
      onSelectItem,
    };
  },
});
</script>
