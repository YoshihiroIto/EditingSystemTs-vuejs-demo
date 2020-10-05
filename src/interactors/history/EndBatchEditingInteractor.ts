import { History } from '../../../externals/EditingSystemTs/src/History';
import { EndBatchEditingUseCase } from '@/useCases/history/EndBatchEditingUseCase';
import { singleton } from 'tsyringe';

@singleton()
export class EndBatchEditingInteractor implements EndBatchEditingUseCase {
  constructor(private readonly history: History) {}

  invoke(): void {
    this.history.endBatch();
  }
}
