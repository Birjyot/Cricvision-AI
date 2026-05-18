from fastapi import APIRouter

router = APIRouter()

@router.get("/me")
async def get_current_user():
    return {"id": "user_123", "email": "user@example.com", "name": "Cricket Fan"}
