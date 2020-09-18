import { injectable } from 'tsyringe';
import { History } from '../../externals/EditingSystemTs/src/History';
import { TypedEvent } from '../../externals/EditingSystemTs/src/TypedEvent';
import { NotifyPropertyChanged, PropertyChangedEventArgs } from '../../externals/EditingSystemTs/src/Event';
import { SeObject3D } from '@/se/SeObject3D';

@injectable()
export class TestModel implements NotifyPropertyChanged {
  readonly propertyChanged = new TypedEvent<PropertyChangedEventArgs>();

  valueNumber = 123;
  valueString = 'ABC';
  selectedObject: SeObject3D | null = null;

  constructor(history: History) {
    history.register(this);
  }
}
