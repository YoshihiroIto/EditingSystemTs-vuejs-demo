import { dic } from '@/di/dic';
import { AddSelectedEntitiesUseCase } from '@/useCases/edit/AddSelectedEntitiesUseCase';
import { Entity } from '@/models/entity/Entity';
import { AppState } from '@/models/AppState';
import { History } from '../../../externals/EditingSystemTs/src/History';
import { BatchEditingBlock } from '@/foundations/BatchEditingBlock';
import { singleton } from 'tsyringe';
import using from '@/foundations/Using';

@singleton()
export class AddSelectedEntitiesInteractor implements AddSelectedEntitiesUseCase {
  constructor(private readonly history: History, private appState: AppState) {}

  invoke(...entities: Entity[]): void {
    using(dic().resolve(BatchEditingBlock), () => {
      this.appState.selectedEntities.pushCore(...entities);
    });
  }
}
