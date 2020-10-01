import { container } from 'tsyringe';
import { Project } from './models/Project';
import { History } from '../externals/EditingSystemTs/src/History';
import { UndoInteractor } from './interactors/history/UndoInteractor';
import { RedoInteractor } from './interactors/history/RedoInteractor';
import { ClearHistoryInteractor } from './interactors/history/ClearHistoryInteractor';

const UseCase = {
  undo: Symbol(),
  redo: Symbol(),
  clearHistory: Symbol(),
};

export { UseCase };

export default function setupDi(): void {
  container.register(UseCase.undo, { useClass: UndoInteractor });
  container.register(UseCase.redo, { useClass: RedoInteractor });
  container.register(UseCase.clearHistory, { useClass: ClearHistoryInteractor });

  container.registerInstance(History, container.resolve(Project).history);
}
