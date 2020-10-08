import { Entity } from '@/models/entity/Entity';
import { MeshTypes } from '@/models/entity/RenderDefinition';
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
    const meshType = model.definition?.renderDefinition?.meshType;
    if (meshType == null) {
      return;
    }

    switch (meshType) {
      case MeshTypes.Box:
        ThMeshInternal.boxGeom ??= new BoxBufferGeometry(1, 1, 1);
        ThMeshInternal.boxMaterial ??= new MeshNormalMaterial();
        this.geometry = ThMeshInternal.boxGeom;
        this.material = ThMeshInternal.boxMaterial;
        break;
      case MeshTypes.Point:
        ThMeshInternal.pointGeom ??= new SphereBufferGeometry(0.1, 6, 6);
        ThMeshInternal.pointMaterial ??= new MeshBasicMaterial({ color: 0xdddddd });
        this.geometry = ThMeshInternal.pointGeom;
        this.material = ThMeshInternal.pointMaterial;
        break;
      default:
        throw new Error('Not implementation');
    }
  }
}

@injectable()
export class ThMesh extends WithThObject(ThMeshInternal) {}
