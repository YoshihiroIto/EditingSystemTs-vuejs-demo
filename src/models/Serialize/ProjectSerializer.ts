import { MathHelper } from '@/foundations/math/MathHelper';
import { Entity } from '../entity/Entity';
import { EntityCreator } from '../entity/EntityCreator';
import { EntityDefinition } from '../entity/EntityDefinition';
import { Project } from '../Project';
import { SdEntity, SdEntityDefinition, SdProject } from './SerializeData';

export class ProjectSerializer {
  static serialize(project: Project, entityDefinitions: ReadonlyArray<EntityDefinition>): string {
    return JSON.stringify({
      entityDefinitions: entityDefinitions,
      rootScene: project.rootScene,
    });
  }

  static deserialize(serializedProject: string, entityCreator: EntityCreator): Project {
    //
    const parsedProject = JSON.parse(serializedProject) as SdProject;

    // エンティティ定義をデシリアライズする
    for (const entityDef of parsedProject.entityDefinitions) {
      entityCreator.addDefinition(SdEntityDefinition.toInstance(entityDef));
    }

    // エンティティ群をデシリアライズする
    const project = new Project();

    for (const src of parsedProject.rootScene.children) {
      project.rootScene.children.push(ProjectSerializer.createEntity(src, entityCreator));
    }

    return project;
  }

  private static createEntity(src: SdEntity, entityCreator: EntityCreator): Entity {
    const entity = entityCreator.create(src.definition);

    entity.name = src.name;
    MathHelper.copySrt(entity, src);

    for (const srcChild of src.children) {
      entity.children.push(ProjectSerializer.createEntity(srcChild, entityCreator));
    }

    return entity;
  }
}
