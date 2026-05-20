// src/types/database.ts
//
// Hand-written types for now. Once you run `supabase gen types typescript`,
// replace this file with the generated output and delete the manual types.

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

// ─── Match ────────────────────────────────────────────────────────────────────
export type MatchStatus = "upcoming" | "live" | "completed";

export interface Match {
  id: string;
  cricapi_id: string | null;
  name: string;
  short_name: string;
  team_home: string;
  team_away: string;
  team_home_short: string;
  team_away_short: string;
  venue: string;
  city: string;
  status: MatchStatus;
  match_type: "T20" | "ODI" | "Test";
  tournament: string | null;
  // Scores — null until innings starts
  score_home: string | null;     // e.g. "187/3"
  score_away: string | null;
  overs_home: number | null;
  overs_away: number | null;
  current_innings: 1 | 2 | null;
  toss_winner: string | null;
  toss_decision: "bat" | "field" | null;
  result: string | null;         // e.g. "India won by 24 runs"
  date_start: string;            // ISO 8601
  date_end: string | null;
  created_at: string;
  updated_at: string;
}

// ─── Player ───────────────────────────────────────────────────────────────────
export interface Player {
  id: string;
  cricapi_id: string | null;
  name: string;
  short_name: string;
  country: string;
  role: "batter" | "bowler" | "all-rounder" | "wicket-keeper";
  batting_style: string | null;
  bowling_style: string | null;
  // Career batting
  batting_matches: number;
  batting_innings: number;
  batting_runs: number;
  batting_average: number | null;
  batting_strike_rate: number | null;
  batting_fifties: number;
  batting_hundreds: number;
  batting_fours: number;
  batting_sixes: number;
  // Career bowling
  bowling_matches: number;
  bowling_innings: number;
  bowling_wickets: number;
  bowling_average: number | null;
  bowling_economy: number | null;
  bowling_strike_rate: number | null;
  bowling_five_wickets: number;
  created_at: string;
  updated_at: string;
}

// ─── Ball-by-ball event ───────────────────────────────────────────────────────
export interface BallEvent {
  id: string;
  match_id: string;
  innings: 1 | 2;
  over_number: number;         // 0-indexed (over 1 = 0, over 20 = 19)
  ball_number: number;         // 1–6 (plus extras)
  batter_id: string;
  bowler_id: string;
  runs_off_bat: number;
  extras: number;
  extra_type: "wide" | "no_ball" | "bye" | "leg_bye" | null;
  is_wicket: boolean;
  wicket_type: string | null;  // "caught", "bowled", "lbw", etc.
  fielder_id: string | null;
  commentary: string | null;
  created_at: string;
}

// ─── Prediction ───────────────────────────────────────────────────────────────
export interface Prediction {
  id: string;
  match_id: string;
  ball_event_id: string | null; // null for pre-match predictions
  innings: 1 | 2 | null;
  over_number: number | null;
  ball_number: number | null;
  win_prob_home: number;        // 0.0–1.0
  win_prob_away: number;        // always = 1 - win_prob_home
  model_version: string;
  features: Json | null;        // raw feature dict for debugging
  created_at: string;
}

// ─── User watchlist entry ─────────────────────────────────────────────────────
export interface UserWatchlist {
  id: string;
  user_id: string;
  entity_type: "team" | "player" | "tournament";
  entity_id: string;
  entity_name: string;          // denormalised for fast rendering
  created_at: string;
}

// ─── Supabase Database shape ───────────────────────────────────────────────────
// Required by createBrowserClient<Database>()
export interface Database {
  public: {
    Tables: {
      matches: {
        Row: Match;
        Insert: Omit<Match, "id" | "created_at" | "updated_at">;
        Update: Partial<Omit<Match, "id" | "created_at">>;
      };
      players: {
        Row: Player;
        Insert: Omit<Player, "id" | "created_at" | "updated_at">;
        Update: Partial<Omit<Player, "id" | "created_at">>;
      };
      ball_by_ball: {
        Row: BallEvent;
        Insert: Omit<BallEvent, "id" | "created_at">;
        Update: Partial<Omit<BallEvent, "id" | "created_at">>;
      };
      predictions: {
        Row: Prediction;
        Insert: Omit<Prediction, "id" | "created_at">;
        Update: Partial<Omit<Prediction, "id" | "created_at">>;
      };
      user_watchlists: {
        Row: UserWatchlist;
        Insert: Omit<UserWatchlist, "id" | "created_at">;
        Update: Partial<Omit<UserWatchlist, "id" | "created_at">>;
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      match_status: MatchStatus;
    };
  };
}