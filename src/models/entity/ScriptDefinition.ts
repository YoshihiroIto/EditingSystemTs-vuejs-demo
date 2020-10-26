import { Entity } from './Entity';

export class ScriptDefinition {
  get code(): string {
    return this._code;
  }

  set code(v: string) {
    if (this._code === v) {
      return;
    }

    this._code = v;
    this.updateScript();
  }

  private _code = '';

  constructor({ code = '' }: Partial<{ code: string }> = {}) {
    this.code = code;
  }

  invokeUpdate(entity: Entity): void {
    this.invokeInternal(entity, 'update');
  }

  private invokeInternal(entity: Entity, funcName: string): void {
    if (this.functions == null) {
      return;
    }

    const func = this.functions[funcName];
    if (func == null) {
      return;
    }

    (func as (_: Entity) => void)(entity);
  }

  private functions: Record<string, unknown> | null = null;

  private updateScript(): void {
    const parsingScript = this.code + '\nreturn {update:update};';

    this.functions = new Function(parsingScript)();
  }

  toJSON(): unknown {
    return {
      code: this.code,
    };
  }
}
