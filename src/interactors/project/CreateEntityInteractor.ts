import { CreateEntityUseCase } from '@/useCases/project/CreateEntityUseCase';
import { SeObject3D } from '@/se/SeObject3D';
import { EntityCreator } from '@/models/entity/EntityCreator';
import { singleton } from 'tsyringe';

@singleton()
export class CreateEntityInteractor implements CreateEntityUseCase {
  constructor(private readonly objectCreator: EntityCreator) {}

  invoke(name: string): SeObject3D {
    const box = this.objectCreator.create(name);

    box.name = `Obj${CreateEntityInteractor.instanceCount++}`;

    return box;
  }

  private static instanceCount = 0;
}
