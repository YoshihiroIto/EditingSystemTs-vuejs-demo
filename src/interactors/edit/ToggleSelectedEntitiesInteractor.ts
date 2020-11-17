import { dic } from '@/di/dic';
import { ToggleSelectedEntitiesUseCase } from '@/useCases/edit/ToggleSelectedEntitiesUseCase';
import { Entity } from '@/models/entity/Entity';
import { AppState } from '@/models/AppState';
import { History } from '../../../externals/EditingSystemTs/src/History';
import { BatchEditingBlock } from '@/foundations/BatchEditingBlock';
import { singleton } from 'tsyringe';
import using from '@/foundations/Using';

@singleton()
export class ToggleSelectedEntitiesInteractor implements ToggleSelectedEntitiesUseCase {
  constructor(private readonly history: History, private appState: AppState) {}

  invoke(...entities: Entity[]): void {
    using(dic().resolve(BatchEditingBlock), () => {
      console.log('A', 'ToggleSelectedEntitiesInteractor', this.appState.selectedEntities.length);

      for (const entity of entities) {
        const index = this.appState.selectedEntities.indexOf(entity);

        if (index === -1) {
          this.appState.selectedEntities.pushCore(entity);
        } else {
          this.appState.selectedEntities.spliceCore(index, 1);
        }
      }

      console.log('B', 'ToggleSelectedEntitiesInteractor', this.appState.selectedEntities.length);
    });
  }
}
