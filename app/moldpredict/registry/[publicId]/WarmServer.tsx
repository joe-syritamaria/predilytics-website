"use client";

import { useEffect } from "react";

export default function WarmServer() {
  useEffect(() => {
    const controller = new AbortController();

    fetch("/api/health", {
      method: "GET",
      cache: "no-store",
      keepalive: true,
      signal: controller.signal,
    }).catch(() => {
      // Best-effort warmup; ignore errors.
    });

    return () => controller.abort();
  }, []);

  return null;
}
