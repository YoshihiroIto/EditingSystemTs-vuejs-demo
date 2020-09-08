export function nonReactivate(target: unknown, propertyName: string): void {
  Object.defineProperty(target, propertyName, { configurable: false });
}
