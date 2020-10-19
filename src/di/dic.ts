import { container, DependencyContainer } from 'tsyringe';

let runtimeContainer: DependencyContainer | null = null;

export function dic(): DependencyContainer {
  return runtimeContainer ?? container;
}

export function startRuntime(): void {
  throw new Error('Not implement Runtime mode.');

  runtimeContainer = container.createChildContainer();
}

export function endRuntime(): void {
  throw new Error('Not implement Runtime mode.');

  runtimeContainer = null;
}
