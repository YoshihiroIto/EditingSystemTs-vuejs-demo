import { History } from '../../externals/EditingSystemTs/src/History';
import { TypedEvent } from '../../externals/EditingSystemTs/src/TypedEvent';
import { NotifyPropertyChanged, PropertyChangedEventArgs } from '../../externals/EditingSystemTs/src/Event';
import { singleton } from 'tsyringe';
import { nameof } from '@/foundations/Nameof';
import { SeObject3D } from '@/se/SeObject3D';

@singleton()
export class Project implements NotifyPropertyChanged {
  readonly propertyChanged = new TypedEvent<PropertyChangedEventArgs>();

  selectedObject: SeObject3D | null = null;

  constructor(private readonly history: History) {
    this.history.register(this);

    this.propertyChanged.on((_: unknown, e: PropertyChangedEventArgs) => {
      if (e.propertyName === nameof<Project>('selectedObject')) {
        const old = e.oldValue as SeObject3D | null;

        if (old != null) {
          old.isSelected = false;
        }

        if (this.selectedObject != null) {
          this.selectedObject.isSelected = true;
        }
      }
    });
  }
}
