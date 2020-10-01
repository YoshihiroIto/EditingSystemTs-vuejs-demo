import { History } from '../../../externals/EditingSystemTs/src/History';
import { GetEditedUseCase } from '@/useCases/history/GetEditedUseCase';
import { EventArgs, TypedEvent } from '../../../externals/EditingSystemTs/src/TypedEvent';
import { singleton } from 'tsyringe';

@singleton()
export class GetEditedInteractor implements GetEditedUseCase {
  constructor(private readonly history: History) {}

  invoke(): TypedEvent<EventArgs> {
    return this.history.edited;
  }
}
