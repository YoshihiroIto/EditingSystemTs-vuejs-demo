export interface GetUndoRedoCountUseCase {
  invoke(): [undo: number, redo: number];
}
