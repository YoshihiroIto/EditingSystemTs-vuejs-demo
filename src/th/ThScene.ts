import { Scene } from 'three/src/scenes/Scene';
import { injectable } from 'tsyringe';
import { WithThObject } from './WithThObject';

@injectable()
export class ThScene extends WithThObject(Scene) {}
