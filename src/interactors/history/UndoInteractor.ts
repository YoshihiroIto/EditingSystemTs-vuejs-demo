import { History } from '../../../externals/EditingSystemTs/src/History';
import { UndoUseCase } from '@/useCases/history/UndoUseCase';
import { singleton } from 'tsyringe';

@singleton()
export class UndoInteractor implements UndoUseCase {
  constructor(private readonly history: History) {}

  invoke(): void {
    this.history.undo();
  }
}
