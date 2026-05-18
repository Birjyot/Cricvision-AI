from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import analytics, chat, ml, auth

app = FastAPI(title="CricVision AI API", version="1.0.0")

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, replace with frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Welcome to CricVision AI API", "status": "online"}

# Include Routers
app.include_router(analytics.router, prefix="/api/analytics", tags=["Analytics"])
app.include_router(chat.router, prefix="/api/chat", tags=["AI Assistant"])
app.include_router(ml.router, prefix="/api/ml", tags=["Machine Learning"])
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
