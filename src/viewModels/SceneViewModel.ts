import { Entity } from '@/models/entity/Entity';
import { ThScene } from '@/th/ThScene';
import { onUnmounted } from '@vue/composition-api';
import { Color } from 'three/src/math/Color';
import { injectable } from 'tsyringe';
import { dic } from '@/di/dic';

@injectable()
export class SceneViewModel extends ThScene {
  constructor() {
    super();

    this.background = new Color(0x24292e);
  }

  static create(model: Entity): SceneViewModel {
    const viewModel = dic().resolve(SceneViewModel);
    viewModel.setup(model);

    onUnmounted(() => {
      viewModel.dispose();
    });

    return viewModel;
  }
}
