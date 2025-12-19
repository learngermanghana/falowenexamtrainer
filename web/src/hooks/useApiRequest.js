import { useCallback, useEffect, useMemo, useState } from "react";

const defaultMapError = (error) => error?.message || "Request failed. Please try again.";

export const useApiRequest = (
  requestFn,
  {
    immediate = false,
    initialData = null,
    mapError = defaultMapError,
    resetOnExecute = true,
  } = {}
) => {
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(immediate);
  const [error, setError] = useState(null);

  const execute = useCallback(
    async (...args) => {
      if (resetOnExecute) setData(initialData);
      setError(null);
      setLoading(true);
      try {
        const response = await requestFn(...args);
        setData(response);
        return response;
      } catch (err) {
        const formatted = mapError ? mapError(err) : defaultMapError(err);
        setError(formatted);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [initialData, mapError, requestFn, resetOnExecute]
  );

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [execute, immediate]);

  const status = useMemo(
    () => ({
      data,
      loading,
      error,
      execute,
      setData,
    }),
    [data, error, execute, loading]
  );

  return status;
};

export default useApiRequest;
