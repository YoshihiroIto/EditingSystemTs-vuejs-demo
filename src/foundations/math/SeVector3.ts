export class Vector3 {
  static readonly Zero = new Vector3(0, 0, 0);
  static readonly One = new Vector3(1, 1, 1);

  constructor(readonly x: number, readonly y: number, readonly z: number) {}
}
