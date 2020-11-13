import { container } from 'tsyringe';
import { History } from '../../externals/EditingSystemTs/src/History';
import { UndoInteractor } from '../interactors/history/UndoInteractor';
import { RedoInteractor } from '../interactors/history/RedoInteractor';
import { ClearHistoryInteractor } from '../interactors/history/ClearHistoryInteractor';
import { BeginBatchEditingInteractor } from '../interactors/history/BeginBatchEditingInteractor';
import { BeginPauseEditingInteractor } from '../interactors/history/BeginPauseEditingInteractor';
import { EndBatchEditingInteractor } from '../interactors/history/EndBatchEditingInteractor';
import { EndPauseEditingInteractor } from '../interactors/history/EndPauseEditingInteractor';
import { GetEditedInteractor } from '../interactors/history/GetEditedInteractor';
import { GetHistoryStateInteractor } from '../interactors/history/GetHistoryStateInteractor';
import { CreateEntityInteractor } from '../interactors/project/CreateEntityInteractor';
import { SetSelectedEntitiesInteractor } from '../interactors/edit/SetSelectedEntitiesInteractor';
import { UseCase } from './useCase';

export default function setupDi(): void {
  // history
  container.register(UseCase.undo, { useClass: UndoInteractor });
  container.register(UseCase.redo, { useClass: RedoInteractor });
  container.register(UseCase.clearHistory, { useClass: ClearHistoryInteractor });
  container.register(UseCase.beginBatchEditing, { useClass: BeginBatchEditingInteractor });
  container.register(UseCase.endBatchEditing, { useClass: EndBatchEditingInteractor });
  container.register(UseCase.beginPauseEditing, { useClass: BeginPauseEditingInteractor });
  container.register(UseCase.endPauseEditing, { useClass: EndPauseEditingInteractor });
  container.register(UseCase.getEdited, { useClass: GetEditedInteractor });
  container.register(UseCase.getHistoryState, { useClass: GetHistoryStateInteractor });
  container.registerInstance(History, new History());

  // edit
  container.register(UseCase.setSelectedEntities, { useClass: SetSelectedEntitiesInteractor });

  // project -- @scoped(Lifecycle.ContainerScoped)
  container.register(UseCase.createEntity, { useClass: CreateEntityInteractor });
}
