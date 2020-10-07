import { History } from '../../externals/EditingSystemTs/src/History';
import { singleton } from 'tsyringe';
import { Entity } from './entity/Entity';

@singleton()
export class RootScene extends Entity {
  constructor(history: History) {
    super(history);
  }
}
