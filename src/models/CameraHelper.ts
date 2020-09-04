import { Camera, PerspectiveCamera } from 'three';

export class CameraHelper {
  public static SetAspect(target: Camera, aspect: number): void {
    if (target instanceof PerspectiveCamera) {
      const pc = target as PerspectiveCamera;
      pc.aspect = aspect;
    }
  }
}
