import { UseCase } from '@/di/useCase';
import { BeginPauseEditingUseCase } from '@/useCases/history/BeginPauseEditingUseCase';
import { EndPauseEditingUseCase } from '@/useCases/history/EndPauseEditingUseCase';
import { Disposable } from '../../externals/EditingSystemTs/src/Disposable';
import { inject, injectable } from 'tsyringe';

@injectable()
export class PauseEditingBlock implements Disposable {
  constructor(
    @inject(UseCase.beginPauseEditing) beginPauseEditing: BeginPauseEditingUseCase,
    @inject(UseCase.endPauseEditing) private endPauseEditing: EndPauseEditingUseCase
  ) {
    beginPauseEditing.invoke();
  }

  dispose(): void {
    this.endPauseEditing.invoke();
  }
}
