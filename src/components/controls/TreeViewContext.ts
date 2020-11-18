export class TreeViewContext {
  constructor(
    private readonly onSetSelectItems: (items: unknown[]) => void,
    private readonly onToggleSelectedItems: (items: unknown[]) => void,
    private readonly isSelectedAction: (item: unknown) => boolean,
    isMultiselection: boolean
  ) {
    if (isMultiselection === false) {
      throw new Error('Not impl');
    }
  }

  IsSelectedItem(item: unknown): boolean {
    return this.isSelectedAction(item);
  }

  SetSelectedItems(...items: unknown[]): void {
    this.onSetSelectItems(items);
  }

  ToggleSelectedItems(...items: unknown[]): void {
    this.onToggleSelectedItems(items);
  }
}
