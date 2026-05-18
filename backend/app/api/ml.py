from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional, List
import math

router = APIRouter()

# ---------------------------------------------------------------------------
# Schemas
# ---------------------------------------------------------------------------

class WinProbabilityRequest(BaseModel):
    team_a: str
    team_b: str
    venue: str
    target: Optional[int] = None
    current_score: Optional[int] = None
    current_wickets: Optional[int] = None
    current_over: Optional[float] = None
    batting_team: Optional[str] = None  # which team is batting in 2nd innings

class PlayerForecastRequest(BaseModel):
    player_name: str
    player_role: str  # "batter" | "bowler" | "allrounder"
    recent_scores: Optional[List[int]] = None  # last 5 match scores/wickets

# ---------------------------------------------------------------------------
# Static data — in a production build these would come from Supabase
# ---------------------------------------------------------------------------

TEAM_STRENGTHS = {
    "CSK":  {"batting": 88, "bowling": 85, "fielding": 80, "death_overs": 91},
    "RCB":  {"batting": 85, "bowling": 72, "fielding": 75, "death_overs": 68},
    "MI":   {"batting": 84, "bowling": 83, "fielding": 79, "death_overs": 87},
    "KKR":  {"batting": 80, "bowling": 86, "fielding": 82, "death_overs": 82},
    "DC":   {"batting": 78, "bowling": 79, "fielding": 78, "death_overs": 75},
    "SRH":  {"batting": 82, "bowling": 81, "fielding": 80, "death_overs": 78},
    "PBKS": {"batting": 79, "bowling": 76, "fielding": 74, "death_overs": 72},
    "RR":   {"batting": 83, "bowling": 78, "fielding": 77, "death_overs": 80},
    "GT":   {"batting": 81, "bowling": 84, "fielding": 81, "death_overs": 83},
    "LSG":  {"batting": 80, "bowling": 80, "fielding": 78, "death_overs": 77},
}

VENUE_ADVANTAGES = {
    "MA Chidambaram Stadium": {"batting": 1.05, "bowling": 0.95},
    "Wankhede Stadium":       {"batting": 1.08, "bowling": 0.93},
    "Eden Gardens":            {"batting": 1.02, "bowling": 1.02},
    "M Chinnaswamy Stadium":   {"batting": 1.10, "bowling": 0.90},
    "Arun Jaitley Stadium":    {"batting": 1.03, "bowling": 0.98},
}

HEAD_TO_HEAD = {
    frozenset(["CSK", "RCB"]): {"CSK": 21, "RCB": 12},
    frozenset(["CSK", "MI"]):  {"CSK": 20, "MI": 22},
    frozenset(["MI", "KKR"]):  {"MI": 25, "KKR": 18},
    frozenset(["RCB", "KKR"]): {"RCB": 16, "KKR": 17},
}

# ---------------------------------------------------------------------------
# Helper — base win probability from team strengths + venue + h2h
# ---------------------------------------------------------------------------

