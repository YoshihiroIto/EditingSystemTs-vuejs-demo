import { Entity } from '@/models/entity/Entity';
import { BufferGeometry } from 'three/src/core/BufferGeometry';
import { Geometry } from 'three/src/core/Geometry';
import { BoxBufferGeometry, SphereBufferGeometry } from 'three/src/geometries/Geometries';
import { Material } from 'three/src/materials/Material';
import { MeshBasicMaterial, MeshNormalMaterial } from 'three/src/materials/Materials';
import { Mesh } from 'three/src/objects/Mesh';
import { injectable } from 'tsyringe';
import { WithThObject } from './WithThObject';

class ThMeshInternal extends Mesh<Geometry | BufferGeometry, Material | Material[]> {
  private static boxGeom: BufferGeometry | null = null;
  private static boxMaterial: Material | null = null;
  private static pointGeom: BufferGeometry | null = null;
  private static pointMaterial: Material | null = null;

  setupInternal(model: Entity): void {
    // switch (model.meshType) {
    //   case MeshTypes.Box:
    //     ThMeshInternal.boxGeom ??= new BoxBufferGeometry(1, 1, 1);
    //     ThMeshInternal.boxMaterial ??= new MeshNormalMaterial();
    //     this.geometry = ThMeshInternal.boxGeom;
    //     this.material = ThMeshInternal.boxMaterial;
    //     break;
    //   case MeshTypes.Point:
    //     ThMeshInternal.pointGeom ??= new SphereBufferGeometry(0.1, 6, 6);
    //     ThMeshInternal.pointMaterial ??= new MeshBasicMaterial({ color: 0xdddddd });
    //     this.geometry = ThMeshInternal.pointGeom;
    //     this.material = ThMeshInternal.pointMaterial;
    //     break;
    //   default:
    //     throw new Error('Not implementation');
    // }

    ThMeshInternal.boxGeom ??= new BoxBufferGeometry(1, 1, 1);
    ThMeshInternal.boxMaterial ??= new MeshNormalMaterial();
    this.geometry = ThMeshInternal.boxGeom;
    this.material = ThMeshInternal.boxMaterial;
  }
}

@injectable()
export class ThMesh extends WithThObject(ThMeshInternal) {}
