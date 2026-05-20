"use client";

import { useEffect, useState } from "react";
import { useSupabase } from "@/providers/SupabaseProvider";
import type { BallEvent, Match } from "@/types/database";

// ─── Ball dot display ─────────────────────────────────────────────────────────
function BallDot({ ball }: { ball: BallEvent }) {
    const total = ball.runs_off_bat + ball.extras;
    let bg = "bg-[rgba(255,255,255,0.08)] text-[rgb(var(--foreground-muted))]";
    if (ball.is_wicket) bg = "bg-[rgb(var(--coral))] text-white";
    else if (total === 6) bg = "bg-[rgb(var(--teal))] text-[rgb(var(--background))]";
    else if (total === 4) bg = "bg-[rgb(var(--amber))] text-[rgb(var(--background))]";
    else if (total === 0 && !ball.extra_type) bg = "bg-[rgba(255,255,255,0.05)] text-[rgb(var(--foreground-faint))]";

    return (
        <span className={`inline-flex h-7 w-7 items-center justify-center rounded-full text-[11px] font-bold ${bg}`}>
            {ball.is_wicket ? "W" : ball.extra_type ? "E" : total}
        </span>
    );
}

// ─── Over row ─────────────────────────────────────────────────────────────────
function OverRow({ overNum, balls }: { overNum: number; balls: BallEvent[] }) {
    const runs = balls.reduce((s, b) => s + b.runs_off_bat + b.extras, 0);
    const wkts = balls.filter((b) => b.is_wicket).length;
    return (
        <div className="flex items-center gap-3 py-2 border-b border-[rgba(255,255,255,0.04)] last:border-0">
            <span className="w-14 flex-shrink-0 font-mono text-[11px] text-[rgb(var(--foreground-faint))]">
                Over {overNum + 1}
            </span>
            <div className="flex gap-1.5">
                {balls.map((b, i) => <BallDot key={i} ball={b} />)}
                {/* empty placeholders */}
                {Array.from({ length: Math.max(0, 6 - balls.length) }).map((_, i) => (
                    <span key={`e-${i}`} className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-dashed border-[rgba(255,255,255,0.08)] text-[11px] text-transparent">·</span>
                ))}
            </div>
            <span className="ml-auto font-mono text-xs text-[rgb(var(--foreground-muted))]">
                {runs} runs{wkts > 0 ? ` · ${wkts}W` : ""}
            </span>
        </div>
    );
}

// ─── Main component ───────────────────────────────────────────────────────────
interface Props {
    match: Match;
    /** Called with every new ball so WinProbChart can trigger /predict */
    onNewBall?: (ball: BallEvent) => void;
}

export function LiveScorecard({ match, onNewBall }: Props) {
    const { supabase } = useSupabase();
    const [balls, setBalls] = useState<BallEvent[]>([]);
    const [loading, setLoading] = useState(true);

    // ── Initial load: fetch existing balls ────────────────────────────────────
    useEffect(() => {
        async function load() {
            const { data } = await supabase
                .from("ball_by_ball")
                .select("*")
                .eq("match_id", match.id)
                .eq("innings", match.current_innings ?? 1)
                .order("over_number", { ascending: true })
                .order("ball_number", { ascending: true });
            setBalls(data ?? []);
            setLoading(false);
        }
        load();
    }, [match.id, match.current_innings, supabase]);

    // ── Realtime subscription: append new balls live ──────────────────────────
    useEffect(() => {
        const channel = supabase
            .channel(`live-scorecard-${match.id}`)
            .on(
                "postgres_changes",
                {
                    event: "INSERT",
                    schema: "public",
                    table: "ball_by_ball",
                    filter: `match_id=eq.${match.id}`,
                },
                (payload) => {
                    const newBall = payload.new as BallEvent;
                    setBalls((prev) => [...prev, newBall]);
                    onNewBall?.(newBall);
                }
            )
            .subscribe();

        return () => { supabase.removeChannel(channel); };
    }, [match.id, supabase, onNewBall]);

    // ── Derived state ─────────────────────────────────────────────────────────
    const totalRuns = balls.reduce((s, b) => s + b.runs_off_bat + b.extras, 0);
    const totalWickets = balls.filter((b) => b.is_wicket).length;
    const ballsBowled = balls.filter((b) => !b.extra_type).length;
    const oversDone = Math.floor(ballsBowled / 6);
    const ballsInOver = ballsBowled % 6;
    const runRate = ballsBowled > 0 ? ((totalRuns / ballsBowled) * 6).toFixed(2) : "0.00";

    // Group by over
    const byOver: Record<number, BallEvent[]> = {};
    balls.forEach((b) => {
        if (!byOver[b.over_number]) byOver[b.over_number] = [];
        byOver[b.over_number].push(b);
    });
    const currentOver = byOver[oversDone] ?? [];
    const recentOvers = Object.entries(byOver)
        .sort(([a], [b]) => Number(b) - Number(a))
        .slice(0, 5);

    if (loading) {
        return (
            <div className="space-y-2">
                {[1, 2, 3].map(i => (
                    <div key={i} className="skeleton h-10 w-full rounded-lg" />
                ))}
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-4">

            {/* ── Score header ── */}
            <div className="flex items-end justify-between">
                <div>
                    <div className="flex items-baseline gap-2">
                        <span className="score-display text-4xl font-bold text-[rgb(var(--foreground))]">
                            {totalRuns}/{totalWickets}
                        </span>
                        <span className="font-mono text-lg text-[rgb(var(--foreground-muted))]">
                            ({oversDone}.{ballsInOver})
                        </span>
                    </div>
                    <p className="mt-1 text-sm text-[rgb(var(--foreground-muted))]">
                        {match.team_home_short} — Innings {match.current_innings ?? 1}
                    </p>
                </div>
                <div className="text-right">
                    <p className="font-mono text-2xl font-semibold text-[rgb(var(--amber))]">{runRate}</p>
                    <p className="text-xs text-[rgb(var(--foreground-faint))]">Run Rate</p>
                </div>
            </div>

            {/* ── Current over ── */}
            <div className="rounded-xl border border-[rgba(255,255,255,0.06)] bg-[rgb(var(--background-raised))] p-4">
                <div className="mb-3 flex items-center justify-between">
                    <p className="text-xs font-semibold uppercase tracking-wider text-[rgb(var(--foreground-faint))]">
                        This Over
                    </p>
                    <span className="flex items-center gap-1.5 text-xs text-[rgb(var(--teal))]">
                        <span className="live-dot" />
                        Live
                    </span>
                </div>
                <div className="flex gap-2">
                    {currentOver.map((b, i) => <BallDot key={i} ball={b} />)}
                    {currentOver.length === 0 && (
                        <p className="text-xs text-[rgb(var(--foreground-faint))]">Over yet to begin...</p>
                    )}
                </div>
            </div>

            {/* ── Recent overs timeline ── */}
            <div className="rounded-xl border border-[rgba(255,255,255,0.06)] bg-[rgb(var(--background-raised))] p-4">
                <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-[rgb(var(--foreground-faint))]">
                    Recent Overs
                </p>
                {recentOvers.length === 0 ? (
                    <p className="text-xs text-[rgb(var(--foreground-faint))]">No overs yet</p>
                ) : (
                    recentOvers.map(([over, bs]) => (
                        <OverRow key={over} overNum={Number(over)} balls={bs} />
                    ))
                )}
            </div>

        </div>
    );
}