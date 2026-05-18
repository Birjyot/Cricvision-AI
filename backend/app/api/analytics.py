from fastapi import APIRouter

router = APIRouter()

@router.get("/team/{team_id}")
async def get_team_analytics(team_id: str):
    # Mock data for now
    return {
        "team_id": team_id,
        "recent_form": ["W", "W", "L", "W", "L"],
        "win_rate": 0.65,
        "avg_runs": 175.4
    }

@router.get("/player/{player_id}")
async def get_player_analytics(player_id: str):
    return {
        "player_id": player_id,
        "strike_rate": 145.2,
        "avg": 42.5,
        "recent_performances": [45, 12, 88, 34, 102]
    }
