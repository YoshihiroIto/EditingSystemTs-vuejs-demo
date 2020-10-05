import { History } from '../../externals/EditingSystemTs/src/History';
import { SeScene } from '@/se/SeScene';
import { singleton } from 'tsyringe';

@singleton()
export class RootScene extends SeScene {
  constructor(history: History) {
    super(history);
  }
}
