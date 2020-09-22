import { injectable } from 'tsyringe';
import { History } from '../../externals/EditingSystemTs/src/History';
import { TypedEvent } from '../../externals/EditingSystemTs/src/TypedEvent';
import { NotifyPropertyChanged, PropertyChangedEventArgs } from '../../externals/EditingSystemTs/src/Event';
import { SeObject3D } from '@/se/SeObject3D';
import { nameof } from '@/foundations/Nameof';

@injectable()
export class TestModel implements NotifyPropertyChanged {
  readonly propertyChanged = new TypedEvent<PropertyChangedEventArgs>();

  valueNumber = 123;
  valueString = 'ABC';
  selectedObject: SeObject3D | null = null;

  constructor(history: History) {
    history.register(this);

    this.propertyChanged.on((_: unknown, e: PropertyChangedEventArgs) => {
      if (e.propertyName === nameof<TestModel>('selectedObject')) {
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
