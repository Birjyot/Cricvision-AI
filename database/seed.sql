-- Mock Data for CricVision AI

-- Insert Teams
INSERT INTO teams (name, short_name, logo_url) VALUES
('Royal Challengers Bangalore', 'RCB', 'https://placeholder.com/rcb'),
('Chennai Super Kings', 'CSK', 'https://placeholder.com/csk'),
('Mumbai Indians', 'MI', 'https://placeholder.com/mi');

-- Insert Players
INSERT INTO players (name, team_id, role, batting_style)
SELECT 'Virat Kohli', id, 'Batter', 'Right Hand' FROM teams WHERE short_name = 'RCB';

INSERT INTO players (name, team_id, role, batting_style)
SELECT 'MS Dhoni', id, 'Wicketkeeper', 'Right Hand' FROM teams WHERE short_name = 'CSK';

INSERT INTO players (name, team_id, role, bowling_style)
SELECT 'Jasprit Bumrah', id, 'Bowler', 'Right Arm Fast' FROM teams WHERE short_name = 'MI';
