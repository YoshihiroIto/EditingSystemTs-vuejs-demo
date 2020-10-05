import { History } from '../../../externals/EditingSystemTs/src/History';
import { GetHistoryStateUseCase } from '@/useCases/history/GetHistoryStateUseCase';
import { singleton } from 'tsyringe';

@singleton()
export class GetHistoryStateInteractor implements GetHistoryStateUseCase {
  constructor(private readonly history: History) {}

  invoke(): { undoCount: number; redoCount: number; isInBatch: boolean } {
    return {
      undoCount: this.history.undoRedoCount[0],
      redoCount: this.history.undoRedoCount[1],
      isInBatch: this.history.isInBatch,
    };
  }
}
