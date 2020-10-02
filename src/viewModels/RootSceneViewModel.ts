import { ThScene } from '@/th/ThScene';
import { Color } from 'three/src/math/Color';
import { injectable } from 'tsyringe';

@injectable()
export class RootSceneViewModel extends ThScene {
  constructor() {
    super();

    this.background = new Color(0x24292e);
  }
}
