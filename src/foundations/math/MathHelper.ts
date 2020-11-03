import { Vector3 } from './Vector3';

export class MathHelper {
  static copySrt(target: HasSrt, source: HasSrt): void {
    target.position = source.position;
    target.rotation = source.rotation;
    target.scale = source.scale;
  }
}

export type HasSrt = {
  position: Vector3;
  rotation: Vector3;
  scale: Vector3;
};
