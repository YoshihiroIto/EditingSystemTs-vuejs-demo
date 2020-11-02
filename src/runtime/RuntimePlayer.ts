/* eslint-disable @typescript-eslint/no-explicit-any */
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
import { Entity } from '@/models/entity/Entity';
import { Vector3 } from '@/foundations/math/Vector3';

@injectable()
export class RuntimePlayer implements Disposable {
  private sceneViewModel: SceneViewModel | null = null;
  private camera: Camera | null = null;

  private renderer: ViewportRenderer | null = null;
  private isDisposed = false;

  private project: Project | null = null;

  private readonly trash = new CompositeDisposable();

  constructor(private readonly history: History) {}

  start(project: Project, canvas: HTMLCanvasElement): void {
    this.project = project;

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

    this.setupApi();

    this.animate();
  }

  dispose(): void {
    this.isDisposed = true;

    this.history.endPause();

    this.trash.dispose();
  }

  private animate(): void {
    if (this.isDisposed) {
      return;
    }

    Assert.isNotNull(this.renderer);
    Assert.isNotNull(this.sceneViewModel);

    // console.log('RuntimePlayer', ++this.count);

    this.update(this.rootScene);

    this.renderer.render(this.sceneViewModel, this.camera);

    requestAnimationFrame(() => this.animate());
  }

  private count = 0;

  private get rootScene(): Entity {
    const rootScene = this.project?.rootScene;

    Assert.isNotNull(rootScene);

    return rootScene;
  }

  private update(entity: Entity): void {
    entity.update();

    for (const child of entity.allChildren()) {
      this.update(child);
    }
  }

  private setupApi(): void {
    // memo: https://qiita.com/Toyoharu-Nishikawa/items/138db999d62fe18de632
    (window as any).Vector3 = Vector3;
  }
}
