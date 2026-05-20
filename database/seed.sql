-- =============================================================================
-- SEED DATA — realistic IPL match for local dev / demo
-- =============================================================================

-- Two test players
insert into public.players (id, name, short_name, country, role, batting_style,
  batting_matches, batting_innings, batting_runs, batting_average, batting_strike_rate,
  batting_fifties, batting_hundreds, batting_sixes)
values
  ('11111111-1111-1111-1111-111111111111', 'Virat Kohli', 'V Kohli', 'India', 'batter',
   'Right-hand bat', 237, 230, 7263, 53.4, 131.2, 52, 7, 246),
  ('22222222-2222-2222-2222-222222222222', 'Jasprit Bumrah', 'JJ Bumrah', 'India', 'bowler',
   'Right-hand bat', 135, 12, 56, 9.3, 118.1, 0, 0, 3);

-- One live match
insert into public.matches (
  id, name, short_name, team_home, team_away,
  team_home_short, team_away_short, venue, city,
  status, match_type, tournament,
  score_home, score_away, overs_home, current_innings,
  date_start
) values (
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  'Royal Challengers Bengaluru vs Chennai Super Kings',
  'RCB vs CSK',
  'Royal Challengers Bengaluru', 'Chennai Super Kings',
  'RCB', 'CSK',
  'M. Chinnaswamy Stadium', 'Bengaluru',
  'live', 'T20', 'IPL 2024',
  '142/3', null, 16.0, 1,
  now() - interval '2 hours'
);

-- Seed a few ball events for the live match
insert into public.ball_by_ball
  (match_id, innings, over_number, ball_number, batter_id, bowler_id, runs_off_bat, is_wicket)
values
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 1, 0, 1, '11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222', 4, false),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 1, 0, 2, '11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222', 0, false),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 1, 0, 3, '11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222', 6, false),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 1, 0, 4, '11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222', 1, false),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 1, 0, 5, '11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222', 0, true);

-- Seed a win probability curve for the demo chart
insert into public.predictions (match_id, innings, over_number, ball_number, win_prob_home, win_prob_away, model_version)
select
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  1,
  generate_series(0, 15),
  1,
  -- Simulate a probability curve: starts ~50%, rises to ~67%
  0.5 + (generate_series(0,15)::numeric / 15) * 0.17,
  0.5 - (generate_series(0,15)::numeric / 15) * 0.17,
  '1.0';
