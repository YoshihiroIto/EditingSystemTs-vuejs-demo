import { container, DependencyContainer } from 'tsyringe';
import { Assert } from '../../externals/EditingSystemTs/src/Assert';

let runtimeContainer: DependencyContainer | null = null;

export function dic(): DependencyContainer {
  return runtimeContainer ?? container;
}

export function startRuntime(): void {
  Assert.isNull(runtimeContainer);

  runtimeContainer = container.createChildContainer();
}

export function endRuntime(): void {
  Assert.isNotNull(runtimeContainer);

  runtimeContainer = null;
}
