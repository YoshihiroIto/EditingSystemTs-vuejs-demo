import { History } from '../../../externals/EditingSystemTs/src/History';
import { BeginPauseEditingUseCase } from '@/useCases/history/BeginPauseEditingUseCase';
import { singleton } from 'tsyringe';

@singleton()
export class BeginPauseEditingInteractor implements BeginPauseEditingUseCase {
  constructor(private readonly history: History) {}

  invoke(): void {
    this.history.beginPause();
  }
}
