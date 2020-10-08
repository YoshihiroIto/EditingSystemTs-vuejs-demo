import { Vector3 } from '@/foundations/math/Vector3';
import { RenderDefinition } from './RenderDefinition';
import { ScriptDefinition } from './ScriptDefinition';

export class EntityDefinition {
  name = 'noname';

  position = Vector3.Zero;
  rotation = Vector3.Zero;
  scale = Vector3.One;

  renderDefinition: RenderDefinition | null = null;
  scriptDefinition: ScriptDefinition | null = null;

  children: Array<EntityDefinition> | null = null;

  constructor({
    name = 'noname',
    renderDefinition = null,
    scriptDefinition = null,
  }: Partial<{
    name: string;
    renderDefinition: RenderDefinition | null;
    scriptDefinition: ScriptDefinition | null;
  }> = {}) {
    this.name = name;
    this.renderDefinition = renderDefinition;
    this.scriptDefinition = scriptDefinition;
  }
}
