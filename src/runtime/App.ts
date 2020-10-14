import { Entity } from '@/models/entity/Entity';
import { Disposable } from '../../externals/EditingSystemTs/src/TypedEvent';

export class App implements Disposable {
  private target: Entity | null = null;

  setup(target: Entity): void {
    this.target = target;
  }

  dispose(): void {
    //
  }
}
