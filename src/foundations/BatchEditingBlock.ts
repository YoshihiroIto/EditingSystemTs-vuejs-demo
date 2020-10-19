import { UseCase } from '@/di/useCase';
import { BeginBatchEditingUseCase } from '@/useCases/history/BeginBatchEditingUseCase';
import { EndBatchEditingUseCase } from '@/useCases/history/EndBatchEditingUseCase';
import { Disposable } from '../../externals/EditingSystemTs/src/TypedEvent';
import { inject, injectable } from 'tsyringe';

@injectable()
export class BatchEditingBlock implements Disposable {
  constructor(
    @inject(UseCase.beginBatchEditing) beginBatchEditing: BeginBatchEditingUseCase,
    @inject(UseCase.endBatchEditing) private endBatchEditing: EndBatchEditingUseCase
  ) {
    beginBatchEditing.invoke();
  }

  dispose(): void {
    this.endBatchEditing.invoke();
  }
}
