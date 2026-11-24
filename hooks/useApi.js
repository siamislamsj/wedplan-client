"use client";
import { useCallback, useEffect, useState } from "react";
import { api } from "@/lib/api";

export function useApi(path, auth = true) {
  const [s, setS] = useState({ data: null, loading: !!path, error: null });
  const load = useCallback(async () => {
    if (!path) return;
    setS((p) => ({ ...p, loading: true, error: null }));
    try {
      setS({ data: await api(path, { auth }), loading: false, error: null });
    } catch (e) {
      setS({ data: null, loading: false, error: e.message });
    }
  }, [path, auth]);
  useEffect(() => { load(); }, [load]);
  return { ...s, reload: load };
}

export function useDebounced(value, ms = 400) {
  const [v, setV] = useState(value);
  useEffect(() => { const t = setTimeout(() => setV(value), ms); return () => clearTimeout(t); }, [value, ms]);
  return v;
}
