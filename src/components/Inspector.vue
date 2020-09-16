<template>
  <div>
    <template v-if="selectedObject != null">
      name: {{ selectedObject.name }}
      <br />
      objectDefinitionName: {{ selectedObject.objectDefinitionName }}
      <br />
      position: {{ selectedObject.position }}
      <br />
      rotation: {{ selectedObject.rotation }}
    </template>

    <template v-else>unselected</template>
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api';
// import { SeObject3D } from '@/se/SeObject3D';

// type Props = {
//   selectedObject: SeObject3D | null;
// };

export default defineComponent({
  props: {
    selectedObject: { default: null },
  },
  components: {},
  // setup: (props: Props) => {
  // },
});
</script>
