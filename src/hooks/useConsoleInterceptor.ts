import { useCallback, useEffect, useState } from 'react';
import { useImmer } from 'use-immer';
import { ConsoleInterceptor } from '../interceptors';
import type { LogMessage } from '../types';

interface ConsoleInterceptorParams {
  autoEnabled?: boolean;
}

export default function useConsoleInterceptor(params: ConsoleInterceptorParams) {
  const { autoEnabled = false } = params || {};

  const [isInterceptorEnabled, setIsInterceptorEnabled] = useState(autoEnabled);

  const [logMessages, setLogMessages] = useImmer<LogMessage[]>([]);

  const clearAllLogMessages = () => {
    setLogMessages([]);
  };

  const _isInterceptorEnabled = () => ConsoleInterceptor.instance.isInterceptorEnabled;

  const enableInterception = useCallback(() => {
    if (_isInterceptorEnabled()) return;

    ConsoleInterceptor.instance
      .setCallback((type, args) => {
        setLogMessages(draft => {
          draft.push({ type, values: Array.from(args) });
        });
      })
      .enableInterception();

    setIsInterceptorEnabled(true);
  }, [setLogMessages]);

  const disableInterception = useCallback(() => {
    if (!_isInterceptorEnabled()) return;

    ConsoleInterceptor.instance.disableInterception();

    setIsInterceptorEnabled(false);
  }, []);

  useEffect(() => {
    if (autoEnabled) enableInterception();

    if (autoEnabled) return disableInterception;
  }, [autoEnabled, disableInterception, enableInterception]);

  return {
    isInterceptorEnabled,
    enableInterception,
    disableInterception,
    clearAllLogMessages,
    logMessages,
  };
}