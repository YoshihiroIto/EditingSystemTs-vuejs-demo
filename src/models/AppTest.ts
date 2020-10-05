import { UseCase } from '@/Di';
import using from '@/foundations/Using';
import { SeVector3 } from '@/se/math/SeVector3';
import { CreateObjectUseCase } from '@/useCases/project/CreateObjectUseCase';
import { container, inject, singleton } from 'tsyringe';
import { BatchEditingBlock } from './BatchEditingBlock';
import { Project } from './Project';
import { RootScene } from './RootScene';

@singleton()
export class AppTest {
  constructor(
    @inject(UseCase.createObject) private readonly createObject: CreateObjectUseCase,
    private readonly project: Project,
    private readonly rootScene: RootScene
  ) {}

  addCubes(): void {
    using(container.resolve(BatchEditingBlock), () => {
      for (let i = 0; i != 20; ++i) {
        const cube = this.createObject.invoke('cube');
        this.rootScene.add(cube);

        cube.position = new SeVector3(
          (Math.random() - 0.5) * 10,
          (Math.random() - 0.5) * 10,
          (Math.random() - 0.5) * 10
        );
        cube.rotation = new SeVector3(
          Math.random() * Math.PI * 2 - Math.PI,
          Math.random() * Math.PI * 2 - Math.PI,
          Math.random() * Math.PI * 2 - Math.PI
        );
      }
    });
  }

  addChild(): void {
    const parent = this.project.selectedObject;
    if (parent == null) {
      return;
    }

    using(container.resolve(BatchEditingBlock), () => {
      const cube = this.createObject.invoke('cube');
      parent.add(cube);

      cube.position = new SeVector3(5, 0, 0);
    });
  }
}
