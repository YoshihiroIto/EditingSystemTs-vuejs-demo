import { container } from 'tsyringe';
import { Project } from './models/Project';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default function setupDi() {
  // Projectクラス内のコンストラクタ内でDIのセットアップがあるので、コンストラクタを起動させる
  container.resolve(Project);
}
