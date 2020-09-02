import { Scene, Camera, PerspectiveCamera, BoxGeometry, MeshNormalMaterial, Mesh, Object3D } from 'three';
import { EventArgs, TypedEvent } from '@/se/Foundations/TypedEvent';

export class RootScene {
  public readonly scene = new Scene();
  public readonly camera: Camera;
  public readonly updated = new TypedEvent();

  public get children(): Object3D[] {
    return this.scene.children;
  }

  private readonly cubes = new Array<Mesh>();

  constructor() {
    this.camera = new PerspectiveCamera(45, 600 / 400, 0.1, 1000);
    this.camera.position.set(0, 0, 3);
    this.camera.lookAt(0, 0, 0);

    this.animate();
  }

  public addCube(): void {
    const geometry = new BoxGeometry(1, 1, 1);
    const material = new MeshNormalMaterial();
    const cube = new Mesh(geometry, material);

    cube.position.x = (Math.random() - 0.5) * 8;
    cube.position.y = (Math.random() - 0.5) * 8;
    cube.position.z = Math.random() * -2;
    cube.rotation.x = Math.random() * Math.PI * 2;
    cube.rotation.y = Math.random() * Math.PI * 2;
    cube.rotation.z = Math.random() * Math.PI * 2;
    cube.position.z = Math.random() * -10;

    this.scene.add(cube);
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
