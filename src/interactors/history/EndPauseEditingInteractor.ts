import { History } from '../../../externals/EditingSystemTs/src/History';
import { EndPauseEditingUseCase } from '@/useCases/history/EndPauseEditingUseCase';
import { singleton } from 'tsyringe';

@singleton()
export class EndPauseEditingInteractor implements EndPauseEditingUseCase {
  constructor(private readonly history: History) {}

  invoke(): void {
    this.history.endPause();
  }
}
