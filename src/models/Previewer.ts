import { dic, endRuntime, startRuntime } from '@/di/dic';
// import { RuntimePlayer } from '@/runtime/RuntimePlayer';
import { Disposable } from 'externals/EditingSystemTs/src/TypedEvent';
import { EntityCreator } from './entity/EntityCreator';
import { EntityDefinition } from './entity/EntityDefinition';
import { Project } from './Project';
import { ProjectSerializer } from './Serialize/ProjectSerializer';

export class Previewer implements Disposable {
  readonly project: Project;

  //private runtimePlayer: RuntimePlayer;

  constructor(project: Project, entityDefinitions: ReadonlyArray<EntityDefinition> /*, canvas: HTMLCanvasElement*/) {
    // 1. プロジェクトをシリアライズする
    const serializedProject = ProjectSerializer.serialize(project, entityDefinitions);

    // 2. プレビュー用DIを新規構築する
    startRuntime();

    // 3. プロジェクトをデシリアライズする
    this.project = ProjectSerializer.deserialize(serializedProject, dic().resolve(EntityCreator));

    // // 4. プレイヤーを用意する
    // this.runtimePlayer = new RuntimePlayer(previewProject, canvas);
  }

  dispose(): void {
    endRuntime();
  }
}
