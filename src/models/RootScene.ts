import { History } from '../../externals/EditingSystemTs/src/History';
import { SeScene } from '@/se/SeScene';
import { injectable } from 'tsyringe';

@injectable()
export class RootScene extends SeScene {
  constructor(history: History) {
    super(history);
  }
}
