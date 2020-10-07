import { CreateEntityUseCase } from '@/useCases/project/CreateEntityUseCase';
import { EntityCreator } from '@/models/entity/EntityCreator';
import { singleton } from 'tsyringe';
import { Entity } from '@/models/entity/Entity';

@singleton()
export class CreateEntityInteractor implements CreateEntityUseCase {
  constructor(private readonly entityCreator: EntityCreator) {}

  invoke(name: string): Entity {
    const entity = this.entityCreator.create(name);

    entity.name = `Entity${CreateEntityInteractor.instanceCount++}`;

    return entity;
  }

  private static instanceCount = 0;
}
