import { EventArgs, TypedEvent } from '../../../externals/EditingSystemTs/src/TypedEvent';

export interface GetEditedUseCase {
  invoke(): TypedEvent<EventArgs>;
}
