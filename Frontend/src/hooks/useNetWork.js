import { useEffect, useState } from "react";

export function useNetWork() {
  const [status, setStatus] = useState(navigator.onLine);
  const handleChange = () => {
    if (typeof navigator !== "undefined" && "onLine" in navigator) {
      setStatus(navigator.onLine);
    }
  };
  useEffect(() => {
    window.addEventListener("online", handleChange);
    window.addEventListener("offline", handleChange);
    return () => {
      window.removeEventListener("online", handleChange);
      window.removeEventListener("offline", handleChange);
    };
  }, []);
  return status;
}
