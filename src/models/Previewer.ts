import { RuntimePlayer } from '@/runtime/RuntimePlayer';
import { EntityDefinition } from './entity/EntityDefinition';
import { Project } from './Project';
import { ProjectSerializer } from './ProjectSerializer';

export class Previewer {
  // private runtimePlayer: RuntimePlayer;

  constructor(project: Project, entityDefinitions: ReadonlyArray<EntityDefinition> /*, canvas: HTMLCanvasElement*/) {
    // 1. プロジェクトをシリアライズ
    //  1.1
    //
    // 2. プレビュー用DIを新規構築
    //
    // 3. プロジェクトをデシリアライズ
    //  3.2 エンティティ定義構築
    //  3.3 ルートシーンを作る
    //
    // this.runtimePlayer = new RuntimePlayer();

    const serializedProject = ProjectSerializer.Serialize(project, entityDefinitions);

    // this.runtimePlayer = new RuntimePlayer(serializedProject, canvas);
  }
}
