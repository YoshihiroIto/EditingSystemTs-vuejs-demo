import { Entity } from './Entity';
import ts from 'typescript';
import { EventArgs } from '@/runtime/EventArgs';

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

  invokeUpdate(entity: Entity, eventArgs: EventArgs): void {
    this.invokeInternal(entity, eventArgs, 'update');
  }

  private invokeInternal(entity: Entity, eventArgs: EventArgs, funcName: string): void {
    if (this.functions == null) {
      return;
    }

    const func = this.functions[funcName];
    if (func == null) {
      return;
    }

    try {
      (func as (_0: Entity, _1: EventArgs) => void)(entity, eventArgs);
    } catch (e) {
      console.log(e);
    }
  }

  private functions: Record<string, unknown> | null = null;

  private updateScript(): void {
    const parsingScript = this.code + '\nreturn {update:update};';

    const transpiledScript = ts.transpileModule(parsingScript, {
      compilerOptions: { module: ts.ModuleKind.ESNext },
    });

    this.functions = new Function(transpiledScript.outputText)();
  }

  toJSON(): unknown {
    return {
      code: this.code,
    };
  }
}
