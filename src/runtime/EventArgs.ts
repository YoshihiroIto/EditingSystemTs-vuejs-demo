export class EventArgs {}

export class UpdateEventArgs extends EventArgs {
  constructor(readonly time: number, readonly delta: number) {
    super();
  }
}
