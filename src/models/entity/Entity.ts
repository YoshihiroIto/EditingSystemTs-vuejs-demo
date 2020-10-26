import { injectable } from 'tsyringe';
import { Vector3 } from '../../foundations/math/Vector3';
import { NotifyPropertyChanged, PropertyChangedEventArgs } from '../../../externals/EditingSystemTs/src/Event';
import { History } from '../../../externals/EditingSystemTs/src/History';
import { TypedEvent } from '../../../externals/EditingSystemTs/src/TypedEvent';
import { ObservableArray } from '../../../externals/EditingSystemTs/src/ObservableArray';
import { EditingSystem } from '../../../externals/EditingSystemTs/src/Decorators';
import { EntityDefinition } from './EntityDefinition';

@injectable()
export class Entity implements NotifyPropertyChanged {
  readonly propertyChanged = new TypedEvent<PropertyChangedEventArgs>();
  readonly children = new ObservableArray<Entity>();
  readonly ownChildren = new ObservableArray<Entity>();

  name = '';

  position = Vector3.Zero;
  rotation = Vector3.Zero;
  scale = Vector3.One;

  @EditingSystem.ignore
  isSelected = false;

  @EditingSystem.ignore
  definition: Readonly<EntityDefinition> | null = null;

  @EditingSystem.ignore
  private isOwner = false;

  @EditingSystem.ignore
  private parent: Entity | null = null;

  get hasChildren(): boolean {
    return this.children.length > 0 || this.ownChildren.length > 0;
  }

  get owner(): Entity {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    let entity: Entity | null = this;

    while (entity.isOwner === false) {
      entity = entity.parent;
      if (entity === null) {
        throw new Error();
      }
    }

    return entity;
  }

  *allChildren(): Generator<Entity, void, undefined> {
    yield* this.children;
    yield* this.ownChildren;
  }

  makeAllChildren(): Entity[] {
    return this.children.concat(this.ownChildren);
  }

  constructor(history: History) {
    history.register(this);
  }

  setup(isOwner: boolean, definition: Readonly<EntityDefinition>): void {
    this.isOwner = isOwner;
    this.definition = definition;
  }

  add(...entities: Entity[]): void {
    this.addInternal(this.children, entities);
  }

  remove(...entities: Entity[]): void {
    this.removeInternal(this.children, entities);
  }

  addToOwn(...entities: Entity[]): void {
    this.addInternal(this.ownChildren, entities);
  }

  removeFromOwn(...entities: Entity[]): void {
    this.removeInternal(this.ownChildren, entities);
  }

  private addInternal(target: ObservableArray<Entity>, entities: Entity[]): void {
    for (const entity of entities) {
      if (entity.parent != null) {
        entity.parent.remove(entity);
      }

      entity.parent = this;
      target.pushCore(entity);
    }
  }

  private removeInternal(target: ObservableArray<Entity>, entities: Entity[]): void {
    for (const entity of entities) {
      const index = this.children.indexOf(entity);

      if (index !== -1) {
        entity.parent = null;
        target.spliceCore(index, 1);
      }
    }
  }

  toJSON(): unknown {
    return {
      name: this.name,
      position: this.position,
      rotation: this.rotation,
      scale: this.scale,
      definition: this.definition?.name,
      children: this.children,
    };
  }
}
