import { History } from '../../externals/EditingSystemTs/src/History';
import { TypedEvent } from '../../externals/EditingSystemTs/src/TypedEvent';
import { NotifyPropertyChanged, PropertyChangedEventArgs } from '../../externals/EditingSystemTs/src/Event';
import { container, singleton } from 'tsyringe';

@singleton()
export class Project implements NotifyPropertyChanged {
  readonly propertyChanged = new TypedEvent<PropertyChangedEventArgs>();
  readonly history = new History();

  constructor() {
    container.registerInstance(History, this.history);
  }

  register(
    target: NotifyPropertyChanged,
    {
      arrowPropertyNames = null,
      ignorePropertyNames = null,
    }: {
      arrowPropertyNames?: Set<string> | null;
      ignorePropertyNames?: Set<string> | null;
    } = {}
  ): void {
    this.history.register(target, {
      arrowPropertyNames: arrowPropertyNames,
      ignorePropertyNames: ignorePropertyNames,
    });
  }
}
