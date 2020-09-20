/* eslint-disable @typescript-eslint/no-explicit-any */
import { SeVector3 } from '@/se/math/SeVector3';
import { computed, WritableComputedRef } from '@vue/composition-api';

export function createComputedVector3(
  getter: () => unknown,
  propertyName: string
): [WritableComputedRef<number>, WritableComputedRef<number>, WritableComputedRef<number>] {
  const x = computed({
    get: () => {
      const target = getter() as any;
      if (target == null) {
        return 0;
      }

      return target[propertyName]?.x ?? 0;
    },
    set: (value: number) => {
      const target = getter() as any;
      if (target == null) {
        return;
      }

      target[propertyName] = new SeVector3(value, target[propertyName].y, target[propertyName].z);
    },
  });

  const y = computed({
    get: () => {
      const target = getter() as any;
      if (target == null) {
        return 0;
      }

      return target[propertyName]?.y ?? 0;
    },
    set: (value: number) => {
      const target = getter() as any;
      if (target == null) {
        return;
      }

      target[propertyName] = new SeVector3(target[propertyName].x, value, target[propertyName].z);
    },
  });

  const z = computed({
    get: () => {
      const target = getter() as any;
      if (target == null) {
        return 0;
      }

      return target[propertyName]?.z ?? 0;
    },
    set: (value: number) => {
      const target = getter() as any;
      if (target == null) {
        return;
      }

      target[propertyName] = new SeVector3(target[propertyName].x, target[propertyName].y, value);
    },
  });

  return [x, y, z];
}
