/* eslint-disable @typescript-eslint/no-explicit-any */
import { Vector3 } from '@/foundations/math/Vector3';
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

      target[propertyName] = new Vector3(value, target[propertyName].y, target[propertyName].z);
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

      target[propertyName] = new Vector3(target[propertyName].x, value, target[propertyName].z);
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

      target[propertyName] = new Vector3(target[propertyName].x, target[propertyName].y, value);
    },
  });

  return [x, y, z];
}

export function isUndo(e: KeyboardEvent): boolean {
  return e.ctrlKey && e.key === 'z' && isRedo(e) === false;
}

export function isRedo(e: KeyboardEvent): boolean {
  return (e.ctrlKey && e.key === 'y') || (e.ctrlKey && e.shiftKey && e.key === 'Z');
}

export function isEditingConfirmation(e: KeyboardEvent): boolean {
  return e.key == 'Enter' || isUndo(e) || isRedo(e);
}
