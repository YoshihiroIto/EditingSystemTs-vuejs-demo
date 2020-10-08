import { container, singleton } from 'tsyringe';
import { Entity } from './Entity';
import { EntityDefinition } from './EntityDefinition';
import { MeshTypes, RenderDefinition } from './RenderDefinition';

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

    return this.createInternal(entityDef);
  }

  readonly entityDefinitions = new Map<string, EntityDefinition>();

  private registerEntityDefinitions(): void {
    const box = new EntityDefinition({
      name: 'box',
      renderDefinition: new RenderDefinition({ meshType: MeshTypes.Box }),
    });

    const point = new EntityDefinition({
      name: 'point',
      renderDefinition: new RenderDefinition({ meshType: MeshTypes.Point }),
    });

    this.entityDefinitions.set(box.name, box);
    this.entityDefinitions.set(point.name, point);
  }

  createInternal(definition: EntityDefinition): Entity {
    const entity = container.resolve(Entity);

    entity.definition = definition;
    entity.position = definition.position;
    entity.rotation = definition.rotation;
    entity.scale = definition.scale;

    return entity;
  }
}
