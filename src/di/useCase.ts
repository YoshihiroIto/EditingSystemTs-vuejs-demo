const UseCase = {
  // history
  undo: Symbol(),
  redo: Symbol(),
  clearHistory: Symbol(),
  beginBatchEditing: Symbol(),
  endBatchEditing: Symbol(),
  beginPauseEditing: Symbol(),
  endPauseEditing: Symbol(),
  getEditedUseCase: Symbol(),
  getHistoryState: Symbol(),

  // project
  createEntity: Symbol(),
};

export { UseCase };
