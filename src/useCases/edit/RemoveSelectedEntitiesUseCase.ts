import { Entity } from '@/models/entity/Entity';

export interface RemoveSelectedEntitiesUseCase {
  invoke(...entities: Entity[]): void;
}
