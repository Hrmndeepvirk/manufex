import { useState, useEffect, useCallback } from "react";
import api from "@api";
import endPoints from "@endPoints";

export function useServerTime() {
  const [offset, setOffset] = useState(0); // ms: server time minus client time
  const [isSynced, setIsSynced] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const sync = async () => {
      setIsLoading(true);
      const clientBefore = Date.now();
      const res = await api("get", endPoints.TIMESTAMP);
      const clientAfter = Date.now();

      if (res.success && res.data?.timestamp) {
        const serverMs = new Date(res.data.timestamp).getTime();
        // Use midpoint of request round-trip to reduce network latency error
        const clientMidMs = Math.round((clientBefore + clientAfter) / 2);
        setOffset(serverMs - clientMidMs);
        setIsSynced(true);
      }

      setIsLoading(false);
    };

    sync();
  }, []);

  /**
   * Drop-in replacement for `new Date()`.
   * Returns a Date object at the real current time per the server,
   * expressed in the browser's local timezone — safe even if the user
   * has changed their system clock.
   */
  const getServerDate = useCallback(() => {
    return new Date(Date.now() + offset);
  }, [offset]);

  return { getServerDate, offset, isSynced, isLoading };
}
