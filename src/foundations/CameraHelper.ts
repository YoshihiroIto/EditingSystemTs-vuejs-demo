import { Camera, PerspectiveCamera } from 'three';

export class CameraHelper {
  public static SetAspect(target: Camera, aspect: number): void {
    //if (target instanceof PerspectiveCamera)
    if (target.type === 'PerspectiveCamera') {
      const pc = target as PerspectiveCamera;
      pc.aspect = aspect;
      pc.updateProjectionMatrix();
    }
  }
}
