// src/providers/SupabaseProvider.tsx
"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient, Session } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

// ─── Types ────────────────────────────────────────────────────────────────────
type SupabaseContextValue = {
  supabase: SupabaseClient<Database>;
  session: Session | null;
  /** true while the initial session check is in-flight */
  isLoading: boolean;
};

// ─── Context ──────────────────────────────────────────────────────────────────
const SupabaseContext = createContext<SupabaseContextValue | undefined>(
  undefined
);

// ─── Provider ─────────────────────────────────────────────────────────────────
export function SupabaseProvider({ children }: { children: React.ReactNode }) {
  // One browser client for the whole app — never recreated.
  const [supabase] = useState(() =>
    createBrowserClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
  );

  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Sync session on mount and on every auth state change
  const syncSession = useCallback(
    async () => {
      const {
        data: { session: current },
      } = await supabase.auth.getSession();
      setSession(current);
      setIsLoading(false);
    },
    [supabase]
  );

  useEffect(() => {
    syncSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [supabase, syncSession]);

  return (
    <SupabaseContext.Provider value={{ supabase, session, isLoading }}>
      {children}
    </SupabaseContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────
/**
 * useSupabase — access the shared Supabase client and current session.
 *
 * @example
 * const { supabase, session, isLoading } = useSupabase();
 */
export function useSupabase() {
  const ctx = useContext(SupabaseContext);
  if (!ctx) {
    throw new Error("useSupabase must be used inside <SupabaseProvider>");
  }
  return ctx;
}