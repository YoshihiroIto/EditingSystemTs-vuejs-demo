export interface GetHistoryStateUseCase {
  invoke(): {
    undoCount: number;
    redoCount: number;
    isInBatch: boolean;
    canUndo: boolean;
    canRedo: boolean;
    canClear: boolean;
  };
}
