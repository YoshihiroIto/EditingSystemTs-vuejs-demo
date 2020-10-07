import { Entity } from '@/models/entity/Entity';

export interface CreateEntityUseCase {
  invoke(name: string): Entity;
}
