import { History } from '../../externals/EditingSystemTs/src/History';
import { TypedEvent } from '../../externals/EditingSystemTs/src/TypedEvent';
import { container, injectable } from 'tsyringe';
import { SeScene } from '@/se/SeScene';
import { SeVector3 } from '@/se/math/SeVector3';
import { ObjectCreator } from './ObjectCreator';
import { SeObject3D } from '@/se/SeObject3D';
import { BatchEditingBlock } from './BatchEditingBlock';
import using from '@/foundations/Using';

@injectable()
export class RootScene extends SeScene {
  readonly updated = new TypedEvent();

  constructor(history: History, private readonly objectCreator: ObjectCreator) {
    super(history);
  }

  createCube(): SeObject3D {
    const cube = this.objectCreator.create('cube');

    cube.name = `Obj${RootScene.instanceCount++}`;

    return cube;
  }

  addCube(): void {
    using(container.resolve(BatchEditingBlock), () => {
      this.history.beginBatch();

      const cube = this.createCube();

      this.add(cube);

      cube.position = new SeVector3((Math.random() - 0.5) * 10, (Math.random() - 0.5) * 10, (Math.random() - 0.5) * 10);
      cube.rotation = new SeVector3(
        Math.random() * Math.PI * 2 - Math.PI,
        Math.random() * Math.PI * 2 - Math.PI,
        Math.random() * Math.PI * 2 - Math.PI
      );
    });
  }

  private static instanceCount = 0;
}
