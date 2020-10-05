import { SeObject3D } from '@/se/SeObject3D';

export interface CreateObjectUseCase {
  invoke(name: string): SeObject3D;
}
