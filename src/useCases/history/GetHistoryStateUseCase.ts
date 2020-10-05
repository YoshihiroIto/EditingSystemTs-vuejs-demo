export interface GetHistoryStateUseCase {
  invoke(): [undo: number, redo: number];
}
