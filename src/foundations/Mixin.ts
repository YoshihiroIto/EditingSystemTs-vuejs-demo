// eslint-disable-next-line @typescript-eslint/ban-types
export type Constructor<T = {}> =
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  new (...args: any[]) => T;
