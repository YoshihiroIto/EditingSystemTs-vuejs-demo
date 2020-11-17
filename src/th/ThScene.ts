import { AmbientLight, SpotLight } from 'three';
import { Scene } from 'three/src/scenes/Scene';
import { injectable } from 'tsyringe';
import { WithThObject } from './WithThObject';

@injectable()
export class ThScene extends WithThObject(Scene) {
  constructor() {
    super();

    this.add(new AmbientLight(0x505050));

    const light = new SpotLight(0xffffff, 1.5);
    light.position.set(0, 500, 2000);
    light.angle = Math.PI / 9;

    light.castShadow = true;
    light.shadow.camera.near = 1000;
    light.shadow.camera.far = 4000;
    light.shadow.mapSize.width = 1024;
    light.shadow.mapSize.height = 1024;

    this.add(light);
  }
}