def _base_win_probability(team_a: str, team_b: str, venue: str) -> float:
    """Returns probability (0–1) that team_a wins."""
    a = TEAM_STRENGTHS.get(team_a.upper())
    b = TEAM_STRENGTHS.get(team_b.upper())

    if not a or not b:
        # Unknown teams — default to 50/50
        return 0.50

    # Composite strength score
    a_score = (a["batting"] * 0.35 + a["bowling"] * 0.35 + a["fielding"] * 0.15 + a["death_overs"] * 0.15)
    b_score = (b["batting"] * 0.35 + b["bowling"] * 0.35 + b["fielding"] * 0.15 + b["death_overs"] * 0.15)

    # Venue modifier (favour batting-friendly for the stronger batting team)
    venue_mod = VENUE_ADVANTAGES.get(venue, {"batting": 1.0, "bowling": 1.0})
    a_batting_adj = a["batting"] * venue_mod["batting"]
    b_batting_adj = b["batting"] * venue_mod["batting"]
    a_score = a_score * 0.70 + a_batting_adj * 0.30
    b_score = b_score * 0.70 + b_batting_adj * 0.30

    # Head-to-head adjustment (±3%)
    h2h = HEAD_TO_HEAD.get(frozenset([team_a.upper(), team_b.upper()]))
    h2h_bonus = 0.0
    if h2h:
        total = sum(h2h.values())
        a_wins = h2h.get(team_a.upper(), total // 2)
        h2h_bonus = (a_wins / total - 0.5) * 0.06  # max ±3% swing

    raw_prob = a_score / (a_score + b_score) + h2h_bonus
    return max(0.05, min(0.95, raw_prob))


def _live_win_probability(
    target: int,
    current_score: int,
    current_wickets: int,
    current_over: float,
    base_prob: float,
) -> float:
    """
    Adjust 1st-innings base probability using a simple run-rate model for
    2nd-innings chasing scenarios.
    """
    overs_remaining = 20.0 - current_over
    runs_needed = target - current_score
    wickets_remaining = 10 - current_wickets

    if runs_needed <= 0:
        return 0.95  # chasing team has won / very close to winning
    if overs_remaining <= 0 or wickets_remaining <= 0:
        return 0.05  # bowling team wins

    required_rr = runs_needed / overs_remaining
    typical_max_rr = 12.0  # hardest achievable run-rate

    # Sigmoid scaling: how hard is the chase?
    difficulty = required_rr / typical_max_rr
    # Wicket pressure: losing wickets hurts exponentially
    wicket_factor = math.pow(wickets_remaining / 10.0, 0.5)

    chase_prob = wicket_factor * (1 - difficulty)
    chase_prob = max(0.05, min(0.95, chase_prob))

    # Blend with base team strength (60% live situation, 40% base)
    blended = chase_prob * 0.60 + base_prob * 0.40
    return round(blended, 4)


# ---------------------------------------------------------------------------
# Endpoints
# ---------------------------------------------------------------------------

@router.post("/win-probability")
async def predict_win_probability(request: WinProbabilityRequest):
    """
    Predict win probability for a T20 match.
    Supports both pre-match and live (2nd innings) scenarios.
    """
    team_a = request.team_a.strip()
    team_b = request.team_b.strip()
    venue  = request.venue.strip()

    base_prob = _base_win_probability(team_a, team_b, venue)

    # --- Live scenario (2nd innings chase) ---
    if all(v is not None for v in [request.target, request.current_score,
                                    request.current_wickets, request.current_over]):
        chasing_team = request.batting_team or team_b
        defending_team = team_a if chasing_team == team_b else team_b

        chase_base = base_prob if chasing_team == team_a else (1 - base_prob)
        live_prob = _live_win_probability(
            target=request.target,
            current_score=request.current_score,
            current_wickets=request.current_wickets,
            current_over=request.current_over,
            base_prob=chase_base,
        )
        return {
            "mode": "live",
            "chasing_team": chasing_team,
            "defending_team": defending_team,
            "probability_chasing": round(live_prob * 100, 1),
            "probability_defending": round((1 - live_prob) * 100, 1),
            "runs_needed": request.target - request.current_score,
            "required_run_rate": round((request.target - request.current_score) / max(0.1, 20 - request.current_over), 2),
            "key_factors": [
                f"Required run rate: {round((request.target - request.current_score) / max(0.1, 20 - request.current_over), 2)} per over",
                f"{10 - request.current_wickets} wickets in hand",
                f"{round(20 - request.current_over, 1)} overs remaining",
            ],
        }

    # --- Pre-match scenario ---
    team_a_strength = TEAM_STRENGTHS.get(team_a.upper())
    team_b_strength = TEAM_STRENGTHS.get(team_b.upper())

    predicted_score_a = 160 + (team_a_strength["batting"] - 80) * 0.8 if team_a_strength else 170
    predicted_score_b = 160 + (team_b_strength["batting"] - 80) * 0.8 if team_b_strength else 170

    return {
        "mode": "pre_match",
        "team_a": team_a,
        "team_b": team_b,
        "venue": venue,
        "probability_a": round(base_prob * 100, 1),
        "probability_b": round((1 - base_prob) * 100, 1),
        "predicted_score_a": f"{int(predicted_score_a) - 8}–{int(predicted_score_a) + 12}",
        "predicted_score_b": f"{int(predicted_score_b) - 8}–{int(predicted_score_b) + 12}",
        "key_factors": [
            f"Team strength differential: {abs(round(base_prob * 100 - 50, 1))}% edge",
            f"Venue: {venue or 'Neutral'}",
            "Head-to-head record included in model",
        ],
        "confidence": round(70 + abs(base_prob - 0.5) * 60, 1),
    }


@router.get("/player-forecast/{player_name}")
async def player_performance_forecast(player_name: str, role: str = "batter"):
    """
    Forecast player performance for the next match based on historical patterns.
    """
    PLAYER_STATS = {
        "kohli": {
            "name": "Virat Kohli", "team": "RCB", "role": "batter",
            "avg": 48.2, "strike_rate": 138.5, "recent": [76, 12, 45, 88, 34],
        },
        "dhoni": {
            "name": "MS Dhoni", "team": "CSK", "role": "wk-batter",
            "avg": 39.1, "strike_rate": 155.8, "recent": [44, 12, 71, 28, 55],
        },
        "bumrah": {
            "name": "Jasprit Bumrah", "team": "MI", "role": "bowler",
            "avg_wickets": 2.1, "economy": 7.4, "recent": [3, 1, 2, 4, 2],
        },
        "russell": {
            "name": "Andre Russell", "team": "KKR", "role": "allrounder",
            "avg": 29.5, "strike_rate": 177.2, "recent": [55, 92, 11, 68, 24],
        },
    }

    key = player_name.lower().replace(" ", "").replace(".", "")
    player = next((v for k, v in PLAYER_STATS.items() if k in key or key in k), None)

    if not player:
        # Generic fallback
        return {
            "player": player_name,
            "predicted_runs": 35,
            "confidence_interval": [18, 55],
            "strike_rate_forecast": 132.0,
            "form_trend": "stable",
        }

    recent = player.get("recent", [35, 35, 35, 35, 35])
    weighted_avg = sum(r * w for r, w in zip(reversed(recent), [0.30, 0.25, 0.20, 0.15, 0.10]))
    overall_avg  = player.get("avg", 35)
    predicted    = round(weighted_avg * 0.65 + overall_avg * 0.35, 1)

    # Trend detection
    recent_3 = sum(recent[-3:]) / 3
    recent_2 = sum(recent[:2]) / 2
    trend = "improving" if recent_3 > recent_2 * 1.1 else ("declining" if recent_3 < recent_2 * 0.9 else "stable")

    stddev = math.sqrt(sum((r - predicted) ** 2 for r in recent) / len(recent))

    if player["role"] == "bowler":
        return {
            "player": player.get("name", player_name),
            "team": player.get("team", ""),
            "role": player["role"],
            "predicted_wickets": round(player["avg_wickets"] * (1.1 if trend == "improving" else 0.9 if trend == "declining" else 1.0), 1),
            "economy_forecast": player.get("economy", 8.0),
            "recent_wickets": recent,
            "form_trend": trend,
        }

    return {
        "player": player.get("name", player_name),
        "team": player.get("team", ""),
        "role": player["role"],
        "predicted_runs": predicted,
        "confidence_interval": [max(0, round(predicted - stddev)), round(predicted + stddev)],
        "strike_rate_forecast": player.get("strike_rate", 130.0),
        "recent_scores": recent,
        "form_trend": trend,
        "fantasy_value": "high" if predicted > 50 else "medium" if predicted > 25 else "low",
    }
