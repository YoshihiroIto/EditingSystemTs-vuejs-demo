import { injectable } from 'tsyringe';
import { SeVector3 } from './math/SeVector3';
import { NotifyPropertyChanged, PropertyChangedEventArgs } from '../../externals/EditingSystemTs/src/Event';
import { History } from '../../externals/EditingSystemTs/src/History';
import { TypedEvent } from '../../externals/EditingSystemTs/src/TypedEvent';
import { ObservableArray } from '../../externals/EditingSystemTs/src/ObservableArray';
import { EditingSystem } from '../../externals/EditingSystemTs/src/Decorators';

@injectable()
export class SeObject3D implements NotifyPropertyChanged {
  readonly propertyChanged = new TypedEvent<PropertyChangedEventArgs>();

  readonly children = new ObservableArray<SeObject3D>();

  position = SeVector3.Zero;
  rotation = SeVector3.Zero;
  scale = SeVector3.One;

  @EditingSystem.ignore
  parent: SeObject3D | null = null;

  constructor(readonly history: History) {
    history.register(this);
  }

  add(...objects: SeObject3D[]): void {
    for (const object of objects) {
      if (object.parent != null) {
        object.parent.remove(object);
      }

      object.parent = this;
      this.children.push(object);
    }
  }

  remove(...objects: SeObject3D[]): void {
    for (const object of objects) {
      const index = this.children.indexOf(object);

      if (index !== -1) {
        object.parent = null;
        this.children.splice(index, 1);
      }
    }
  }
}