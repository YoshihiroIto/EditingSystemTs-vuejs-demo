<template>
  <div>
    <div id="container">
      <div id="rario-buttons">
        <label v-for="(data, index) in modes" :key="index">
          <input type="radio" name="mode" v-model="modeInternal" :value="data" />
          {{ data }}
        </label>
      </div>

      <div id="rario-buttons">
        <label v-for="(data, index) in spaces" :key="index">
          <input type="radio" name="space" v-model="spaceInternal" :value="data" />
          {{ data }}
        </label>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
#container {
  display: flex;
  flex-direction: row;

  background: lightgray;
}

#rario-buttons {
  padding: 4px;
  margin-right: 32px;

  label {
    margin-right: 4px;
  }
}
</style>

<script lang="ts">
import { computed, defineComponent, SetupContext } from '@vue/composition-api';
import {
  SceneViewportControllerMode,
  SceneViewportControllerModes,
  SceneViewportControllerSpace,
  SceneViewportControllerSpaces,
} from './SceneViewportConstants';

type Props = {
  mode: SceneViewportControllerMode;
  space: SceneViewportControllerSpace;
};

export default defineComponent({
  props: {
    mode: { default: SceneViewportControllerModes.Translate },
    space: { default: SceneViewportControllerSpaces.World },
  },
  components: {},
  setup: (props: Props, context: SetupContext) => {
    const modeInternal = computed({
      get: () => props.mode,
      set: (value: SceneViewportControllerMode) => context.emit('update:mode', value),
    });

    const spaceInternal = computed({
      get: () => props.space,
      set: (value: SceneViewportControllerSpace) => context.emit('update:space', value),
    });

    return {
      modeInternal,
      spaceInternal,
      //
      modes: SceneViewportControllerModes,
      spaces: SceneViewportControllerSpaces,
    };
  },
});
</script>
