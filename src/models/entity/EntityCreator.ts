import { Vector3 } from '@/foundations/math/Vector3';
import { container, singleton } from 'tsyringe';
import { Entity } from './Entity';
import { ChildEntity, EntityDefinition } from './EntityDefinition';
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

    const havingChildrenBox = new EntityDefinition({
      name: 'havingChildrenBox',
      renderDefinition: new RenderDefinition({ meshType: MeshTypes.Point }),

      children: [
        new ChildEntity({ name: 'box', position: new Vector3(5, 0, 0) }),
        new ChildEntity({ name: 'point', position: new Vector3(0, 0, 5) }),
        new ChildEntity({ name: 'box', position: new Vector3(-5, 0, 0) }),
        new ChildEntity({ name: 'point', position: new Vector3(0, 0, -5) }),
      ],
    });

    this.entityDefinitions.set(box.name, box);
    this.entityDefinitions.set(point.name, point);
    this.entityDefinitions.set(havingChildrenBox.name, havingChildrenBox);
  }

  createInternal(definition: EntityDefinition): Entity {
    const entity = container.resolve(Entity);

    entity.definition = definition;

    if (definition.children != null) {
      for (const child of definition.children) {
        const childDef = this.entityDefinitions.get(child.name);

        if (childDef === undefined) {
          throw new Error(`not fount ${name}`);
        }

        const childEntity = this.createInternal(childDef);
        childEntity.position = child.position;
        childEntity.rotation = child.rotation;
        childEntity.scale = child.scale;

        entity.add(childEntity);
      }
    }

    return entity;
  }
}
