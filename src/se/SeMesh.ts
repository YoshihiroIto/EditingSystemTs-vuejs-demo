import { injectable } from 'tsyringe';
import { SeObject3D } from './SeObject3D';
import { History } from '../../externals/EditingSystemTs/src/History';

@injectable()
export class SeMesh extends SeObject3D {
  constructor(history: History) {
    super(history);
  }
}
