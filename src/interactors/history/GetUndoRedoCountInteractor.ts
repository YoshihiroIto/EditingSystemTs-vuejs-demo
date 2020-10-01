import { History } from '../../../externals/EditingSystemTs/src/History';
import { GetUndoRedoCountUseCase } from '@/useCases/history/GetUndoRedoCountUseCase';
import { singleton } from 'tsyringe';

@singleton()
export class GetUndoRedoCountInteractor implements GetUndoRedoCountUseCase {
  constructor(private readonly history: History) {}

  invoke(): [undo: number, redo: number] {
    return this.history.undoRedoCount;
  }
}
