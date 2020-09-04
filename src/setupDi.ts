import { container } from 'tsyringe';
import { Project } from './models/Project';

export default function setupDi(): void {
  // Projectクラス内のコンストラクタ内でDIのセットアップがあるので、コンストラクタを起動させる
  container.resolve(Project);
}
