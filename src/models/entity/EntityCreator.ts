import { MathHelper, HasSrt } from '@/foundations/math/MathHelper';
import { Entity } from './Entity';
import { ChildEntityTag, EntityDefinition } from './EntityDefinition';
import { dic, isRuntime } from '@/di/dic';
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

  create(entityName: string, definitionName: string, srt: HasSrt | null): Entity {
    const entity = this.createInternal(entityName, definitionName, srt, true);

    return entity;
  }

  addDefinition(definition: Readonly<EntityDefinition>): void {
    if (this._entityDefinitions.has(definition.name)) {
      throw new Error();
    }

    this._entityDefinitions.set(definition.name, definition);
  }

  private createInternal(entityName: string, definitionName: string, srt: HasSrt | null, isOwner: boolean): Entity {
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

    entity.name = entityName;

    if (srt != null) {
      MathHelper.copySrt(entity, srt);
    }

    if (isRuntime()) {
      entity.init();
    }

    return entity;
  }

  private createFromChildEntryTag(tag: ChildEntityTag): Entity {
    const entity = this.createInternal('', tag.definition, tag, false);

    for (const child of tag.children ?? []) {
      const childEntity = this.createFromChildEntryTag(child);
      entity.addToOwn(childEntity);
    }

    return entity;
  }
}
