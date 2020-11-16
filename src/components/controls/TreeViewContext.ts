import { ref, Ref } from '@vue/composition-api';

export class TreeViewContext {
  private selectedItem: Ref<unknown>;

  constructor(private readonly onSelectItem: (selectedItem: unknown) => void, selectedItem: unknown) {
    this.selectedItem = ref(selectedItem);
  }

  IsSelectedItem(item: unknown): boolean {
    return this.selectedItem.value === item;
  }

  SelectItem(item: unknown): void {
    if (this.selectedItem.value === item) {
      return;
    }

    this.onSelectItem(item);

    this.selectedItem.value = item;
  }

  ToggleSelectItem(item: unknown): void {
    this.SelectItem(this.selectedItem.value === item ? null : item);
  }
}
