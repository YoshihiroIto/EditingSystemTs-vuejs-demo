import { Disposable } from '../../externals/EditingSystemTs/src/Disposable';

export default function using(disposable: Disposable, action: (disposable: Disposable) => unknown): unknown {
  try {
    return action(disposable);
  } finally {
    disposable.dispose();
  }
}
