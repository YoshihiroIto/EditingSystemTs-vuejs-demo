import { SeObject3D } from '@/se/SeObject3D';
import { injectable } from 'tsyringe';

@injectable()
export class ObjectDefinition {
  constructor(readonly create: () => SeObject3D) {}
}
