import { ThObject3D } from '@/th/ThObject';
import { Disposable } from 'externals/EditingSystemTs/src/TypedEvent';
import { Camera } from 'three/src/cameras/Camera';
import { Event } from 'three/src/core/EventDispatcher';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { TransformControls } from 'three/examples/jsm/controls/TransformControls.js';

export class ViewportController implements Disposable {
  readonly cameraControls: OrbitControls;
  readonly gizmo: TransformControls;

  constructor(
    private readonly parent: ThObject3D,
    camera: Camera,
    domElement: HTMLCanvasElement,
    private readonly requestRender: () => void
  ) {
    this.cameraControls = new OrbitControls(camera, domElement);
    this.cameraControls.addEventListener('change', this.requestRender);

    this.gizmo = new TransformControls(camera, domElement);
    this.gizmo.addEventListener('change', this.requestRender);
    this.gizmo.addEventListener('dragging-changed', (event: Event) => {
      return (this.cameraControls.enabled = !event.value);
    });

    this.parent.add(this.gizmo);
  }

  dispose(): void {
    this.parent.remove(this.gizmo);

    this.gizmo.removeEventListener('change', this.requestRender);
    this.gizmo.dispose();

    this.cameraControls.removeEventListener('change', this.requestRender);
    this.cameraControls.dispose();
  }

  detachTargetObject(): void {
    this.gizmo.detach();
  }

  attachTargetObject(target: ThObject3D): void {
    this.gizmo.attach(target);
  }
}
