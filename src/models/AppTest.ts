import { UseCase } from '@/Di';
import using from '@/foundations/Using';
import { SeVector3 } from '@/se/math/SeVector3';
import { CreateEntityUseCase } from '@/useCases/project/CreateEntityUseCase';
import { container, inject, singleton } from 'tsyringe';
import { BatchEditingBlock } from './BatchEditingBlock';
import { Project } from './Project';
import { RootScene } from './RootScene';

@singleton()
export class AppTest {
  constructor(
    @inject(UseCase.createEntity) private readonly createObject: CreateEntityUseCase,
    private readonly project: Project,
    private readonly rootScene: RootScene
  ) {}

  addObjects(name: string, isOnlyPosition: boolean): void {
    using(container.resolve(BatchEditingBlock), () => {
      for (let i = 0; i != 20; ++i) {
        const obj = this.createObject.invoke(name);
        this.rootScene.add(obj);

        obj.position = new SeVector3(
          (Math.random() - 0.5) * 10,
          (Math.random() - 0.5) * 10,
          (Math.random() - 0.5) * 10
        );

        if (isOnlyPosition === false) {
          obj.rotation = new SeVector3(
            Math.random() * Math.PI * 2 - Math.PI,
            Math.random() * Math.PI * 2 - Math.PI,
            Math.random() * Math.PI * 2 - Math.PI
          );
        }
      }
    });
  }

  addChildObject(name: string): void {
    const parent = this.project.selectedObject;
    if (parent == null) {
      return;
    }

    using(container.resolve(BatchEditingBlock), () => {
      const obj = this.createObject.invoke(name);
      parent.add(obj);

      obj.position = new SeVector3(5 + Math.random(), Math.random(), Math.random());
    });
  }
}
