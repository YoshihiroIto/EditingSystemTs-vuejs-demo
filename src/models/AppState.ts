import { History } from '../../externals/EditingSystemTs/src/History';
import { TypedEvent } from '../../externals/EditingSystemTs/src/TypedEvent';
import { NotifyPropertyChanged, PropertyChangedEventArgs } from '../../externals/EditingSystemTs/src/Event';
import { singleton } from 'tsyringe';
import { nameof } from '@/foundations/Nameof';
import { Entity } from './entity/Entity';

@singleton()
export class AppState implements NotifyPropertyChanged {
  readonly propertyChanged = new TypedEvent<PropertyChangedEventArgs>();

  selectedEntity: Entity | null = null;

  constructor(private readonly history: History) {
    this.history.register(this);

    this.propertyChanged.on((_: unknown, e: PropertyChangedEventArgs) => {
      if (e.propertyName === nameof<AppState>('selectedEntity')) {
        const old = e.oldValue as Entity | null;

        if (old != null) {
          old.isSelected = false;
        }

        if (this.selectedEntity != null) {
          this.selectedEntity.isSelected = true;
        }
      }
    });
  }
}
