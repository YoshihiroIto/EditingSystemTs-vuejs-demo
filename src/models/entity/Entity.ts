import { injectable } from 'tsyringe';
import { Vector3 } from '../../foundations/math/SeVector3';
import { NotifyPropertyChanged, PropertyChangedEventArgs } from '../../../externals/EditingSystemTs/src/Event';
import { History } from '../../../externals/EditingSystemTs/src/History';
import { TypedEvent } from '../../../externals/EditingSystemTs/src/TypedEvent';
import { ObservableArray } from '../../../externals/EditingSystemTs/src/ObservableArray';
import { EditingSystem } from '../../../externals/EditingSystemTs/src/Decorators';

@injectable()
export class Entity implements NotifyPropertyChanged {
  readonly propertyChanged = new TypedEvent<PropertyChangedEventArgs>();
  readonly children = new ObservableArray<Entity>();

  name = '';

  definitionName: string | null = null;

  position = Vector3.Zero;
  rotation = Vector3.Zero;
  scale = Vector3.One;

  @EditingSystem.ignore
  parent: Entity | null = null;

  @EditingSystem.ignore
  history: History;

  @EditingSystem.ignore
  isSelected = false;

  constructor(history: History) {
    this.history = history;
    history.register(this);
  }

  add(...entities: Entity[]): void {
    for (const entity of entities) {
      if (entity.parent != null) {
        entity.parent.remove(entity);
      }

      entity.parent = this;
      this.children.pushCore(entity);
    }
  }

  remove(...entities: Entity[]): void {
    for (const entity of entities) {
      const index = this.children.indexOf(entity);

      if (index !== -1) {
        entity.parent = null;
        this.children.spliceCore(index, 1);
      }
    }
  }
}
