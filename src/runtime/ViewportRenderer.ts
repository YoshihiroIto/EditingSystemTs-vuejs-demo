import { Disposable } from '../../externals/EditingSystemTs/src/TypedEvent';
import { WebGLRenderer } from 'three/src/renderers/WebGLRenderer';
import { CameraHelper } from '@/foundations/CameraHelper';
import { Camera } from 'three/src/cameras/Camera';
import { Object3D } from 'three';

export class ViewportRenderer implements Disposable {
  private renderer: WebGLRenderer;
  private isRequestRender = false;
  private camera: Camera | null = null;
  private scene: Object3D | null = null;

  private onRender: (() => void) | null;
  private onResize: (() => void) | null;

  constructor(
    canvas: HTMLCanvasElement,
    {
      onRender = null,
      onResize = null,
    }: Partial<{
      onRender: (() => void) | null;
      onResize: (() => void) | null;
    }> = {}
  ) {
    this.onRender = onRender;
    this.onResize = onResize;

    //
    this.renderer = new WebGLRenderer({
      antialias: true,
      canvas: canvas,
    });
    this.renderer.setPixelRatio(window.devicePixelRatio);
  }

  dispose(): void {
    this.renderer.dispose();
  }

  requestRender(scene: Object3D, camera: Camera): void {
    if (this.isRequestRender) {
      return;
    }

    this.scene = scene;
    this.camera = camera;

    const animate = () => {
      this.render();
      this.isRequestRender = false;
    };

    this.isRequestRender = true;
    requestAnimationFrame(animate);
  }

  private render(): void {
    if (this.scene == null) {
      return;
    }
    if (this.camera == null) {
      return;
    }

    if (this.onRender != null) {
      this.onRender();
    }

    // canvas size
    {
      // ref: https://threejsfundamentals.org/threejs/lessons/threejs-responsive.html
      const domElement = this.renderer.domElement;
      const width = domElement.clientWidth;
      const height = domElement.clientHeight;
      const needResize = domElement.width !== width || domElement.height !== height;

      if (needResize) {
        this.renderer.setSize(width, height, false);
        CameraHelper.SetAspect(this.camera, width / height);

        if (this.onResize != null) {
          this.onResize();
        }
      }
    }

    this.renderer.render(this.scene, this.camera);
  }
}
