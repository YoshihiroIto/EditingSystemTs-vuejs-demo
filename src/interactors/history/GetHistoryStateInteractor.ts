import { History } from '../../../externals/EditingSystemTs/src/History';
import { GetHistoryStateUseCase } from '@/useCases/history/GetHistoryStateUseCase';
import { singleton } from 'tsyringe';

@singleton()
export class GetHistoryStateInteractor implements GetHistoryStateUseCase {
  constructor(private readonly history: History) {}

  invoke(): {
    undoCount: number;
    redoCount: number;
    isInBatch: boolean;
    canUndo: boolean;
    canRedo: boolean;
    canClear: boolean;
  } {
    return {
      undoCount: this.history.undoRedoCount[0],
      redoCount: this.history.undoRedoCount[1],
      isInBatch: this.history.isInBatch,
      canUndo: this.history.canUndo,
      canRedo: this.history.canRedo,
      canClear: this.history.canClear,
    };
  }
}
