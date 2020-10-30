import { EntityDefinition } from '../entity/EntityDefinition';
import { Project } from '../Project';

export class ProjectSerializer {
  constructor(private readonly project: Project, private readonly entityDefinitions: ReadonlyArray<EntityDefinition>) {}

  invoke(): string {
    return JSON.stringify({
      entityDefinitions: this.entityDefinitions,
      rootScene: this.project.rootScene,
    });
  }
}
