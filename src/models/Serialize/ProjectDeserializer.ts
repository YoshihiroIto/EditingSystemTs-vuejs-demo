import { MathHelper } from '@/foundations/math/MathHelper';
import { Entity } from '../entity/Entity';
import { EntityCreator } from '../entity/EntityCreator';
import { Project } from '../Project';
import { SdEntity, SdEntityDefinition, SdProject } from './SerializationData';

export class ProjectDeserializer {
  constructor(
    private readonly result: Project,
    private readonly serializedProject: string,
    private readonly entityCreator: EntityCreator
  ) {}

  invoke(): void {
    // JSON文字列をデコード
    const parsedProject = JSON.parse(this.serializedProject) as SdProject;

    // エンティティ定義をデシリアライズする
    for (const entityDef of parsedProject.entityDefinitions) {
      this.entityCreator.addDefinition(SdEntityDefinition.toInstance(entityDef));
    }

    // エンティティ群をデシリアライズする
    for (const src of parsedProject.rootScene.children) {
      this.result.rootScene.children.pushCore(this.createEntity(src));
    }
  }

  private createEntity(src: SdEntity): Entity {
    const entity = this.entityCreator.create(src.definition);

    entity.name = src.name;
    MathHelper.copySrt(entity, src);

    for (const srcChild of src.children) {
      entity.children.pushCore(this.createEntity(srcChild));
    }

    return entity;
  }
}
