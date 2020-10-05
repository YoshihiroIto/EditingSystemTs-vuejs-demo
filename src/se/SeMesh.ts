import { injectable } from 'tsyringe';
import { SeObject3D } from './SeObject3D';
import { History } from '../../externals/EditingSystemTs/src/History';

@injectable()
export class SeMesh extends SeObject3D {
  get meshType(): MeshType {
    return this._meshType;
  }

  protected _meshType: MeshType = MeshTypes.Unset;

  constructor(history: History) {
    super(history);
  }
}

@injectable()
export class SeBoxMesh extends SeMesh {
  constructor(history: History) {
    super(history);

    this._meshType = MeshTypes.Box;
  }
}

@injectable()
export class SePointMesh extends SeMesh {
  constructor(history: History) {
    super(history);

    this._meshType = MeshTypes.Point;
  }
}

export const MeshTypes = {
  Unset: 'unset',
  //
  Box: 'box',
  Point: 'point',
  //
  Data: 'data',
} as const;

export type MeshType = typeof MeshTypes[keyof typeof MeshTypes];
