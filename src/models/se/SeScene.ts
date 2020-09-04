import { NotifyPropertyChanged, PropertyChangedEventArgs } from '../../../externals/EditingSystemTs/src/Event';
import { TypedEvent } from '../../../externals/EditingSystemTs/src/TypedEvent';
import { History } from '../../../externals/EditingSystemTs/src/History';
import { Scene } from 'three';
import { injectable } from 'tsyringe';

@injectable()
export class SeScene extends Scene implements NotifyPropertyChanged {
  readonly propertyChanged = new TypedEvent<PropertyChangedEventArgs>();

  constructor(protected readonly history: History) {
    super();

    history.register(this, { arrowPropertyNames: new Set<string>(['']) });
  }
}
