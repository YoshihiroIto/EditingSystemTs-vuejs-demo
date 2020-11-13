const UseCase = {
  // history
  undo: Symbol(),
  redo: Symbol(),
  clearHistory: Symbol(),
  beginBatchEditing: Symbol(),
  endBatchEditing: Symbol(),
  beginPauseEditing: Symbol(),
  endPauseEditing: Symbol(),
  getEdited: Symbol(),
  getHistoryState: Symbol(),

  // edit
  setSelectedEntities: Symbol(),
  addSelectedEntities: Symbol(),
  removeSelectedEntities: Symbol(),

  // project
  createEntity: Symbol(),
};

export { UseCase };
