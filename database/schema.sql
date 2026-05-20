-- =============================================================================
-- CricVision AI — Initial Schema Migration
-- =============================================================================

-- ─── Extensions ───────────────────────────────────────────────────────────────
create extension if not exists "uuid-ossp";

-- =============================================================================
-- TABLES
-- =============================================================================

-- Drop existing tables first to avoid "relation already exists" errors when re-running
drop table if exists public.user_watchlists cascade;
drop table if exists public.predictions cascade;
drop table if exists public.ball_by_ball cascade;
drop table if exists public.players cascade;
drop table if exists public.matches cascade;

-- ─── matches ──────────────────────────────────────────────────────────────────
create table public.matches (
  id                uuid        default uuid_generate_v4() primary key,
  cricapi_id        text        unique,
  name              text        not null,
  short_name        text        not null,
  team_home         text        not null,
  team_away         text        not null,
  team_home_short   text        not null,
  team_away_short   text        not null,
  venue             text        not null,
  city              text,
  status            text        not null default 'upcoming'
                                check (status in ('upcoming','live','completed')),
  match_type        text        not null default 'T20'
                                check (match_type in ('T20','ODI','Test')),
  tournament        text,
  score_home        text,
  score_away        text,
  overs_home        numeric(4,1),
  overs_away        numeric(4,1),
  current_innings   smallint    check (current_innings in (1,2)),
  toss_winner       text,
  toss_decision     text        check (toss_decision in ('bat','field')),
  result            text,
  date_start        timestamptz not null,
  date_end          timestamptz,
  created_at        timestamptz default now() not null,
  updated_at        timestamptz default now() not null
);

-- ─── players ──────────────────────────────────────────────────────────────────
create table public.players (
  id                    uuid        default uuid_generate_v4() primary key,
  cricapi_id            text        unique,
  name                  text        not null,
  short_name            text        not null,
  country               text        not null,
  role                  text        not null
                                    check (role in ('batter','bowler','all-rounder','wicket-keeper')),
  batting_style         text,
  bowling_style         text,
  -- batting career stats
  batting_matches       int         not null default 0,
  batting_innings       int         not null default 0,
  batting_runs          int         not null default 0,
  batting_average       numeric(6,2),
  batting_strike_rate   numeric(6,2),
  batting_fifties       int         not null default 0,
  batting_hundreds      int         not null default 0,
  batting_fours         int         not null default 0,
  batting_sixes         int         not null default 0,
  -- bowling career stats
  bowling_matches       int         not null default 0,
  bowling_innings       int         not null default 0,
  bowling_wickets       int         not null default 0,
  bowling_average       numeric(6,2),
  bowling_economy       numeric(5,2),
  bowling_strike_rate   numeric(6,2),
  bowling_five_wickets  int         not null default 0,
  created_at            timestamptz default now() not null,
  updated_at            timestamptz default now() not null
);

-- ─── ball_by_ball ─────────────────────────────────────────────────────────────
create table public.ball_by_ball (
  id              uuid        default uuid_generate_v4() primary key,
  match_id        uuid        not null references public.matches(id) on delete cascade,
  innings         smallint    not null check (innings in (1,2)),
  over_number     smallint    not null check (over_number >= 0),
  ball_number     smallint    not null check (ball_number between 1 and 10), -- 1-6 + extras
  batter_id       uuid        references public.players(id),
  bowler_id       uuid        references public.players(id),
  runs_off_bat    smallint    not null default 0,
  extras          smallint    not null default 0,
  extra_type      text        check (extra_type in ('wide','no_ball','bye','leg_bye')),
  is_wicket       boolean     not null default false,
  wicket_type     text,       -- 'caught','bowled','lbw','run_out','stumped', etc.
  fielder_id      uuid        references public.players(id),
  commentary      text,
  created_at      timestamptz default now() not null
);

