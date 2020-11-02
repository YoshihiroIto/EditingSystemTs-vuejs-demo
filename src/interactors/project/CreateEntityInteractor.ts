import { CreateEntityUseCase } from '@/useCases/project/CreateEntityUseCase';
import { EntityCreator } from '@/models/entity/EntityCreator';
import { Lifecycle, scoped } from 'tsyringe';
import { Entity } from '@/models/entity/Entity';
import { ChildEntityTag, EntityDefinition } from '@/models/entity/EntityDefinition';
import { MeshTypes, RenderDefinition } from '@/models/entity/RenderDefinition';
import { Vector3 } from '@/foundations/math/Vector3';
import { ScriptDefinition } from '@/models/entity/ScriptDefinition';

@scoped(Lifecycle.ContainerScoped)
export class CreateEntityInteractor implements CreateEntityUseCase {
  constructor(private readonly entityCreator: EntityCreator) {}

  invoke(name: string): Entity {
    if (this.entityCreator.isEmpty) {
      this.registerEntityDefinitions();
    }

    const entity = this.entityCreator.create(name);

    entity.name = `Entity${CreateEntityInteractor.instanceCount++}`;

    return entity;
  }

  private static instanceCount = 0;

  private registerEntityDefinitions(): void {
    const box = new EntityDefinition({
      name: 'box',
      renderDefinition: new RenderDefinition({ meshType: MeshTypes.Box }),
      scriptDefinition: new ScriptDefinition({ code: CreateEntityInteractor.testScriptCode }),
    });

    const point = new EntityDefinition({
      name: 'point',
      renderDefinition: new RenderDefinition({ meshType: MeshTypes.Point }),
    });

    const havingChildrenBox = new EntityDefinition({
      name: 'havingChildrenBox',
      renderDefinition: new RenderDefinition({ meshType: MeshTypes.Point }),

      children: [
        new ChildEntityTag({ definition: 'box', position: new Vector3(5, 0, 0) }),
        new ChildEntityTag({ definition: 'point', position: new Vector3(0, 0, 5) }),
        new ChildEntityTag({ definition: 'box', position: new Vector3(-5, 0, 0) }),
        new ChildEntityTag({ definition: 'point', position: new Vector3(0, 0, -5) }),
      ],
    });

    const threeGens = new EntityDefinition({
      name: 'threeGens',
      renderDefinition: new RenderDefinition({ meshType: MeshTypes.Point }),

      children: [
        new ChildEntityTag({
          definition: 'box',
          position: new Vector3(5, 0, 0),
          children: [
            new ChildEntityTag({
              definition: 'point',
              position: new Vector3(0, 0, 10),
              children: [new ChildEntityTag({ definition: 'box', position: new Vector3(5, 0, 0) })],
            }),
          ],
        }),
      ],
    });

    this.entityCreator.addDefinition(box);
    this.entityCreator.addDefinition(point);
    this.entityCreator.addDefinition(havingChildrenBox);
    this.entityCreator.addDefinition(threeGens);
  }

  private static testScriptCode = `
    function update(entity:Entity, event:any) {
      entity.rotation = new Vector3(
        entity.rotation.x + 0.005,
        entity.rotation.y + 0.03,
        entity.rotation.z);
    }
  `;
}
