import { MathHelper } from '@/foundations/math/MathHelper';
import { Vector3 } from '@/foundations/math/Vector3';
import { singleton } from 'tsyringe';
import { Entity } from './Entity';
import { ChildEntityTag, EntityDefinition } from './EntityDefinition';
import { MeshTypes, RenderDefinition } from './RenderDefinition';
import { dic } from '@/di/dic';

@singleton()
export class EntityCreator {
  constructor() {
    this.registerEntityDefinitions();
  }

  create(definitionName: string): Entity {
    return this.createInternal(definitionName, true);
  }

  private readonly entityDefinitions = new Map<string, EntityDefinition>();

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

      childTags: [
        new ChildEntityTag({ definitionName: 'box', position: new Vector3(5, 0, 0) }),
        new ChildEntityTag({ definitionName: 'point', position: new Vector3(0, 0, 5) }),
        new ChildEntityTag({ definitionName: 'box', position: new Vector3(-5, 0, 0) }),
        new ChildEntityTag({ definitionName: 'point', position: new Vector3(0, 0, -5) }),
      ],
    });

    const threeGens = new EntityDefinition({
      name: 'threeGens',
      renderDefinition: new RenderDefinition({ meshType: MeshTypes.Point }),

      childTags: [
        new ChildEntityTag({
          definitionName: 'box',
          position: new Vector3(5, 0, 0),
          childTags: [
            new ChildEntityTag({
              definitionName: 'point',
              position: new Vector3(0, 0, 10),
              childTags: [new ChildEntityTag({ definitionName: 'box', position: new Vector3(5, 0, 0) })],
            }),
          ],
        }),
      ],
    });

    this.entityDefinitions.set(box.name, box);
    this.entityDefinitions.set(point.name, point);
    this.entityDefinitions.set(havingChildrenBox.name, havingChildrenBox);
    this.entityDefinitions.set(threeGens.name, threeGens);
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
