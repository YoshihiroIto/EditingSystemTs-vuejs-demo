import { History } from '../../../externals/EditingSystemTs/src/History';
import { ClearHistoryUseCase } from '@/useCases/history/ClearHistoryUseCase';
import { singleton } from 'tsyringe';

@singleton()
export class ClearHistoryInteractor implements ClearHistoryUseCase {
  constructor(private readonly history: History) {}

  invoke(): void {
    this.history.clear();
  }
}
