/* eslint-disable no-console */
import type { ConsoleHandlers } from '../types';
import Interceptor from './Interceptor';

const originalConsoleError = console.error;
const originalConsoleInfo = console.info;
const originalConsoleLog = console.log;
const originalConsoleWarn = console.warn;
const originalConsoleTrace = console.trace;
const originalConsoleDebug = console.debug;
const originalConsoleTable = console.table;
const originalConsoleGroupCollapsed = console.groupCollapsed;
const originalConsoleGroupEnd = console.groupEnd;
const originalConsoleGroup = console.group;

export default class ConsoleInterceptor extends Interceptor<ConsoleHandlers> {
  static readonly instance = new ConsoleInterceptor();

  protected readonly handlers: ConsoleHandlers = {
    callback: null,
  };

  private constructor() {
    super();
  }

  enableInterception(): void {
    if (this.isInterceptorEnabled) return;

    const callback = this.handlers.callback;

    console.error = function (...args) {
      callback?.('error', args);

      originalConsoleError.call(this, ...args);
    };

    console.info = function (...args) {
      callback?.('info', args);

      originalConsoleInfo.call(this, ...args);
    };

    console.log = function (...args) {
      callback?.('log', args);

      originalConsoleLog.call(this, ...args);
    };

    console.warn = function (...args) {
      callback?.('warn', args);

      originalConsoleWarn.call(this, ...args);
    };

    console.trace = function (...args) {
      callback?.('trace', args);

      originalConsoleTrace.call(this, ...args);
    };

    console.debug = function (...args) {
      callback?.('debug', args);

      originalConsoleDebug.call(this, ...args);
    };

    console.table = function (...args: Parameters<typeof originalConsoleTable>) {
      callback?.('table', args);

      originalConsoleTable.call(this, ...args);
    };

    console.groupCollapsed = function (...args) {
      callback?.('groupCollapsed', args);

      originalConsoleGroupCollapsed.call(this, ...args);
    };

    console.groupEnd = function (...args) {
      callback?.('groupEnd', args);

      originalConsoleGroupEnd.call(this, ...args);
    };

    console.group = function (...args) {
      callback?.('group', args);

      originalConsoleGroup.call(this, ...args);
    };

    this.isInterceptorEnabled = true;
  }

  disableInterception(): void {
    if (!this.isInterceptorEnabled) return;

    this.isInterceptorEnabled = false;

    console.error = originalConsoleError;
    console.info = originalConsoleInfo;
    console.log = originalConsoleLog;
    console.warn = originalConsoleWarn;
    console.trace = originalConsoleTrace;
    console.debug = originalConsoleDebug;
    console.table = originalConsoleTable;
    console.groupCollapsed = originalConsoleGroupCollapsed;
    console.groupEnd = originalConsoleGroupEnd;
    console.group = originalConsoleGroup;

    this.handlers.callback = null;
  }
}
