"use client";

import { useState, useCallback } from "react";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useSupabase } from "@/providers/SupabaseProvider";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { LiveScorecard } from "@/components/LiveScorecard";
import { WinProbChart } from "@/components/WinProbChart";
import type { BallEvent, Match } from "@/types/database";
import { ArrowLeft, MapPin, Trophy } from "lucide-react";
import Link from "next/link";

export default function LiveMatchPage() {
    const { matchId } = useParams<{ matchId: string }>();
    const { supabase } = useSupabase();
    const [latestBall, setLatestBall] = useState<BallEvent | null>(null);

    // ── Fetch match meta ───────────────────────────────────────────────────────
    const { data: match, isLoading, error } = useQuery<Match>({
        queryKey: ["match", matchId],
        queryFn: async () => {
            const { data, error } = await supabase
                .from("matches")
                .select("*")
                .eq("id", matchId)
                .single();
            if (error) throw error;
            return data;
        },
        staleTime: 0, // always fresh
    });

    // Passed to LiveScorecard — updates on each new ball from Realtime
    const handleNewBall = useCallback((ball: BallEvent) => {
        setLatestBall(ball);
    }, []);

    // ── Loading ────────────────────────────────────────────────────────────────
    if (isLoading) {
        return (
            <DashboardLayout>
                <div className="p-6 space-y-4">
                    <div className="skeleton h-8 w-64 rounded-lg" />
                    <div className="skeleton h-4 w-40 rounded-lg" />
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 mt-6">
                        <div className="skeleton h-80 rounded-xl" />
                        <div className="skeleton h-80 rounded-xl" />
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    // ── Error / not found ──────────────────────────────────────────────────────
    if (error || !match) {
        return (
            <DashboardLayout>
                <div className="flex h-full flex-col items-center justify-center gap-4">
                    <p className="text-[rgb(var(--foreground-muted))]">Match not found.</p>
                    <Link href="/live" className="text-sm text-[rgb(var(--teal))] underline">
                        ← Back to live matches
                    </Link>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="min-h-full p-6">

                {/* ── Back nav ── */}
                <Link
                    href="/live"
                    className="mb-5 inline-flex items-center gap-2 text-sm text-[rgb(var(--foreground-muted))] transition-colors hover:text-[rgb(var(--foreground))]"
                >
                    <ArrowLeft size={14} />
                    All live matches
                </Link>

                {/* ── Match header ── */}
                <div className="mb-6">
                    <div className="flex flex-wrap items-center gap-3">
                        <h1 className="text-2xl font-bold tracking-tight text-[rgb(var(--foreground))]">
                            {match.team_home_short}
                            <span className="mx-2 text-[rgb(var(--foreground-faint))]">vs</span>
                            {match.team_away_short}
                        </h1>
                        {match.status === "live" && (
                            <span className="flex items-center gap-1.5 rounded-full bg-[rgba(var(--coral),0.15)] px-3 py-1 text-xs font-semibold text-[rgb(var(--coral))]">
                                <span className="live-dot" />
                                LIVE
                            </span>
                        )}
                        {match.status === "completed" && (
                            <span className="rounded-full bg-[rgba(255,255,255,0.06)] px-3 py-1 text-xs font-medium text-[rgb(var(--foreground-muted))]">
                                Completed
                            </span>
                        )}
                    </div>
                    <div className="mt-2 flex flex-wrap gap-4 text-xs text-[rgb(var(--foreground-faint))]">
                        {match.tournament && (
                            <span className="flex items-center gap-1">
                                <Trophy size={11} />
                                {match.tournament}
                            </span>
                        )}
                        <span className="flex items-center gap-1">
                            <MapPin size={11} />
                            {match.venue}, {match.city}
                        </span>
                        <span className="font-mono">{match.match_type}</span>
                    </div>
                    {match.result && (
                        <p className="mt-2 text-sm font-medium text-[rgb(var(--teal))]">{match.result}</p>
                    )}
                </div>

                {/* ── Main grid ── */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">

                    {/* Left — Live Scorecard */}
                    <section>
                        <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-[rgb(var(--foreground-faint))]">
                            Live Scorecard
                        </h2>
                        <LiveScorecard match={match} onNewBall={handleNewBall} />
                    </section>

                    {/* Right — Win Probability */}
                    <section>
                        <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-[rgb(var(--foreground-faint))]">
                            Win Probability
                        </h2>
                        <div className="rounded-xl border border-[rgba(255,255,255,0.06)] bg-[rgb(var(--background-subtle))] p-4">
                            <WinProbChart
                                match={match}
                                latestBall={latestBall}
                                apiUrl={process.env.NEXT_PUBLIC_API_URL}
                            />
                        </div>
                    </section>

                </div>

                {/* ── Second innings score (if applicable) ── */}
                {match.score_away && (
                    <div className="mt-6 rounded-xl border border-[rgba(255,255,255,0.06)] bg-[rgb(var(--background-subtle))] p-4">
                        <p className="text-xs font-semibold uppercase tracking-wider text-[rgb(var(--foreground-faint))]">
                            {match.team_away_short} — Innings 2
                        </p>
                        <p className="mt-1 font-mono text-2xl font-bold text-[rgb(var(--foreground))]">
                            {match.score_away}
                            {match.overs_away && (
                                <span className="ml-2 text-base text-[rgb(var(--foreground-muted))]">
                                    ({match.overs_away} ov)
                                </span>
                            )}
                        </p>
                    </div>
                )}

            </div>
        </DashboardLayout>
    );
}