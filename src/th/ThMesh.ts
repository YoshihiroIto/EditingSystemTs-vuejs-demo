import { SeMesh } from '@/se/SeMesh';
import { BufferGeometry } from 'three/src/core/BufferGeometry';
import { Geometry } from 'three/src/core/Geometry';
import { BoxGeometry } from 'three/src/geometries/Geometries';
import { Material } from 'three/src/materials/Material';
import { MeshNormalMaterial } from 'three/src/materials/Materials';
import { Mesh } from 'three/src/objects/Mesh';
import { injectable } from 'tsyringe';
import { WithThObject } from './WithThObject';

class ThMeshInternal extends Mesh<Geometry | BufferGeometry, Material | Material[]> {
  private static readonly geometry = new BoxGeometry(1, 1, 1);
  private static readonly material = new MeshNormalMaterial();

  setupInternal(model: SeMesh): void {
    console.log(model.meshType);

    this.geometry = ThMeshInternal.geometry;
    this.material = ThMeshInternal.material;
  }
}

@injectable()
export class ThMesh extends WithThObject(ThMeshInternal) {}
