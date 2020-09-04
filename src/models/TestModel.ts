import { History } from '../../externals/EditingSystemTs/src/History';
import { TypedEvent } from '../../externals/EditingSystemTs/src/TypedEvent';
import { NotifyPropertyChanged, PropertyChangedEventArgs } from '../../externals/EditingSystemTs/src/Event';
import { injectable } from 'tsyringe';

@injectable()
export class TestModel implements NotifyPropertyChanged {
  readonly propertyChanged = new TypedEvent<PropertyChangedEventArgs>();

  valueA = 123;
  valueB = '';

  constructor(history: History) {
    history.register(this);
  }
}