-- ─── predictions ──────────────────────────────────────────────────────────────
create table public.predictions (
  id              uuid        default uuid_generate_v4() primary key,
  match_id        uuid        not null references public.matches(id) on delete cascade,
  ball_event_id   uuid        references public.ball_by_ball(id),
  innings         smallint    check (innings in (1,2)),
  over_number     smallint,
  ball_number     smallint,
  win_prob_home   numeric(5,4) not null check (win_prob_home between 0 and 1),
  win_prob_away   numeric(5,4) not null check (win_prob_away between 0 and 1),
  model_version   text        not null default '1.0',
  features        jsonb,
  created_at      timestamptz default now() not null
);

-- ─── user_watchlists ──────────────────────────────────────────────────────────
create table public.user_watchlists (
  id              uuid        default uuid_generate_v4() primary key,
  user_id         uuid        not null references auth.users(id) on delete cascade,
  entity_type     text        not null check (entity_type in ('team','player','tournament')),
  entity_id       text        not null,
  entity_name     text        not null,
  created_at      timestamptz default now() not null,
  unique(user_id, entity_type, entity_id)
);

-- =============================================================================
-- INDEXES — for the queries CricVision runs constantly
-- =============================================================================

-- live match lookups
create index idx_matches_status      on public.matches(status);
create index idx_matches_date_start  on public.matches(date_start desc);
create index idx_matches_tournament  on public.matches(tournament);

-- ball-by-ball queries (sorted per match/innings/over)
create index idx_bbb_match_innings   on public.ball_by_ball(match_id, innings, over_number, ball_number);
create index idx_bbb_batter          on public.ball_by_ball(batter_id);
create index idx_bbb_bowler          on public.ball_by_ball(bowler_id);
create index idx_bbb_created_at      on public.ball_by_ball(created_at desc);

-- predictions per match (for chart data)
create index idx_pred_match_order    on public.predictions(match_id, innings, over_number, ball_number);

-- player search
create index idx_players_name        on public.players using gin(to_tsvector('english', name));
create index idx_players_country     on public.players(country);

-- watchlist per user
create index idx_watchlist_user      on public.user_watchlists(user_id);

-- =============================================================================
-- updated_at AUTO-TRIGGER
-- =============================================================================

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger trg_matches_updated_at
  before update on public.matches
  for each row execute function public.set_updated_at();

create trigger trg_players_updated_at
  before update on public.players
  for each row execute function public.set_updated_at();

-- =============================================================================
-- ROW LEVEL SECURITY (RLS)
-- =============================================================================

-- Enable RLS on all tables
alter table public.matches          enable row level security;
alter table public.players          enable row level security;
alter table public.ball_by_ball     enable row level security;
alter table public.predictions      enable row level security;
alter table public.user_watchlists  enable row level security;

-- ── matches: public read, service-role write ──
create policy "matches_public_read"
  on public.matches for select
  using (true);

create policy "matches_service_write"
  on public.matches for all
  using (auth.role() = 'service_role');

-- ── players: public read, service-role write ──
create policy "players_public_read"
  on public.players for select
  using (true);

create policy "players_service_write"
  on public.players for all
  using (auth.role() = 'service_role');

-- ── ball_by_ball: public read, service-role write ──
create policy "bbb_public_read"
  on public.ball_by_ball for select
  using (true);

create policy "bbb_service_write"
  on public.ball_by_ball for all
  using (auth.role() = 'service_role');

-- ── predictions: public read, service-role write ──
create policy "predictions_public_read"
  on public.predictions for select
  using (true);

create policy "predictions_service_write"
  on public.predictions for all
  using (auth.role() = 'service_role');

-- ── user_watchlists: users own their rows ──
create policy "watchlist_select_own"
  on public.user_watchlists for select
  using (auth.uid() = user_id);

create policy "watchlist_insert_own"
  on public.user_watchlists for insert
  with check (auth.uid() = user_id);

create policy "watchlist_delete_own"
  on public.user_watchlists for delete
  using (auth.uid() = user_id);

-- =============================================================================
-- REALTIME — enable on the two tables the frontend subscribes to
-- =============================================================================

begin;
  -- Add tables to the supabase_realtime publication
  alter publication supabase_realtime add table public.matches;
  alter publication supabase_realtime add table public.ball_by_ball;
  alter publication supabase_realtime add table public.predictions;
commit;
