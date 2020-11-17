import { Entity } from '@/models/entity/Entity';
import { MeshTypes } from '@/models/entity/RenderDefinition';
import { BufferGeometry } from 'three/src/core/BufferGeometry';
import { Geometry } from 'three/src/core/Geometry';
import { BoxBufferGeometry, SphereBufferGeometry } from 'three/src/geometries/Geometries';
import { Material } from 'three/src/materials/Material';
import { MeshLambertMaterial } from 'three/src/materials/Materials';
import { Mesh } from 'three/src/objects/Mesh';
import { injectable } from 'tsyringe';
import { WithThObject } from './WithThObject';

class ThMeshInternal extends Mesh<Geometry | BufferGeometry, Material | Material[]> {
  private static boxGeom: BufferGeometry | null = null;
  private static pointGeom: BufferGeometry | null = null;

  protected static selectedMaterial = new MeshLambertMaterial({ color: 0x33_33_33, emissive: 0x00_00_ff });
  protected static unselectedMaterial = new MeshLambertMaterial({ color: 0x33_33_33 });

  setupInternal(model: Entity): void {
    const meshType = model.definition?.renderDefinition?.meshType;
    if (meshType == null) {
      return;
    }

    switch (meshType) {
      case MeshTypes.Box:
        ThMeshInternal.boxGeom ??= new BoxBufferGeometry(1, 1, 1);
        this.geometry = ThMeshInternal.boxGeom;
        this.material = ThMeshInternal.unselectedMaterial;

        break;
      case MeshTypes.Point:
        ThMeshInternal.pointGeom ??= new SphereBufferGeometry(0.1, 6, 6);
        this.geometry = ThMeshInternal.pointGeom;
        this.material = ThMeshInternal.unselectedMaterial;

        break;
      default:
        throw new Error('Not implementation');
    }
  }
}

@injectable()
export class ThMesh extends WithThObject(ThMeshInternal) {
  get isSelected(): boolean {
    return this._isSelected;
  }

  set isSelected(i: boolean) {
    if (this._isSelected === i) {
      return;
    }

    this._isSelected = i;
    this.material = this._isSelected ? ThMeshInternal.selectedMaterial : ThMeshInternal.unselectedMaterial;
  }

  private _isSelected = false;
}
