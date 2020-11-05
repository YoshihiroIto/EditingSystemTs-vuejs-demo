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

  requestRender(scene: Object3D | null, camera: Camera | null): void {
    this.scene = scene;
    this.camera = camera;

    const animate = () => {
      this.render(this.scene, this.camera);
      this.isRequestRender = false;
    };

    if (this.isRequestRender == false) {
      this.isRequestRender = true;

      requestAnimationFrame(animate);
    }
  }

  render(scene: Object3D | null, camera: Camera | null): void {
    if (scene == null) {
      return;
    }
    if (camera == null) {
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
      const widthC = Math.floor(width * window.devicePixelRatio);
      const heightC = Math.floor(height * window.devicePixelRatio);

      const needResize = domElement.width !== widthC || domElement.height !== heightC;

      if (needResize) {
        this.renderer.setSize(width, height, false);
        CameraHelper.SetAspect(camera, width / height);

        if (this.onResize != null) {
          this.onResize();
        }
      }
    }

    this.renderer.render(scene, camera);
  }
}
