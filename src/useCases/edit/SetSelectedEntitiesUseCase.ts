import { Entity } from '@/models/entity/Entity';

export interface SetSelectedEntitiesUseCase {
  invoke(...entities: Entity[]): void;
}
