import { History } from '../../externals/EditingSystemTs/src/History';
import { TypedEvent } from '../../externals/EditingSystemTs/src/TypedEvent';
import {
  NotifyCollectionChangedActions,
  NotifyCollectionChangedEventArgs,
  NotifyPropertyChanged,
  PropertyChangedEventArgs,
} from '../../externals/EditingSystemTs/src/Event';
import { singleton } from 'tsyringe';
import { nameof } from '@/foundations/Nameof';
import { Entity } from './entity/Entity';
import { EditingSystem } from '../../externals/EditingSystemTs/src/Decorators';
import { Previewer } from './Previewer';
import { Project } from './Project';
import { EntityCreator } from './entity/EntityCreator';
import { Assert } from '../../externals/EditingSystemTs/src/Assert';
import { dic } from '@/di/dic';
import { ObservableArray } from '../../externals/EditingSystemTs/src/ObservableArray';

@singleton()
export class AppState implements NotifyPropertyChanged {
  readonly propertyChanged = new TypedEvent<PropertyChangedEventArgs>();

  selectedEntity: Entity | null = null;

  readonly selectedEntities = new ObservableArray<Entity>();

  @EditingSystem.ignore
  isInPreview = false;

  @EditingSystem.ignore
  previewer: Previewer | null = null;

  constructor(private readonly history: History, project: Project, entityCreator: EntityCreator) {
    this.history.register(this);

    this.setupPropertyChanged(project, entityCreator);

    this.setupSelectedEntities();
  }

  private setupPropertyChanged(project: Project, entityCreator: EntityCreator) {
    this.propertyChanged.on((_: unknown, e: PropertyChangedEventArgs) => {
      switch (e.propertyName) {
        case nameof<AppState>('isInPreview'):
          {
            if (this.isInPreview) {
              Assert.isNull(this.previewer);
              this.previewer = dic().resolve(Previewer);
              this.previewer.setup(project, entityCreator.entityDefinitions);
            } else {
              Assert.isNotNull(this.previewer);
              this.previewer.dispose();
              this.previewer = null;
            }
          }
          break;
      }
    });
  }

  private setupSelectedEntities(): void {
    this.selectedEntities.collectionChanged.on((_: unknown, e: NotifyCollectionChangedEventArgs) => {
      switch (e.action) {
        case NotifyCollectionChangedActions.Add:
          {
            const newEntities = e.newItems as Entity[];

            for (const entity of newEntities) {
              entity.isSelected = true;
            }

            this.selectedEntity = newEntities[0];
          }
          break;

        case NotifyCollectionChangedActions.Remove:
          {
            const oldEntities = e.oldItems as Entity[];

            for (const entity of oldEntities) {
              entity.isSelected = false;
            }

            if (this.selectedEntity !== null) {
              if (this.selectedEntities.indexOf(this.selectedEntity) === -1) {
                this.selectedEntity =
                  this.selectedEntities.length > 0 ? this.selectedEntities[this.selectedEntities.length - 1] : null;
              }
            }
          }

          break;

        default:
          throw new Error('this.selectedEntities.collectionChanged');
      }
    });
  }
}
