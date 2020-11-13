import { dic } from '@/di/dic';
import { RemoveSelectedEntitiesUseCase } from '@/useCases/edit/RemoveSelectedEntitiesUseCase';
import { Entity } from '@/models/entity/Entity';
import { AppState } from '@/models/AppState';
import { History } from '../../../externals/EditingSystemTs/src/History';
import { BatchEditingBlock } from '@/foundations/BatchEditingBlock';
import { singleton } from 'tsyringe';
import using from '@/foundations/Using';

@singleton()
export class RemoveSelectedEntitiesInteractor implements RemoveSelectedEntitiesUseCase {
  constructor(private readonly history: History, private appState: AppState) {}

  invoke(...entities: Entity[]): void {
    using(dic().resolve(BatchEditingBlock), () => {
      for (const entity of entities) {
        const index = this.appState.selectedEntities.indexOf(entity, 0);
        if (index === -1) {
          continue;
        }

        this.appState.selectedEntities.spliceCore(index, 1);
      }
    });
  }
}
