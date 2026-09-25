/**
 * useClientMount.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Prevents server/client hydration mismatches by returning false on the first
 * server render and true only after the component has mounted client-side.
 *
 * Usage:
 *   const isMounted = useClientMount();
 *   if (!isMounted) return null;
 */

import { useEffect, useRef, useState } from "react";

export function useClientMount(): boolean {
  const mountedRef = useRef(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    if (!mountedRef.current) {
      mountedRef.current = true;
      setIsMounted(true);
    }
  }, []);

  return isMounted;
}
