import { SceneViewModel } from '@/viewModels/SceneViewModel';
import { Disposable } from '../../externals/EditingSystemTs/src/TypedEvent';
import { CompositeDisposable } from '../../externals/EditingSystemTs/src/CompositeDisposable';
import { Camera } from 'three/src/cameras/Camera';
import { dic } from '@/di/dic';
import { ViewportRenderer } from './ViewportRenderer';
import { Project } from '@/models/Project';
import { PerspectiveCamera } from 'three';
import { ViewportHelper } from '@/components/ViewportHelper';

export class RuntimePlayer implements Disposable {
  private sceneViewModel: SceneViewModel;
  private camera: Camera | null = null;

  private renderer: ViewportRenderer;
  private isDisposed = false;

  private readonly trash = new CompositeDisposable();

  constructor(project: Project, canvas: HTMLCanvasElement) {
    this.sceneViewModel = dic().resolve(SceneViewModel);
    this.sceneViewModel.setup(project.rootScene);
    this.trash.push(this.sceneViewModel);

    this.renderer = new ViewportRenderer(canvas);
    this.trash.push(this.renderer);

    this.camera = new PerspectiveCamera(45, 600 / 400, 0.1, 1000);
    this.camera.position.set(20, 20, 20);
    this.camera.lookAt(0, 0, 0);

    const viewportHelper = new ViewportHelper(this.sceneViewModel);
    this.trash.push(viewportHelper);

    this.animate();
  }

  dispose(): void {
    this.isDisposed = true;

    this.trash.dispose();
  }

  private count = 0;

  requestRender(): void {
    if (this.camera == null) {
      return;
    }

    console.log(++this.count);

    this.renderer.requestRender(this.sceneViewModel, this.camera);
  }

  private animate(): void {
    if (this.isDisposed) {
      return;
    }

    // todo:ここでスクリプトをじっこうする

    this.requestRender();

    requestAnimationFrame(() => this.animate());
  }
}
