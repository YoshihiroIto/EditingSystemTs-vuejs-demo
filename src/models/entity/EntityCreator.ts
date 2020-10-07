import { SeBoxMesh, SePointMesh } from '@/se/SeMesh';
import { SeObject3D } from '@/se/SeObject3D';
import { container, singleton } from 'tsyringe';
import { EntityDefinition } from './EntityDefinition';

@singleton()
export class EntityCreator {
  constructor() {
    this.registerEntityDefinitions();
  }

  create(name: string): SeObject3D {
    const objDef = this.objectDefinitions.get(name);

    if (objDef === undefined) {
      throw new Error(`not fount ${name}`);
    }

    const obj = objDef.create();

    obj.objectDefinitionName = name;

    return obj;
  }

  readonly objectDefinitions = new Map<string, EntityDefinition>();

  private registerEntityDefinitions(): void {
    //todo:エンティティ定義ファイルを読み込んできて登録する
    this.objectDefinitions.set(
      'box',
      new EntityDefinition(() => {
        return container.resolve(SeBoxMesh);
      })
    );

    this.objectDefinitions.set(
      'point',
      new EntityDefinition(() => {
        return container.resolve(SePointMesh);
      })
    );
  }
}
