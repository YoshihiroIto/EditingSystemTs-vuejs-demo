import { container } from 'tsyringe';
import { History } from '../externals/EditingSystemTs/src/History';
import { UndoInteractor } from './interactors/history/UndoInteractor';
import { RedoInteractor } from './interactors/history/RedoInteractor';
import { ClearHistoryInteractor } from './interactors/history/ClearHistoryInteractor';
import { BeginBatchEditingInteractor } from './interactors/history/BeginBatchEditingInteractor';
import { BeginPauseEditingInteractor } from './interactors/history/BeginPauseEditingInteractor';
import { EndBatchEditingInteractor } from './interactors/history/EndBatchEditingInteractor';
import { EndPauseEditingInteractor } from './interactors/history/EndPauseEditingInteractor';
import { GetEditedInteractor } from './interactors/history/GetEditedInteractor';
import { GetUndoRedoCountInteractor } from './interactors/history/GetUndoRedoCountInteractor';

const UseCase = {
  undo: Symbol(),
  redo: Symbol(),
  clearHistory: Symbol(),
  beginBatchEditing: Symbol(),
  endBatchEditing: Symbol(),
  beginPauseEditing: Symbol(),
  endPauseEditing: Symbol(),
  getEditedUseCase: Symbol(),
  getUndoRedoCount: Symbol(),
};

export { UseCase };

export default function setupDi(): void {
  container.register(UseCase.undo, { useClass: UndoInteractor });
  container.register(UseCase.redo, { useClass: RedoInteractor });
  container.register(UseCase.clearHistory, { useClass: ClearHistoryInteractor });
  container.register(UseCase.beginBatchEditing, { useClass: BeginBatchEditingInteractor });
  container.register(UseCase.endBatchEditing, { useClass: EndBatchEditingInteractor });
  container.register(UseCase.beginPauseEditing, { useClass: BeginPauseEditingInteractor });
  container.register(UseCase.endPauseEditing, { useClass: EndPauseEditingInteractor });
  container.register(UseCase.getEditedUseCase, { useClass: GetEditedInteractor });
  container.register(UseCase.getUndoRedoCount, { useClass: GetUndoRedoCountInteractor });

  container.registerInstance(History, new History());
}
