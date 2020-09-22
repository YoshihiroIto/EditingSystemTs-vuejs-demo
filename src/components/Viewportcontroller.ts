import { ThObject3D } from '@/th/ThObject';
import { Camera } from 'three/src/cameras/Camera';
import { Event } from 'three/src/core/EventDispatcher';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { TransformControls } from 'three/examples/jsm/controls/TransformControls.js';
import { TypedEvent, Disposable, EventArgs } from '../../externals/EditingSystemTs/src/TypedEvent';
import { Assert } from '../../externals/EditingSystemTs/src/Assert';
import { SeVector3 } from '@/se/math/SeVector3';

export class ViewportController implements Disposable {
  readonly cameraControls: OrbitControls;
  readonly gizmo: TransformControls;
  private attachedObject: ThObject3D | null = null;

  readonly beginContinuousEditing = new TypedEvent();
  readonly endContinuousEditing = new TypedEvent();

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
    this.gizmo.addEventListener('objectChange', () => this.onObjectChange());
    this.gizmo.addEventListener('mouseDown', () => this.onMouseDown());
    this.gizmo.addEventListener('mouseUp', () => this.onMouseUp());
    this.gizmo.addEventListener('dragging-changed', (event: Event) => {
      return (this.cameraControls.enabled = !event.value);
    });

    this.parent.add(this.gizmo);
  }

  dispose(): void {
    this.detachTargetObject();

    this.parent.remove(this.gizmo);

    this.gizmo.removeEventListener('change', this.requestRender);
    this.gizmo.dispose();

    this.cameraControls.removeEventListener('change', this.requestRender);
    this.cameraControls.dispose();
  }

  detachTargetObject(): void {
    this.attachedObject = null;
    this.gizmo.detach();
  }

  attachTargetObject(target: ThObject3D): void {
    this.gizmo.attach(target);
    this.attachedObject = target;
  }

  onMouseDown(): void {
    this.beginContinuousEditing.emit(this, EventArgs.empty);
  }

  onMouseUp(): void {
    this.endContinuousEditing.emit(this, EventArgs.empty);
  }

  onObjectChange(): void {
    Assert.isNotNull(this.attachedObject?.model);

    this.attachedObject.model.position = new SeVector3(
      this.attachedObject.position.x,
      this.attachedObject.position.y,
      this.attachedObject.position.z
    );

    this.attachedObject.model.rotation = new SeVector3(
      this.attachedObject.rotation.x,
      this.attachedObject.rotation.y,
      this.attachedObject.rotation.z
    );

    this.attachedObject.model.scale = new SeVector3(
      this.attachedObject.scale.x,
      this.attachedObject.scale.y,
      this.attachedObject.scale.z
    );
  }
}
