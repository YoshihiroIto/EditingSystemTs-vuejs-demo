export class SeVector3 {
  static readonly Zero = new SeVector3(0, 0, 0);
  static readonly One = new SeVector3(1, 1, 1);

  constructor(readonly x: number, readonly y: number, readonly z: number) {}
}
