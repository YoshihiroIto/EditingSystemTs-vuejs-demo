export class SeVector3 {
  static readonly Zero = new SeVector3(0, 0, 0);
  static readonly One = new SeVector3(1, 1, 1);

  constructor(public readonly x: number, public readonly y: number, public readonly z: number) {}
}
