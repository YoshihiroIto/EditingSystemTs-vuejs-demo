import { Entity } from '@/models/entity/Entity';

export interface ToggleSelectedEntitiesUseCase {
  invoke(...entities: Entity[]): void;
}
