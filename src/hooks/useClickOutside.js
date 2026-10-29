import { useEffect, useRef } from "react";

function useClickOutside(ref, callback) {
  const saved_callback = useRef(callback);

  useEffect(() => {
    saved_callback.current = callback;
  }, [callback]);

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        saved_callback.current(e);
      }
    }

    document.addEventListener("mousedown", handleClick);
    document.addEventListener("touchstart", handleClick);

    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("touchstart", handleClick);
    };
  }, [ref]);
}

export default useClickOutside;
