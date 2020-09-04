import { Camera, PerspectiveCamera, BoxGeometry, MeshNormalMaterial, Mesh } from 'three';
import { EventArgs, TypedEvent } from '../../externals/EditingSystemTs/src/TypedEvent';
import { History } from '../../externals/EditingSystemTs/src/History';
import { SeMesh } from './se/SeMesh';
import { SeScene } from './se/SeScene';
import { container, injectable } from 'tsyringe';

@injectable()
export class RootScene extends SeScene {
  public readonly camera: Camera;
  public readonly updated = new TypedEvent();

  private readonly cubes = new Array<Mesh>();

  constructor(history: History) {
    super(history);

    this.camera = new PerspectiveCamera(45, 600 / 400, 0.1, 1000);
    this.camera.position.set(0, 0, 3);
    this.camera.lookAt(0, 0, 0);

    this.animate();
  }

  static geometry = new BoxGeometry(1, 1, 1);
  static material = new MeshNormalMaterial();

  public addCube(): void {
    const cube = container.resolve(SeMesh);

    cube.geometry = RootScene.geometry;
    cube.material = RootScene.material;

    cube.position.x = (Math.random() - 0.5) * 8;
    cube.position.y = (Math.random() - 0.5) * 8;
    cube.position.z = Math.random() * -2;
    cube.rotation.x = Math.random() * Math.PI * 2;
    cube.rotation.y = Math.random() * Math.PI * 2;
    cube.rotation.z = Math.random() * Math.PI * 2;
    cube.position.z = Math.random() * -10;

    this.add(cube);
    this.cubes.push(cube);
  }

  public doUpdate(): void {
    const speed = 0.03;
    for (const cube of this.cubes) {
      cube.rotation.x += speed;
      cube.rotation.y += speed * 0.7;
    }
  }

  public animate(): void {
    const animate = () => {
      this.doUpdate();
      this.updated.emit(this, EventArgs.empty);

      requestAnimationFrame(animate);
    };

    animate();
  }
}
