import { MathHelper } from '@/foundations/math/MathHelper';
import { Entity } from './Entity';
import { ChildEntityTag, EntityDefinition } from './EntityDefinition';
import { dic } from '@/di/dic';
import { Lifecycle, scoped } from 'tsyringe';

@scoped(Lifecycle.ContainerScoped)
export class EntityCreator {
  get entityDefinitions(): ReadonlyArray<Readonly<EntityDefinition>> {
    return [...this._entityDefinitions.values()];
  }
  get isEmpty(): boolean {
    return this._entityDefinitions.size === 0;
  }

  private readonly _entityDefinitions = new Map<string, Readonly<EntityDefinition>>();

  create(definitionName: string): Entity {
    return this.createInternal(definitionName, true);
  }

  addDefinition(definition: Readonly<EntityDefinition>): void {
    if (this._entityDefinitions.has(definition.name)) {
      throw new Error();
    }

    this._entityDefinitions.set(definition.name, definition);
  }

  private createInternal(definitionName: string, isOwner: boolean): Entity {
    const definition = this._entityDefinitions.get(definitionName);
    if (definition === undefined) {
      throw new Error(`not fount ${definitionName}`);
    }

    const entity = dic().resolve(Entity);
    entity.setup(isOwner, definition);

    for (const child of definition.children ?? []) {
      const childEntity = this.createFromChildEntryTag(child);
      entity.addToOwn(childEntity);
    }

    return entity;
  }

  private createFromChildEntryTag(tag: ChildEntityTag): Entity {
    const entity = this.createInternal(tag.definition, false);
    MathHelper.copySrt(entity, tag);

    for (const child of tag.children ?? []) {
      const childEntity = this.createFromChildEntryTag(child);
      entity.addToOwn(childEntity);
    }

    return entity;
  }
}
