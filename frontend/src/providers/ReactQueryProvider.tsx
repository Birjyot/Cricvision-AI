// src/providers/ReactQueryProvider.tsx
"use client";

import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// Optional: uncomment for the floating devtools panel during development
// import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

// ─── Provider ─────────────────────────────────────────────────────────────────
export function ReactQueryProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // useState ensures one client per browser session, never recreated on render.
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            /*
             * staleTime tuning for CricVision:
             *
             * Live match data      → 0ms  (always re-fetch; Realtime handles it)
             * Player career stats  → 5min (changes infrequently mid-season)
             * Historical data      → 10min (stable)
             *
             * Override per-query with queryKey-specific options where needed.
             */
            staleTime: 30_000,          // default: 30s — reasonable for listings
            gcTime: 5 * 60 * 1_000,     // keep unused data in cache for 5 min
            retry: 2,                   // retry failed requests twice
            retryDelay: (attempt) =>
              Math.min(1_000 * 2 ** attempt, 10_000), // exponential back-off
            refetchOnWindowFocus: false, // Supabase Realtime handles live data
            refetchOnReconnect: true,   // re-fetch on network reconnect
          },
          mutations: {
            retry: 1,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* Uncomment during development to inspect query state */}
      {/* {process.env.NODE_ENV === "development" && (
        <ReactQueryDevtools initialIsOpen={false} />
      )} */}
    </QueryClientProvider>
  );
}