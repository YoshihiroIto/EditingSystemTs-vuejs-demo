import { ref, Ref } from '@vue/composition-api';

export class TreeViewContext {
  private selectedItem: Ref<unknown>;

  constructor(
    private readonly onSelectItem: (selectedItem: unknown) => void,
    selectedItem: unknown | null,
    private readonly isSelectedAction: ((item: unknown) => boolean) | null
  ) {
    this.selectedItem = ref(selectedItem);
  }

  IsSelectedItem(item: unknown): boolean {
    return this.isSelectedAction != null ? this.isSelectedAction(item) : this.selectedItem.value === item;
  }

  SetSelectItem(item: unknown): void {
    this.selectedItem.value = item;
  }

  SelectItem(item: unknown): void {
    if (this.selectedItem.value === item) {
      return;
    }

    this.onSelectItem(item);
    this.SetSelectItem(item);
  }

  ToggleSelectItem(item: unknown): void {
    this.SelectItem(this.selectedItem.value === item ? null : item);
  }
}
