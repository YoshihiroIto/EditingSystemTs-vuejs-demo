import { CreateObjectUseCase } from '@/useCases/project/CreateObjectUseCase';
import { SeObject3D } from '@/se/SeObject3D';
import { ObjectCreator } from '@/models/ObjectCreator';
import { singleton } from 'tsyringe';

@singleton()
export class CreateObjectInteractor implements CreateObjectUseCase {
  constructor(private readonly objectCreator: ObjectCreator) {}

  invoke(name: string): SeObject3D {
    const box = this.objectCreator.create(name);

    box.name = `Obj${CreateObjectInteractor.instanceCount++}`;

    return box;
  }

  private static instanceCount = 0;
}
