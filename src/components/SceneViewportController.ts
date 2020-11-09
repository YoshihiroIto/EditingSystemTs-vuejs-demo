import { Camera } from 'three/src/cameras/Camera';
import { Event } from 'three/src/core/EventDispatcher';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { TransformControls } from 'three/examples/jsm/controls/TransformControls.js';
import { BoxHelper } from 'three/src/helpers/BoxHelper';
import { Raycaster } from 'three/src/core/Raycaster';
import { TypedEvent, EventArgs } from '../../externals/EditingSystemTs/src/TypedEvent';
import { Disposable } from '../../externals/EditingSystemTs/src/Disposable';
import { Assert } from '../../externals/EditingSystemTs/src/Assert';
import { Vector3 } from '@/foundations/math/Vector3';
import { Vector2 } from 'three/src/math/Vector2';
import { from } from 'linq-to-typescript/sync/Enumerable';
import { SceneViewportControllerMode, SceneViewportControllerSpace } from './SceneViewportConstants';
import { MathUtils } from 'three/src/math/MathUtils';
import { Entity } from '@/models/entity/Entity';
import { ThObject3D } from '@/th/ThObject';
import { ThScene } from '@/th/ThScene';

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

  get isDragging(): boolean {
    return this._isDragging;
  }

  get isVisibleGizmo(): boolean {
    return this._isVisibleGizmo;
  }

  set isVisibleGizmo(i: boolean) {
    if (i === this._isVisibleGizmo) {
      return;
    }

    this._isVisibleGizmo = i;

    const onDraggingChanged = (event: Event) => {
      this.cameraControls.enabled = !event.value;
      this.canPickObject = !event.value;
    };

    if (this._isVisibleGizmo === true) {
      this.gizmo.addEventListener('change', this.requestRender);
      this.gizmo.addEventListener('objectChange', this.onObjectChangeGizmo);
      this.gizmo.addEventListener('mouseDown', this.onMouseDownGizmo);
      this.gizmo.addEventListener('mouseUp', this.onMouseUpGizmo);
      this.gizmo.addEventListener('dragging-changed', onDraggingChanged);
      this.parent.add(this.gizmo);
    } else {
      this.parent.remove(this.gizmo);
      this.gizmo.removeEventListener('change', this.requestRender);
      this.gizmo.removeEventListener('objectChange', this.onObjectChangeGizmo);
      this.gizmo.removeEventListener('mouseDown', this.onMouseDownGizmo);
      this.gizmo.removeEventListener('mouseUp', this.onMouseUpGizmo);
      this.gizmo.removeEventListener('dragging-changed', onDraggingChanged);
    }

    this.requestRender();
  }

  private static readonly _allInstances = new Set<SceneViewportController>();

  private readonly cameraControls: OrbitControls;
  private readonly gizmo: TransformControls;
  private boundingBox: BoxHelper | null = null;

  private attachedObject: ThObject3D | null = null;
  private raycaster: Raycaster | null = null;

  private canPickObject = true;
  private _isSnap = false;
  private _isVisibleGizmo = false;
  private _isDragging = false;

  constructor(
    private readonly parent: ThScene,
    private readonly pickingTarget: ThObject3D,
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
    this.isVisibleGizmo = false;
    this.gizmo.dispose();

    //
    this.cameraControls.removeEventListener('change', this.requestRender);
    this.cameraControls.dispose();
  }

  attachTargetObject(target: ThObject3D): void {
    this.gizmo.attach(target);
    this.attachedObject = target;

    if (this.boundingBox != null) {
      this.parent.remove(this.boundingBox);
    }
    if (target != null) {
      this.boundingBox = new BoxHelper(target);
      this.parent.add(this.boundingBox);
    }
  }

  detachTargetObject(): void {
    this.attachedObject = null;
    this.gizmo.detach();

    if (this.boundingBox != null) {
      this.parent.remove(this.boundingBox);
      this.boundingBox = null;
    }
  }

  onRender(): void {
    this.boundingBox?.update();
  }

  private onMouseDownGizmo = (): void => {
    this._isDragging = true;
    this.beginContinuousEditing.emit(this, EventArgs.empty);
  };

  private onMouseUpGizmo = (): void => {
    this._isDragging = false;
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

    this.raycaster ??= new Raycaster();

    const x = event.offsetX;
    const y = event.offsetY;
    const w = this.domElement.offsetWidth;
    const h = this.domElement.offsetHeight;

    const mouse = new Vector2((x / w) * 2 - 1, -(y / h) * 2 + 1);
    this.raycaster.setFromCamera(mouse, this.camera);

    const children = from(this.pickingTarget.allChildren())
      .where(x => (x as ThObject3D).model !== null)
      .toArray();

    const intersects = this.raycaster.intersectObjects(children);
    if (intersects.length == 0) {
      return;
    }

    this.entitiesPicked.emit(
      this,
      new EntitiesPickedEventArgs(
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        intersects.map(x => (x.object as ThObject3D).model!.owner)
      )
    );
  };
}

export class EntitiesPickedEventArgs extends EventArgs {
  constructor(readonly entities: Entity[]) {
    super();
  }
}
