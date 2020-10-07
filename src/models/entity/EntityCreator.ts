import { container, singleton } from 'tsyringe';
import { Entity } from './Entity';
import { EntityDefinition } from './EntityDefinition';

@singleton()
export class EntityCreator {
  constructor() {
    this.registerEntityDefinitions();
  }

  create(name: string): Entity {
    const entityDef = this.entityDefinitions.get(name);

    if (entityDef === undefined) {
      throw new Error(`not fount ${name}`);
    }

    const entity = entityDef.create();

    entity.definitionName = name;

    return entity;
  }

  readonly entityDefinitions = new Map<string, EntityDefinition>();

  private registerEntityDefinitions(): void {
    //todo:エンティティ定義ファイルを読み込んできて登録する
    this.entityDefinitions.set(
      'box',
      new EntityDefinition(() => {
        return container.resolve(Entity);
      })
    );

    this.entityDefinitions.set(
      'point',
      new EntityDefinition(() => {
        return container.resolve(Entity);
      })
    );
  }
}
