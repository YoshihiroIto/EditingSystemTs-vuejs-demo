import { Scene } from 'three/src/scenes/Scene';
import { WithThObject } from './ThObject';

class ThSceneInternal extends Scene {}

export const ThScene = WithThObject(ThSceneInternal);
