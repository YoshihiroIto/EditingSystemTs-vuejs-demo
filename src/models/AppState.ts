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
import { BatchEditingBlock } from '@/foundations/BatchEditingBlock';
import using from '@/foundations/Using';

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
        //////////////////////////////////////////////////////////////////
        case nameof<AppState>('selectedEntity'):
          {
            using(dic().resolve(BatchEditingBlock), () => {
              const old = e.oldValue as Entity | null;

              if (old != null) {
                old.isSelected = false;
              }

              if (this.selectedEntity != null) {
                this.selectedEntity.isSelected = true;
              }
            });
          }
          break;

        //////////////////////////////////////////////////////////////////
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
          this.selectedEntity = (e.newItems as Entity[])[0];

          break;

        case NotifyCollectionChangedActions.Remove:
          break;

        default:
          throw new Error('this.selectedEntities.collectionChanged');
      }
    });
  }
}
