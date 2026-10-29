import { useState, useEffect, useRef } from "react";

function useInterval(callback, delay) {
  const [running, setRunning] = useState(true);
  const saved_cb = useRef(callback);

  useEffect(() => {
    saved_cb.current = callback;
  }, [callback]);

  useEffect(() => {
    if (!running || delay === null) {
      return;
    }

    const id = setInterval(() => {
      saved_cb.current();
    }, delay);

    return () => clearInterval(id);
  }, [delay, running]);

  const stop = () => setRunning(false);
  const resume = () => setRunning(true);

  return { stop, resume, running };
}

export default useInterval;
