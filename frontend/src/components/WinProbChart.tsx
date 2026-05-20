"use client";

import { useState, useEffect, useCallback } from "react";
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid,
    Tooltip, ResponsiveContainer, ReferenceLine,
} from "recharts";
import { useSupabase } from "@/providers/SupabaseProvider";
import type { BallEvent, Match, Prediction } from "@/types/database";

interface ChartPoint {
    label: string;   // "12.3"
    home: number;    // 0–100
    away: number;    // 0–100
    isWicket?: boolean;
}

interface Props {
    match: Match;
    /** Pass the latest ball from LiveScorecard via onNewBall */
    latestBall?: BallEvent | null;
    apiUrl?: string; // e.g. process.env.NEXT_PUBLIC_API_URL
}

// Custom tooltip
function CricTooltip({ active, payload, label }: any) {
    if (!active || !payload?.length) return null;
    const home = payload.find((p: any) => p.dataKey === "home");
    const away = payload.find((p: any) => p.dataKey === "away");
    return (
        <div className="rounded-lg border border-[rgba(255,255,255,0.1)] bg-[rgb(var(--background-raised))] px-3 py-2 shadow-xl">
            <p className="mb-1 font-mono text-[11px] text-[rgb(var(--foreground-faint))]">Over {label}</p>
            {home && (
                <p className="font-mono text-xs text-[rgb(var(--teal))]">
                    {home.name}: <strong>{home.value.toFixed(1)}%</strong>
                </p>
            )}
            {away && (
                <p className="font-mono text-xs text-[rgb(var(--amber))]">
                    {away.name}: <strong>{away.value.toFixed(1)}%</strong>
                </p>
            )}
        </div>
    );
}

