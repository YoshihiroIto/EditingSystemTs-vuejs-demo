import { RootScene } from '@/models/RootScene';
import { ThScene } from '@/th/ThScene';
import { onUnmounted } from '@vue/composition-api';
import { Color } from 'three/src/math/Color';
import { container, injectable } from 'tsyringe';

@injectable()
export class RootSceneViewModel extends ThScene {
  constructor() {
    super();

    this.background = new Color(0x24292e);
  }

  static create(model: RootScene): RootSceneViewModel {
    const viewModel = container.resolve(RootSceneViewModel);
    viewModel.setup(model);

    onUnmounted(() => {
      viewModel.dispose();
    });

    return viewModel;
  }
}
