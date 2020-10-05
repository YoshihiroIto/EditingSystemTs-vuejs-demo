import { History } from '../../../externals/EditingSystemTs/src/History';
import { BeginBatchEditingUseCase } from '@/useCases/history/BeginBatchEditingUseCase';
import { singleton } from 'tsyringe';

@singleton()
export class BeginBatchEditingInteractor implements BeginBatchEditingUseCase {
  constructor(private readonly history: History) {}

  invoke(): void {
    this.history.beginBatch();
  }
}
