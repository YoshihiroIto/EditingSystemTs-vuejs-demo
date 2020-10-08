import { UseCase } from '@/Di';
import using from '@/foundations/Using';
import { Vector3 } from '@/foundations/math/Vector3';
import { CreateEntityUseCase } from '@/useCases/project/CreateEntityUseCase';
import { container, inject, singleton } from 'tsyringe';
import { BatchEditingBlock } from './BatchEditingBlock';
import { Project } from './Project';
import { RootScene } from './RootScene';

@singleton()
export class AppTest {
  constructor(
    @inject(UseCase.createEntity) private readonly createEntity: CreateEntityUseCase,
    private readonly project: Project,
    private readonly rootScene: RootScene
  ) {}

  addObjects(name: string, isOnlyPosition: boolean): void {
    using(container.resolve(BatchEditingBlock), () => {
      for (let i = 0; i != 20; ++i) {
        const entity = this.createEntity.invoke(name);
        this.rootScene.add(entity);

        entity.position = new Vector3(
          (Math.random() - 0.5) * 10,
          (Math.random() - 0.5) * 10,
          (Math.random() - 0.5) * 10
        );

        if (isOnlyPosition === false) {
          entity.rotation = new Vector3(
            Math.random() * Math.PI * 2 - Math.PI,
            Math.random() * Math.PI * 2 - Math.PI,
            Math.random() * Math.PI * 2 - Math.PI
          );
        }
      }
    });
  }

  addChildObject(name: string): void {
    const parent = this.project.selectedEntity;
    if (parent == null) {
      return;
    }

    using(container.resolve(BatchEditingBlock), () => {
      const entity = this.createEntity.invoke(name);
      parent.add(entity);

      entity.position = new Vector3(5 + Math.random(), Math.random(), Math.random());
    });
  }
}
