import { ThScene } from '@/th/ThScene';
import { Camera } from 'three/src/cameras/Camera';
import { PerspectiveCamera } from 'three/src/cameras/PerspectiveCamera';
import { injectable } from 'tsyringe';

@injectable()
export class RootSceneViewModel extends ThScene {
  readonly camera: Camera;

  constructor() {
    super();

    this.camera = new PerspectiveCamera(45, 600 / 400, 0.1, 1000);
    this.camera.position.set(0, 0, 3);
    this.camera.lookAt(0, 0, 0);
  }
}
