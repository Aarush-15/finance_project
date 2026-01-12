import { useState } from "react";
import { toast } from "sonner";

// T = The data type returned by the server action
// P = The arguments (parameters) the server action expects
const useFetch = <T, P extends any[]>(cb: (...args: P) => Promise<T>) => {
  const [data, setData] = useState<T | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fn = async (...args: P) => {
    setLoading(true);
    setError(null);

    try {
      const response = await cb(...args);
      setData(response);
    } catch (error) {
      setError(error as Error);
      toast.error((error as Error).message)
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, fn, setData };
};

export default useFetch;