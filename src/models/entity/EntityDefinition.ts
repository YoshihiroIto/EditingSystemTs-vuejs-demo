import { Vector3 } from '@/foundations/math/Vector3';
import { RenderDefinition } from './RenderDefinition';
import { ScriptDefinition } from './ScriptDefinition';

export class EntityDefinition {
  name: string;

  renderDefinition: RenderDefinition | null = null;
  scriptDefinition: ScriptDefinition | null = null;

  childTags: ChildEntityTag[] | null = null;

  constructor({
    name = 'noname',

    renderDefinition = null,
    scriptDefinition = null,

    childTags = null,
  }: Partial<{
    name: string;
    renderDefinition: RenderDefinition | null;
    scriptDefinition: ScriptDefinition | null;
    childTags: ChildEntityTag[] | null;
  }> = {}) {
    this.name = name;
    this.renderDefinition = renderDefinition;
    this.scriptDefinition = scriptDefinition;
    this.childTags = childTags;
  }
}

export class ChildEntityTag {
  definitionName: string;

  position: Vector3;
  rotation: Vector3;
  scale: Vector3;

  childTags: ChildEntityTag[] | null = null;

  constructor({
    definitionName = 'noname',

    position = Vector3.Zero,
    rotation = Vector3.Zero,
    scale = Vector3.One,

    childTags = null,
  }: Partial<{
    definitionName: string;
    position: Vector3;
    rotation: Vector3;
    scale: Vector3;
    childTags: ChildEntityTag[] | null;
  }> = {}) {
    this.definitionName = definitionName;
    this.position = position;
    this.rotation = rotation;
    this.scale = scale;
    this.childTags = childTags;
  }
}
