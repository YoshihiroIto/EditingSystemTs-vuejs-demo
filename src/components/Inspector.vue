<template>
  <div>
    <div v-if="selectedObject != null">
      {{ selectedObject.name }}
      {{ selectedObject.rotation }}
    </div>
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
