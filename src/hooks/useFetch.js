import { useState, useEffect } from "react";

function useFetch(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let canceled = false;

    setLoading(true);
    setError(null);

    fetch(url)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Помилка запиту: " + res.status);
        }
        return res.json();
      })
      .then((result) => {
        if (!canceled) {
          setData(result);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (!canceled) {
          setError(err.message);
          setLoading(false);
        }
      });

    return () => {
      canceled = true;
    };
  }, [url]);

  return { data, loading, error };
}

export default useFetch;
