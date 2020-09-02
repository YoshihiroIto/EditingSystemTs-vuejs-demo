import { History } from '../../external/EditingSystemTs/src/History';
import { TypedEvent } from '../../external/EditingSystemTs/src/TypedEvent';
import { NotifyPropertyChanged, PropertyChangedEventArgs } from '../../external/EditingSystemTs/src/Event';

export class TestModel implements NotifyPropertyChanged {
  readonly PropertyChanged = new TypedEvent<PropertyChangedEventArgs>();

  valueA = 123;
  valueB = '';

  constructor(history: History) {
    history.register(this);
  }
}
