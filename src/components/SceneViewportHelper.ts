import { ThObject3D } from '@/th/ThObject';
import { GridHelper } from 'three/src/helpers/GridHelper';
import { AxesHelper } from 'three/src/helpers/AxesHelper';
import { Color } from 'three/src/math/Color';
import { Disposable } from '../../externals/EditingSystemTs/src/TypedEvent';

export class SceneViewportHelper implements Disposable {
  readonly grid: GridHelper;
  readonly axes: AxesHelper;

  constructor(private readonly parent: ThObject3D) {
    this.grid = new GridHelper(50, 50, new Color(0x303030), new Color(0x505050));
    this.parent.add(this.grid);

    this.axes = new AxesHelper(25 * 1.1);
    this.parent.add(this.axes);
  }

  dispose(): void {
    this.parent.remove(this.axes);
    this.parent.remove(this.grid);
  }
}
