import { Vector3 } from '@/foundations/math/Vector3';
import { EntityDefinition } from '../entity/EntityDefinition';
import { ScriptDefinition } from '../entity/ScriptDefinition';

export type SdProject = {
  entityDefinitions: SdEntityDefinition[];
  rootScene: SdEntity;
};

export class SdEntityDefinition extends EntityDefinition {
  static toInstance(sd: SdEntityDefinition): EntityDefinition {
    sd.scriptDefinition = new ScriptDefinition({ code: sd.scriptDefinition?.code });

    return sd;
  }
}

export type SdEntity = {
  name: string;
  position: Vector3;
  rotation: Vector3;
  scale: Vector3;
  definition: string;
  children: SdEntity[];
};
