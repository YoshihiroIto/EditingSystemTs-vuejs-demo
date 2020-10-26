import { History } from '../../externals/EditingSystemTs/src/History';
import { TypedEvent } from '../../externals/EditingSystemTs/src/TypedEvent';
import { NotifyPropertyChanged, PropertyChangedEventArgs } from '../../externals/EditingSystemTs/src/Event';
import { singleton } from 'tsyringe';
import { nameof } from '@/foundations/Nameof';
import { Entity } from './entity/Entity';
import { EditingSystem } from '../../externals/EditingSystemTs/src/Decorators';
import { Previewer } from './Previewer';
import { Project } from './Project';
import { EntityCreator } from './entity/EntityCreator';

@singleton()
export class AppState implements NotifyPropertyChanged {
  readonly propertyChanged = new TypedEvent<PropertyChangedEventArgs>();

  selectedEntity: Entity | null = null;

  @EditingSystem.ignore
  isInPreview = false;

  constructor(private readonly history: History, project: Project, readonly entityCreator: EntityCreator) {
    this.history.register(this);

    this.propertyChanged.on((_: unknown, e: PropertyChangedEventArgs) => {
      console.log(e.propertyName);

      switch (e.propertyName) {
        //////////////////////////////////////////////////////////////////
        case nameof<AppState>('selectedEntity'):
          {
            const old = e.oldValue as Entity | null;

            if (old != null) {
              old.isSelected = false;
            }

            if (this.selectedEntity != null) {
              this.selectedEntity.isSelected = true;
            }
          }
          break;

        //////////////////////////////////////////////////////////////////
        case nameof<AppState>('isInPreview'):
          {
            console.log(this.isInPreview);

            const previewer = new Previewer(project, entityCreator.entityDefinitions);
          }
          break;
      }
    });
  }
}
