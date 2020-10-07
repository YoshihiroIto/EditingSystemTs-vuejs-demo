/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  NotifyCollectionChangedEventArgs,
  NotifyCollectionChangedActions,
  PropertyChangedEventArgs,
} from '../../externals/EditingSystemTs/src/Event';
import { container } from 'tsyringe';
import { ThMesh } from './ThMesh';
import { Assert } from '../../externals/EditingSystemTs/src/Assert';
import { Object3D } from 'three/src/core/Object3D';
import { Disposable } from 'externals/EditingSystemTs/src/TypedEvent';
import { Constructor } from '../foundations/Mixin';
import { nameof } from '../foundations/Nameof';
import { Entity } from '@/models/entity/Entity';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function WithThObject<TBase extends Constructor, T extends Entity>(Base: TBase) {
  return class extends Base implements Disposable {
    get model(): Entity {
      Assert.isNotNull(this._model);

      return this._model;
    }

    private _model: T | null = null;
    private viewModel: Object3D | null = null;

    private childrenChanged = (sender: unknown, e: NotifyCollectionChangedEventArgs): void => {
      Assert.isNotNull(this.viewModel);

      switch (e.action) {
        case NotifyCollectionChangedActions.Add: {
          if (e.newItems) {
            const newObjects = e.newItems.map(x => {
              const mesh = container.resolve(ThMesh);
              mesh.setup(x as Entity);

              return mesh;
            });

            this.viewModel.add(...newObjects);
          }

          break;
        }

        case NotifyCollectionChangedActions.Remove:
          if (e.oldItems) {
            const modelsLookup = new Set<Entity>(e.oldItems as Array<Entity>);
            const targetChildren = this.viewModel.children.filter(x => modelsLookup.has((x as any).model));

            for (const vm of targetChildren) {
              ((vm as unknown) as Disposable).dispose();
            }

            this.viewModel.remove(...targetChildren);
          }
          break;

        default:
          throw new Error(`Not implementation: "${e.action}"`);
      }
    };

    private propertyChanged = (_: unknown, e: PropertyChangedEventArgs): void => {
      Assert.isNotNull(this._model);
      Assert.isNotNull(this.viewModel);

      switch (e.propertyName) {
        case nameof<Entity>('name'):
          this.viewModel.name = this._model.name;
          break;

        case nameof<Entity>('position'):
          this.viewModel.position.set(this._model.position.x, this._model.position.y, this._model.position.z);
          break;

        case nameof<Entity>('rotation'):
          this.viewModel.rotation.set(this._model.rotation.x, this._model.rotation.y, this._model.rotation.z);
          break;

        case nameof<Entity>('scale'):
          this.viewModel.scale.set(this._model.scale.x, this._model.scale.y, this._model.scale.z);
          break;

        default:
          throw new Error(`Not implementation: "${e.propertyName}"`);
      }
    };

    setup(model: T): void {
      Assert.isNotNull(model);

      this.viewModel = (this as unknown) as Object3D;
      this._model = model;

      this._model.children.collectionChanged.on(this.childrenChanged);
      this._model.propertyChanged.on(this.propertyChanged);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (this as any)?.setupInternal?.call(this, model);

      [
        nameof<Entity>('name'),
        nameof<Entity>('position'),
        nameof<Entity>('rotation'),
        nameof<Entity>('scale'),
      ].forEach(x => this.propertyChanged(this, new PropertyChangedEventArgs(x, null)));
    }

    dispose(): void {
      this._model?.propertyChanged.off(this.propertyChanged);
      this._model?.children.collectionChanged.off(this.childrenChanged);
    }

    *allChildren(): Generator<Object3D, void, unknown> {
      yield* this.allChildrenInternal(this.viewModel);
    }

    private *allChildrenInternal(parent: Object3D | null | undefined) {
      if (parent?.children == null) {
        return;
      }

      for (const child of parent.children) {
        if ((child as any)?.allChildren == null) {
          continue;
        }

        yield child;
        yield* (child as any).allChildren.call(child);
      }
    }
  };
}
