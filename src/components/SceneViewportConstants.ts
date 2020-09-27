export const SceneViewportControllerModes = {
  Translate: 'translate',
  Rotate: 'rotate',
  Scale: 'scale',
} as const;

export type SceneViewportControllerMode = typeof SceneViewportControllerModes[keyof typeof SceneViewportControllerModes];

export const SceneViewportControllerSpaces = {
  World: 'world',
  Local: 'local',
} as const;

export type SceneViewportControllerSpace = typeof SceneViewportControllerSpaces[keyof typeof SceneViewportControllerSpaces];
