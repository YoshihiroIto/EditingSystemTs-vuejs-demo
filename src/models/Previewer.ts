import { dic, endRuntime, startRuntime } from '@/di/dic';
import { Disposable } from '../../externals/EditingSystemTs/src/Disposable';
import { injectable } from 'tsyringe';
import { EntityCreator } from './entity/EntityCreator';
import { EntityDefinition } from './entity/EntityDefinition';
import { Project } from './Project';
import { ProjectDeserializer } from './Serialize/ProjectDeserializer';
import { ProjectSerializer } from './Serialize/ProjectSerializer';

@injectable()
export class Previewer implements Disposable {
  readonly project = new Project();

  private serializedProject = '';
  private isStart = false;

  setup(srcProject: Project, entityDefinitions: ReadonlyArray<EntityDefinition>): void {
    this.serializedProject = new ProjectSerializer(srcProject, entityDefinitions).invoke();
  }

  start(): void {
    if (this.isStart) {
      return;
    }

    // 2. プレビュー用DIを新規構築する
    startRuntime();

    // 3. プロジェクトをデシリアライズする
    const entityCreatorForPreview = dic().resolve(EntityCreator);
    new ProjectDeserializer(this.project, this.serializedProject, entityCreatorForPreview).invoke();

    //
    this.isStart = true;
  }

  dispose(): void {
    if (this.isStart === false) {
      return;
    }

    endRuntime();

    this.isStart = false;
  }
}