export function WinProbChart({ match, latestBall, apiUrl }: Props) {
    const { supabase } = useSupabase();
    const [data, setData] = useState<ChartPoint[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    // ── Load historical prediction curve ──────────────────────────────────────
    useEffect(() => {
        async function load() {
            const { data: preds } = await supabase
                .from("predictions")
                .select("*")
                .eq("match_id", match.id)
                .order("over_number", { ascending: true })
                .order("ball_number", { ascending: true });

            if (preds) {
                setData(
                    preds.map((p: Prediction) => ({
                        label: `${p.over_number ?? 0}.${p.ball_number ?? 1}`,
                        home: Number((p.win_prob_home * 100).toFixed(1)),
                        away: Number((p.win_prob_away * 100).toFixed(1)),
                    }))
                );
            }
            setLoading(false);
        }
        load();
    }, [match.id, supabase]);

    // ── Fetch new prediction from FastAPI on each new ball ────────────────────
    const fetchPrediction = useCallback(
        async (ball: BallEvent) => {
            if (!apiUrl) return;
            try {
                const res = await fetch(`${apiUrl}/predict`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        match_id: match.id,
                        innings: ball.innings,
                        over_number: ball.over_number,
                        ball_number: ball.ball_number,
                        runs_off_bat: ball.runs_off_bat,
                        is_wicket: ball.is_wicket,
                    }),
                });
                if (!res.ok) return;
                const pred: { win_prob_home: number; win_prob_away: number } = await res.json();
                const point: ChartPoint = {
                    label: `${ball.over_number}.${ball.ball_number}`,
                    home: Number((pred.win_prob_home * 100).toFixed(1)),
                    away: Number((pred.win_prob_away * 100).toFixed(1)),
                    isWicket: ball.is_wicket,
                };
                setData((prev) => [...prev, point]);
            } catch {
                setError(true);
            }
        },
        [match.id, apiUrl]
    );

    useEffect(() => {
        if (latestBall) fetchPrediction(latestBall);
    }, [latestBall, fetchPrediction]);

    // ── Loading skeleton ──────────────────────────────────────────────────────
    if (loading) {
        return <div className="skeleton h-56 w-full rounded-xl" />;
    }

    // ── No data yet ───────────────────────────────────────────────────────────
    if (data.length === 0) {
        return (
            <div className="flex h-56 items-center justify-center rounded-xl border border-dashed border-[rgba(255,255,255,0.08)]">
                <p className="text-sm text-[rgb(var(--foreground-faint))]">
                    Win probability chart will appear once the match begins
                </p>
            </div>
        );
    }

    const latestHome = data[data.length - 1]?.home ?? 50;
    const latestAway = data[data.length - 1]?.away ?? 50;

    return (
        <div className="flex flex-col gap-4">

            {/* ── Probability pills ── */}
            <div className="flex items-center gap-3">
                <div className="flex flex-1 items-center justify-between rounded-xl bg-[rgb(var(--background-raised))] px-4 py-3">
                    <div>
                        <p className="text-[11px] font-medium uppercase tracking-wider text-[rgb(var(--foreground-faint))]">
                            {match.team_home_short}
                        </p>
                        <p className="font-mono text-2xl font-bold text-[rgb(var(--teal))]">
                            {latestHome.toFixed(1)}%
                        </p>
                    </div>
                    <div className="text-right">
                        <p className="text-[11px] font-medium uppercase tracking-wider text-[rgb(var(--foreground-faint))]">
                            {match.team_away_short}
                        </p>
                        <p className="font-mono text-2xl font-bold text-[rgb(var(--amber))]">
                            {latestAway.toFixed(1)}%
                        </p>
                    </div>
                </div>
            </div>

            {/* ── Stacked progress bar ── */}
            <div className="flex h-2 w-full overflow-hidden rounded-full">
                <div
                    className="h-full bg-[rgb(var(--teal))] transition-all duration-700"
                    style={{ width: `${latestHome}%` }}
                />
                <div
                    className="h-full bg-[rgb(var(--amber))] transition-all duration-700"
                    style={{ width: `${latestAway}%` }}
                />
            </div>

            {/* ── Chart ── */}
            <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={data} margin={{ top: 4, right: 4, left: -28, bottom: 0 }}>
                    <defs>
                        <linearGradient id="gradHome" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="rgb(var(--teal))" stopOpacity={0.25} />
                            <stop offset="95%" stopColor="rgb(var(--teal))" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="gradAway" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="rgb(var(--amber))" stopOpacity={0.2} />
                            <stop offset="95%" stopColor="rgb(var(--amber))" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                    <XAxis
                        dataKey="label"
                        tick={{ fontSize: 10, fill: "rgb(var(--foreground-faint))", fontFamily: "var(--font-mono)" }}
                        tickLine={false}
                        axisLine={false}
                        interval="preserveStartEnd"
                    />
                    <YAxis
                        domain={[0, 100]}
                        tickFormatter={(v) => `${v}%`}
                        tick={{ fontSize: 10, fill: "rgb(var(--foreground-faint))", fontFamily: "var(--font-mono)" }}
                        tickLine={false}
                        axisLine={false}
                    />
                    <Tooltip content={<CricTooltip />} />
                    <ReferenceLine y={50} stroke="rgba(255,255,255,0.08)" strokeDasharray="4 4" />
                    <Area
                        type="monotone"
                        dataKey="home"
                        name={match.team_home_short}
                        stroke="rgb(var(--teal))"
                        strokeWidth={2}
                        fill="url(#gradHome)"
                        dot={false}
                        activeDot={{ r: 4, fill: "rgb(var(--teal))", strokeWidth: 0 }}
                    />
                    <Area
                        type="monotone"
                        dataKey="away"
                        name={match.team_away_short}
                        stroke="rgb(var(--amber))"
                        strokeWidth={2}
                        fill="url(#gradAway)"
                        dot={false}
                        activeDot={{ r: 4, fill: "rgb(var(--amber))", strokeWidth: 0 }}
                    />
                </AreaChart>
            </ResponsiveContainer>

            {error && (
                <p className="text-center text-[11px] text-[rgb(var(--foreground-faint))]">
                    Prediction service unavailable — chart using last known data
                </p>
            )}
        </div>
    );
}