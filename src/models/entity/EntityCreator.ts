import { MathHelper } from '@/foundations/math/MathHelper';
import { singleton } from 'tsyringe';
import { Entity } from './Entity';
import { ChildEntityTag, EntityDefinition } from './EntityDefinition';
import { dic } from '@/di/dic';

@singleton()
export class EntityCreator {
  private readonly entityDefinitions = new Map<string, Readonly<EntityDefinition>>();

  create(definitionName: string): Entity {
    return this.createInternal(definitionName, true);
  }

  addDefinition(definition: Readonly<EntityDefinition>): void {
    this.entityDefinitions.set(definition.name, definition);
  }

  private createInternal(definitionName: string, isOwner: boolean): Entity {
    const definition = this.entityDefinitions.get(definitionName);
    if (definition === undefined) {
      throw new Error(`not fount ${definitionName}`);
    }

    const entity = dic().resolve(Entity);
    entity.setup(isOwner, definition);

    for (const child of definition.childTags ?? []) {
      const childEntity = this.createFromChildEntryTag(child);
      entity.addToOwn(childEntity);
    }

    return entity;
  }

  private createFromChildEntryTag(tag: ChildEntityTag): Entity {
    const entity = this.createInternal(tag.definitionName, false);
    MathHelper.copySrt(entity, tag);

    for (const child of tag.childTags ?? []) {
      const childEntity = this.createFromChildEntryTag(child);
      entity.addToOwn(childEntity);
    }

    return entity;
  }
}
