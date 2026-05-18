from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional

from app.services.groq_service import groq_service

router = APIRouter()

class ChatRequest(BaseModel):
    message: str
    context: Optional[str] = ""

@router.post("/query")
async def chat_with_assistant(request: ChatRequest):
    response = await groq_service.get_chat_response(request.message, request.context)
    return {
        "response": response,
        "suggested_questions": ["How did Kohli perform?", "Compare RCB vs CSK", "Win probability?"]
    }
