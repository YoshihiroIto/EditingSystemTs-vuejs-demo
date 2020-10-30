import { SceneViewModel } from '@/viewModels/SceneViewModel';
import { Disposable } from '../../externals/EditingSystemTs/src/TypedEvent';
import { CompositeDisposable } from '../../externals/EditingSystemTs/src/CompositeDisposable';
import { History } from '../../externals/EditingSystemTs/src/History';
import { Camera } from 'three/src/cameras/Camera';
import { dic } from '@/di/dic';
import { ViewportRenderer } from './ViewportRenderer';
import { Project } from '@/models/Project';
import { PerspectiveCamera } from 'three';
import { ViewportHelper } from '@/components/ViewportHelper';
import { injectable } from 'tsyringe';
import { Assert } from '../../externals/EditingSystemTs/src/Assert';

@injectable()
export class RuntimePlayer implements Disposable {
  private sceneViewModel: SceneViewModel | null = null;
  private camera: Camera | null = null;

  private renderer: ViewportRenderer | null = null;
  private isDisposed = false;

  private readonly trash = new CompositeDisposable();

  constructor(private readonly history: History) {}

  start(project: Project, canvas: HTMLCanvasElement): void {
    this.history.beginPause();

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

    this.history.endPause();

    this.trash.dispose();
  }

  private count = 0;

  private animate(): void {
    if (this.isDisposed) {
      return;
    }

    Assert.isNotNull(this.renderer);
    Assert.isNotNull(this.sceneViewModel);

    // todo:ここでスクリプトをじっこうする

    console.log('RuntimPlayer', ++this.count);

    this.renderer.render(this.sceneViewModel, this.camera);

    requestAnimationFrame(() => this.animate());
  }
}
