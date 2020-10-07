import { injectable } from 'tsyringe';
import { Entity } from './Entity';

@injectable()
export class EntityDefinition {
  constructor(readonly create: () => Entity) {}
}
