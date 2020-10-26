import { Entity } from '@/models/entity/Entity';
import { SceneViewModel } from '@/viewModels/SceneViewModel';
import { Disposable } from 'externals/EditingSystemTs/src/TypedEvent';
import { Camera } from 'three/src/cameras/Camera';
import { dic } from '@/di/dic';
import { ViewportRenderer } from './ViewportRenderer';

export class RuntimePlayer implements Disposable {
  // private rootSceneViewModel: SceneViewModel;
  private camera: Camera | null = null;

  // private renderer: ViewportRenderer;
  private isDisposed = false;

  constructor(serializedProject: string, canvas: HTMLCanvasElement) {
    // this.rootSceneViewModel = dic().resolve(SceneViewModel);
    // this.rootSceneViewModel.setup(rootScene);
    // this.renderer = new ViewportRenderer(canvas);
    // requestAnimationFrame(() => this.animate());
  }

  dispose(): void {
    this.isDisposed = true;

    // this.rootSceneViewModel.dispose();
  }

  private animate(): void {
    if (this.isDisposed) {
      return;
    }

    if (this.camera == null) {
      return;
    }

    // this.renderer.requestRender(this.rootSceneViewModel, this.camera);
  }
}
