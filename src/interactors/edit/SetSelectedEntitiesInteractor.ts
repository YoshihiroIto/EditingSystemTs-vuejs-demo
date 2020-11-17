import { dic } from '@/di/dic';
import { SetSelectedEntitiesUseCase } from '@/useCases/edit/SetSelectedEntitiesUseCase';
import { Entity } from '@/models/entity/Entity';
import { AppState } from '@/models/AppState';
import { History } from '../../../externals/EditingSystemTs/src/History';
import { BatchEditingBlock } from '@/foundations/BatchEditingBlock';
import { singleton } from 'tsyringe';
import using from '@/foundations/Using';

@singleton()
export class SetSelectedEntitiesInteractor implements SetSelectedEntitiesUseCase {
  constructor(private readonly history: History, private appState: AppState) {}

  invoke(...entities: Entity[]): void {
    console.log('A', 'SetSelectedEntitiesInteractor', this.appState.selectedEntities.length);

    using(dic().resolve(BatchEditingBlock), () => {
      this.appState.selectedEntities.spliceCore(0);
      this.appState.selectedEntities.pushCore(...entities);
    });

    console.log('B', 'SetSelectedEntitiesInteractor', this.appState.selectedEntities.length);
  }
}
