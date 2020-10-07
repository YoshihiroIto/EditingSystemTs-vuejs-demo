import { Camera } from 'three/src/cameras/Camera';
import { Event } from 'three/src/core/EventDispatcher';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { TransformControls } from 'three/examples/jsm/controls/TransformControls.js';
import { Raycaster } from 'three/src/core/Raycaster';
import { ThObject3D } from '@/th/ThObject';
import { TypedEvent, Disposable, EventArgs } from '../../externals/EditingSystemTs/src/TypedEvent';
import { Assert } from '../../externals/EditingSystemTs/src/Assert';
import { Vector3 } from '@/foundations/math/SeVector3';
import { Vector2 } from 'three/src/math/Vector2';
import { from } from 'linq-to-typescript/sync/Enumerable';
import { SceneViewportControllerMode, SceneViewportControllerSpace } from './SceneViewportConstants';
import { MathUtils } from 'three/src/math/MathUtils';
import { Entity } from '@/models/entity/Entity';

export class SceneViewportController implements Disposable {
  readonly beginContinuousEditing = new TypedEvent();
  readonly endContinuousEditing = new TypedEvent();
  readonly entitiesPicked = new TypedEvent<EntitiesPickedEventArgs>();

  static get allInstances(): ReadonlySet<SceneViewportController> {
    return SceneViewportController._allInstances;
  }

  set mode(m: SceneViewportControllerMode) {
    this.gizmo.setMode(m);
  }
  get mode(): SceneViewportControllerMode {
    return this.gizmo.mode as SceneViewportControllerMode;
  }
  set space(m: SceneViewportControllerSpace) {
    this.gizmo.setSpace(m);
  }
  get space(): SceneViewportControllerSpace {
    return this.gizmo.space as SceneViewportControllerSpace;
  }
  get isSnap(): boolean {
    return this._isSnap;
  }
  set isSnap(i: boolean) {
    if (i === this._isSnap) {
      return;
    }

    this._isSnap = i;

    if (this._isSnap === true) {
      this.gizmo.setTranslationSnap(1);
      this.gizmo.setRotationSnap(MathUtils.degToRad(15));
      this.gizmo.setScaleSnap(0.25);
    } else {
      this.gizmo.setTranslationSnap(null);
      this.gizmo.setRotationSnap(null);
      this.gizmo.setScaleSnap(null);
    }
  }

  get enabled(): boolean {
    return this.gizmo.enabled;
  }
  set enabled(i: boolean) {
    this.gizmo.enabled = i;
  }

  get IsVisibleGizmo(): boolean {
    return this._enabledGizmo;
  }

  set IsVisibleGizmo(i: boolean) {
    if (i === this._enabledGizmo) {
      return;
    }

    this._enabledGizmo = i;

    if (this._enabledGizmo === true) {
      this.gizmo.addEventListener('change', this.requestRender);
      this.gizmo.addEventListener('objectChange', this.onObjectChangeGizmo);
      this.gizmo.addEventListener('mouseDown', this.onMouseDownGizmo);
      this.gizmo.addEventListener('mouseUp', this.onMouseUpGizmo);
      this.gizmo.addEventListener('dragging-changed', (event: Event) => {
        this.cameraControls.enabled = !event.value;
        this.canPickObject = !event.value;
      });
      this.parent.add(this.gizmo);
    } else {
      this.parent.remove(this.gizmo);
      this.gizmo.removeEventListener('change', this.requestRender);
    }
  }

  private static readonly _allInstances = new Set<SceneViewportController>();

  private readonly cameraControls: OrbitControls;
  private readonly gizmo: TransformControls;

  private attachedObject: ThObject3D | null = null;
  private raycaster = new Raycaster();

  private _isSnap = false;
  private canPickObject = true;
  private _enabledGizmo = false;

  constructor(
    private readonly parent: ThObject3D,
    private readonly camera: Camera,
    private readonly domElement: HTMLCanvasElement,
    private readonly requestRender: () => void
  ) {
    SceneViewportController._allInstances.add(this);
    //
    this.cameraControls = new OrbitControls(camera, this.domElement);
    this.cameraControls.addEventListener('change', this.requestRender);

    //
    this.gizmo = new TransformControls(camera, this.domElement);

    //
    this.domElement.addEventListener('pointerdown', this.onClickElement, false);
  }

  dispose(): void {
    SceneViewportController._allInstances.delete(this);

    this.detachTargetObject();

    //
    this.domElement.removeEventListener('click', this.onClickElement, false);

    //
    this.IsVisibleGizmo = false;
    this.gizmo.dispose();

    //
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

  private onMouseDownGizmo = (): void => {
    this.beginContinuousEditing.emit(this, EventArgs.empty);
  };

  private onMouseUpGizmo = (): void => {
    this.endContinuousEditing.emit(this, EventArgs.empty);
  };

  private onObjectChangeGizmo = (): void => {
    Assert.isNotNull(this.attachedObject?.model);

    this.attachedObject.model.position = new Vector3(
      this.attachedObject.position.x,
      this.attachedObject.position.y,
      this.attachedObject.position.z
    );

    this.attachedObject.model.rotation = new Vector3(
      this.attachedObject.rotation.x,
      this.attachedObject.rotation.y,
      this.attachedObject.rotation.z
    );

    this.attachedObject.model.scale = new Vector3(
      this.attachedObject.scale.x,
      this.attachedObject.scale.y,
      this.attachedObject.scale.z
    );
  };

  private onClickElement = (event: Event): void => {
    if (this.canPickObject == false) {
      return;
    }

    const x = event.offsetX;
    const y = event.offsetY;
    const w = this.domElement.offsetWidth;
    const h = this.domElement.offsetHeight;

    const mouse = new Vector2((x / w) * 2 - 1, -(y / h) * 2 + 1);
    this.raycaster.setFromCamera(mouse, this.camera);

    const intersects = this.raycaster.intersectObjects(from(this.parent.allChildren()).toArray());
    if (intersects.length == 0) {
      return;
    }

    this.entitiesPicked.emit(this, new EntitiesPickedEventArgs(intersects.map(x => (x.object as ThObject3D).model)));
  };
}

export class EntitiesPickedEventArgs extends EventArgs {
  constructor(readonly entities: Entity[]) {
    super();
  }
}
