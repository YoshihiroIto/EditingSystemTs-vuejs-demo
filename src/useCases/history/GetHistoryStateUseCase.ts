export interface GetHistoryStateUseCase {
  invoke(): { undoCount: number; redoCount: number; isInBatch: boolean };
}
