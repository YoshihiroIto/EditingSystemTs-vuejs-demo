import { Entity } from '@/models/entity/Entity';

export interface AddSelectedEntitiesUseCase {
  invoke(...entities: Entity[]): void;
}
