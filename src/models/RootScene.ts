import { History } from '../../externals/EditingSystemTs/src/History';
import { EventArgs, TypedEvent } from '../../externals/EditingSystemTs/src/TypedEvent';
import { injectable } from 'tsyringe';
import { SeScene } from '@/se/SeScene';
import { SeVector3 } from '@/se/math/SeVector3';
import { ObjectCreator } from './ObjectCreator';

@injectable()
export class RootScene extends SeScene {
  public readonly updated = new TypedEvent();

  constructor(history: History, private readonly objectCreator: ObjectCreator) {
    super(history);

    this.animate();
  }

  public addCube(): void {
    try {
      this.history.beginBatch();

      const cube = this.objectCreator.create('cube');

      this.add(cube);

      cube.position = new SeVector3((Math.random() - 0.5) * 10, (Math.random() - 0.5) * 10, (Math.random() - 0.5) * 10);
      cube.rotation = new SeVector3(
        Math.random() * Math.PI * 2,
        Math.random() * Math.PI * 2,
        Math.random() * Math.PI * 2
      );
    } finally {
      this.history.endBatch();
    }
  }

  public doUpdate(): void {
    try {
      this.history.beginPause();

      const speed = 0.03;

      for (const cube of this.children) {
        cube.rotation = new SeVector3(cube.rotation.x + speed, cube.rotation.y + speed * 0.7, cube.rotation.z);
      }
    } finally {
      this.history.endPause();
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
