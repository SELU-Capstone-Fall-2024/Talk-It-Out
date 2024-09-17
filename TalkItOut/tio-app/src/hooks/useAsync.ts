import { useState, useEffect } from 'react';

const useAsync = <T,>(asyncFunction: () => Promise<T>, dependencies: any[] = []) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    const execute = async () => {
      try {
        const result = await asyncFunction();
        setData(result);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    execute();
  }, dependencies);

  return { data, loading, error };
};

export default useAsync;