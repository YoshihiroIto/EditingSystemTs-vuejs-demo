import { NotifyPropertyChanged, PropertyChangedEventArgs } from '../../../externals/EditingSystemTs/src/Event';
import { TypedEvent } from '../../../externals/EditingSystemTs/src/TypedEvent';
import { History } from '../../../externals/EditingSystemTs/src/History';
import { BufferGeometry, Geometry, Material, Mesh } from 'three';
import { injectable } from 'tsyringe';

@injectable()
export class SeMesh<
    TGeometry extends Geometry | BufferGeometry = Geometry | BufferGeometry,
    TMaterial extends Material | Material[] = Material | Material[]
  >
  extends Mesh<TGeometry, TMaterial>
  implements NotifyPropertyChanged {
  readonly propertyChanged = new TypedEvent<PropertyChangedEventArgs>();

  constructor(history: History) {
    super();

    history.register(this, { arrowPropertyNames: new Set<string>(['']) });
  }
}
