import { Ref, SetupContext } from '@vue/composition-api';

export class TreeViewContext {
  constructor(private readonly context: SetupContext) {}

  selectedTreeViewItemContext: TreeViewItemContext | null = null;

  SelectItem(item: unknown, treeViewItemContext: TreeViewItemContext): void {
    this.selectedTreeViewItemContext?.Unselect();

    this.context.emit('selectedItem', item);

    this.selectedTreeViewItemContext = treeViewItemContext;
    this.selectedTreeViewItemContext?.Select();
  }

  UnselectItem(treeViewItemContext: TreeViewItemContext): void {
    if (this.selectedTreeViewItemContext == null) {
      return;
    }

    if (this.selectedTreeViewItemContext.isSelected !== treeViewItemContext.isSelected) {
      return;
    }

    this.selectedTreeViewItemContext?.Unselect();

    this.context.emit('selectedItem', null);

    this.selectedTreeViewItemContext = null;
  }

  ToggleSelectItem(item: unknown, treeViewItemContext: TreeViewItemContext): void {
    if (treeViewItemContext.isSelected.value === false) {
      this.SelectItem(item, treeViewItemContext);
    } else {
      this.UnselectItem(treeViewItemContext);
    }
  }
}

export class TreeViewItemContext {
  constructor(public readonly isSelected: Ref<boolean>) {}

  Select(): void {
    this.isSelected.value = true;
  }

  Unselect(): void {
    this.isSelected.value = false;
  }
}
