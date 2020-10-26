import { EntityDefinition } from './entity/EntityDefinition';
import { Project } from './Project';

export class ProjectSerializer {
  static Serialize(project: Project, entityDefinitions: ReadonlyArray<EntityDefinition>): string {
    return JSON.stringify({
      entityDefinitions: entityDefinitions,
      rootScene: project.rootScene,
    });
  }
}
