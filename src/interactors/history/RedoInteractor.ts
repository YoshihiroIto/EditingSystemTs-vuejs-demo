import { History } from '../../../externals/EditingSystemTs/src/History';
import { RedoUseCase } from '@/useCases/history/RedoUseCase';
import { singleton } from 'tsyringe';

@singleton()
export class RedoInteractor implements RedoUseCase {
  constructor(private readonly history: History) {}

  invoke(): void {
    this.history.redo();
  }
}
