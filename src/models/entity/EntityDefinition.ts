import { Vector3 } from '@/foundations/math/Vector3';
import { RenderDefinition } from './RenderDefinition';
import { ScriptDefinition } from './ScriptDefinition';

export class EntityDefinition {
  name: string;

  renderDefinition: RenderDefinition | null = null;
  scriptDefinition: ScriptDefinition | null = null;

  children: ChildEntityTag[] | null = null;

  constructor({
    name = 'noname',

    renderDefinition = null,
    scriptDefinition = null,

    children: children = null,
  }: Partial<{
    name: string;
    renderDefinition: RenderDefinition | null;
    scriptDefinition: ScriptDefinition | null;
    children: ChildEntityTag[] | null;
  }> = {}) {
    this.name = name;
    this.renderDefinition = renderDefinition;
    this.scriptDefinition = scriptDefinition;
    this.children = children;
  }

  toJSON(): unknown {
    return {
      name: this.name,
      renderDefinition: this.renderDefinition,
      scriptDefinition: this.scriptDefinition,
      children: this.children,
    };
  }
}

export class ChildEntityTag {
  definition: string;

  position: Vector3;
  rotation: Vector3;
  scale: Vector3;

  children: ChildEntityTag[] | null = null;

  constructor({
    definition = 'noname',

    position = Vector3.Zero,
    rotation = Vector3.Zero,
    scale = Vector3.One,

    children: children = null,
  }: Partial<{
    definition: string;
    position: Vector3;
    rotation: Vector3;
    scale: Vector3;
    children: ChildEntityTag[] | null;
  }> = {}) {
    this.definition = definition;
    this.position = position;
    this.rotation = rotation;
    this.scale = scale;
    this.children = children;
  }

  toJSON(): unknown {
    return {
      definition: this.definition,
      position: this.position,
      rotation: this.rotation,
      scale: this.scale,
      children: this.children,
    };
  }
}
