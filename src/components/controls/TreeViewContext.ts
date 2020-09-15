import { ref, Ref, SetupContext } from '@vue/composition-api';

export class TreeViewContext {
  private selectedItem: Ref<unknown>;

  constructor(private readonly context: SetupContext, selectedItem: unknown) {
    this.selectedItem = ref(selectedItem);
  }

  IsSelectedItem(item: unknown): boolean {
    return this.selectedItem.value === item;
  }

  SelectItem(item: unknown): void {
    if (this.selectedItem.value === item) {
      return;
    }

    this.context.emit('selectItem', item);
    this.selectedItem.value = item;
  }

  ToggleSelectItem(item: unknown): void {
    this.SelectItem(this.selectedItem.value === item ? null : item);
  }
}
