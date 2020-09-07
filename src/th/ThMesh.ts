import { BoxGeometry, BufferGeometry, Geometry, Material, Mesh, MeshNormalMaterial } from 'three';
import { injectable } from 'tsyringe';
import { WithThObject } from './ThObject';

@injectable()
export class ThMeshInternal extends Mesh<Geometry | BufferGeometry, Material | Material[]> {
  static readonly geometry = new BoxGeometry(1, 1, 1);
  static readonly material = new MeshNormalMaterial();

  setupInternal(): void {
    this.geometry = ThMeshInternal.geometry;
    this.material = ThMeshInternal.material;
  }
}

export const ThMesh = WithThObject(ThMeshInternal);
