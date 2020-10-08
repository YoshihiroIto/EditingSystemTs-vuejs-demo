export class RenderDefinition {
  meshType: MeshType;

  constructor({ meshType = MeshTypes.Unset }: Partial<{ meshType: MeshType }> = {}) {
    this.meshType = meshType;
  }
}

export const MeshTypes = {
  Unset: 'unset',
  //
  Box: 'box',
  Point: 'point',
  //
  Data: 'data',
} as const;

export type MeshType = typeof MeshTypes[keyof typeof MeshTypes];
