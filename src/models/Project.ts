import { singleton } from 'tsyringe';
import { Entity } from './entity/Entity';
import { dic } from '@/di/dic';

@singleton()
export class Project {
  readonly rootScene = dic().resolve(Entity);
}
