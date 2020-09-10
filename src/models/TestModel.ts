import { History } from '../../externals/EditingSystemTs/src/History';
import { TypedEvent } from '../../externals/EditingSystemTs/src/TypedEvent';
import { NotifyPropertyChanged, PropertyChangedEventArgs } from '../../externals/EditingSystemTs/src/Event';
import { injectable } from 'tsyringe';
import { SeObject3D } from '@/se/SeObject3D';

@injectable()
export class TestModel implements NotifyPropertyChanged {
  readonly propertyChanged = new TypedEvent<PropertyChangedEventArgs>();

  valueA = 123;
  valueB = '';
  selectedObject: SeObject3D | null = null;

  constructor(history: History) {
    history.register(this);
  }
}
