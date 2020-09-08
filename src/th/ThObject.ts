/* eslint-disable @typescript-eslint/no-explicit-any */
import { SeMesh } from '@/se/SeMesh';
import {
  NotifyCollectionChangedEventArgs,
  NotifyCollectionChangedActions,
  PropertyChangedEventArgs,
} from '../../externals/EditingSystemTs/src/Event';
import { container } from 'tsyringe';
import { ThMesh } from './ThMesh';
import { SeObject3D } from '@/se/SeObject3D';
import { Assert } from '../../externals/EditingSystemTs/src/Assert';
import { Object3D } from 'three/src/core/Object3D';
import { Disposable } from 'externals/EditingSystemTs/src/TypedEvent';
import { Constructor } from '../foundations/Mixin';
import { nameof } from '../foundations/nameof';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function WithThObject<TBase extends Constructor, T extends SeObject3D>(Base: TBase) {
  return class extends Base implements Disposable {
    model: T | null = null;
    viewModel: Object3D | null = null;

    childrenChanged = (sender: unknown, e: NotifyCollectionChangedEventArgs): void => {
      Assert.isNotNull(this.viewModel);

      switch (e.action) {
        case NotifyCollectionChangedActions.Add: {
          if (e.newItems) {
            const newObjects = e.newItems.map(x => {
              const mesh = container.resolve(ThMesh);
              mesh.setup(x as SeMesh);

              return mesh;
            });

            this.viewModel.children.splice(e.newStartingIndex, 0, ...newObjects);
          }

          break;
        }

        case NotifyCollectionChangedActions.Remove:
          if (e.oldItems) {
            const children = this.viewModel.children.map(x => (x as any).model);

            for (const oldItem of e.oldItems) {
              const index = children.indexOf(oldItem as SeObject3D);

              this.viewModel.children.splice(index, 1);
            }
          }
          break;

        default:
          throw new Error(`Not implementation: "${e.action}"`);
      }
    };

    propertyChanged = (_: unknown, e: PropertyChangedEventArgs): void => {
      Assert.isNotNull(this.model);
      Assert.isNotNull(this.viewModel);

      switch (e.propertyName) {
        case nameof<SeObject3D>('position'):
          this.viewModel.position.x = this.model.position.x;
          this.viewModel.position.y = this.model.position.y;
          this.viewModel.position.z = this.model.position.z;
          break;

        case nameof<SeObject3D>('rotation'):
          this.viewModel.rotation.x = this.model.rotation.x;
          this.viewModel.rotation.y = this.model.rotation.y;
          this.viewModel.rotation.z = this.model.rotation.z;
          break;

        case nameof<SeObject3D>('scale'):
          this.viewModel.scale.x = this.model.scale.x;
          this.viewModel.scale.y = this.model.scale.y;
          this.viewModel.scale.z = this.model.scale.z;
          break;

        default:
          throw new Error(`Not implementation: "${e.propertyName}"`);
      }
    };

    setup(model: T): void {
      Assert.isNotNull(model);

      this.viewModel = (this as unknown) as Object3D;
      this.model = model;

      this.model.children.collectionChanged.on(this.childrenChanged);
      this.model.propertyChanged.on(this.propertyChanged);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (this as any)?.setupInternal?.call(this);
    }

    dispose(): void {
      this.model?.children.collectionChanged.off(this.childrenChanged);
      this.model?.propertyChanged.off(this.propertyChanged);
    }
  };
}
