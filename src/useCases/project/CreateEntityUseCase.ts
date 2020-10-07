import { SeObject3D } from '@/se/SeObject3D';

export interface CreateEntityUseCase {
  invoke(name: string): SeObject3D;
}
