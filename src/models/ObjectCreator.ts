import { SeCubeMesh, SePointMesh } from '@/se/SeMesh';
import { SeObject3D } from '@/se/SeObject3D';
import { container, singleton } from 'tsyringe';
import { ObjectDefinition } from './ObjectDefinition';

@singleton()
export class ObjectCreator {
  constructor() {
    this.registerObjectDefinitions();
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

  readonly objectDefinitions = new Map<string, ObjectDefinition>();

  private registerObjectDefinitions(): void {
    //todo:オブジェクト定義ファイルを読み込んできて登録する
    this.objectDefinitions.set(
      'cube',
      new ObjectDefinition(() => {
        return container.resolve(SeCubeMesh);
      })
    );

    this.objectDefinitions.set(
      'point',
      new ObjectDefinition(() => {
        return container.resolve(SePointMesh);
      })
    );
  }
}
