import { History } from '../../../externals/EditingSystemTs/src/History';
import { GetHistoryStateUseCase } from '@/useCases/history/GetHistoryStateUseCase';
import { singleton } from 'tsyringe';

@singleton()
export class GetHistoryStateInteractor implements GetHistoryStateUseCase {
  constructor(private readonly history: History) {}

  invoke(): [undo: number, redo: number] {
    return this.history.undoRedoCount;
  }
}
