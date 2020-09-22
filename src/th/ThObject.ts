import { Object3D } from 'three/src/core/Object3D';
import { injectable } from 'tsyringe';
import { WithThObject } from './WithThObject';

@injectable()
export class ThObject3D extends WithThObject(Object3D) {}
