import { SeVector3 } from '@/se/math/SeVector3';
import { computed, WritableComputedRef } from '@vue/composition-api';

export function createComputedVector3(
  getter: () => SeVector3 | null | undefined,
  setter: (v: SeVector3) => void
): [WritableComputedRef<number>, WritableComputedRef<number>, WritableComputedRef<number>] {
  const x = computed({
    get: () => getter()?.x ?? 0,
    set: (value: number) => {
      const v = getter();

      if (v == null) {
        return;
      }

      setter(new SeVector3(value, v.y, v.z));
    },
  });

  const y = computed({
    get: () => getter()?.y ?? 0,
    set: (value: number) => {
      const v = getter();

      if (v == null) {
        return;
      }

      setter(new SeVector3(v.x, value, v.z));
    },
  });

  const z = computed({
    get: () => getter()?.z ?? 0,
    set: (value: number) => {
      const v = getter();

      if (v == null) {
        return;
      }

      setter(new SeVector3(v.x, v.y, value));
    },
  });

  return [x, y, z];
}
