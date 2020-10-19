import { Entity } from '@/models/entity/Entity';

export class Runtime {
  private target: Entity | null = null;

  setup(target: Entity): void {
    this.target = target;
  }

  start(): void {
    //
  }
}
