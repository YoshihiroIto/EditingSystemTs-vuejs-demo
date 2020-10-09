import { Vector3 } from '@/foundations/math/Vector3';
import { RenderDefinition } from './RenderDefinition';
import { ScriptDefinition } from './ScriptDefinition';

export class EntityDefinition {
  name: string;

  renderDefinition: RenderDefinition | null = null;
  scriptDefinition: ScriptDefinition | null = null;

  children: ChildEntity[] | null = null;

  constructor({
    name = 'noname',

    renderDefinition = null,
    scriptDefinition = null,

    children = null,
  }: Partial<{
    name: string;
    renderDefinition: RenderDefinition | null;
    scriptDefinition: ScriptDefinition | null;
    children: ChildEntity[] | null;
  }> = {}) {
    this.name = name;
    this.renderDefinition = renderDefinition;
    this.scriptDefinition = scriptDefinition;
    this.children = children;
  }
}

export class ChildEntity {
  name: string;

  position: Vector3;
  rotation: Vector3;
  scale: Vector3;

  children: ChildEntity[] | null = null;

  constructor({
    name = 'noname',

    position = Vector3.Zero,
    rotation = Vector3.Zero,
    scale = Vector3.One,

    children = null,
  }: Partial<{
    name: string;
    position: Vector3;
    rotation: Vector3;
    scale: Vector3;
    children: ChildEntity[] | null;
  }> = {}) {
    this.name = name;
    this.position = position;
    this.rotation = rotation;
    this.scale = scale;
    this.children = children;
  }
}
