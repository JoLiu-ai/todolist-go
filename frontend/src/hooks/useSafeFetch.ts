import { useEffect, useRef } from 'react';

type RequestController<T> = {
  abort: () => void;
  promise: Promise<T>;
};

export function useSafeFetch<T>(
  fetchFn: (signal?: AbortSignal) => Promise<T>,
  callback: (data: T) => void,
  errorHandler?: (error: Error) => void
) {
  const controllerRef = useRef<AbortController>();

  useEffect(() => {
    const controller = new AbortController();
    controllerRef.current = controller;

    const execute = async () => {
      try {
        const data = await fetchFn(controller.signal);
        if (!controller.signal.aborted) {
          callback(data);
        }
      } catch (err) {
        if (!controller.signal.aborted && errorHandler) {
          errorHandler(err instanceof Error ? err : new Error(String(err)));
        }
      }
    };

    execute();

    return () => {
      controller.abort();
    };
  }, [fetchFn, callback, errorHandler]);
} 