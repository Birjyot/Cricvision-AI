import os
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

class GroqService:
    def __init__(self):
        self.api_key = os.getenv("GROQ_API_KEY")
        if not self.api_key:
            print("Warning: GROQ_API_KEY not found in environment variables.")
        self.client = Groq(api_key=self.api_key) if self.api_key else None

    async def get_chat_response(self, message: str, context: str = ""):
        if not self.client:
            return "GROQ API key not configured. Please add it to your .env file."
        
        try:
            chat_completion = self.client.chat.completions.create(
                messages=[
                    {
                        "role": "system",
                        "content": f"You are CricVision AI, a professional cricket analyst. Provide deep insights, tactical analysis, and clear explanations. Context: {context}"
                    },
                    {
                        "role": "user",
                        "content": message,
                    }
                ],
                model="llama-3.3-70b-versatile",
            )
            return chat_completion.choices[0].message.content
        except Exception as e:
            return f"Error communicating with AI: {str(e)}"

groq_service = GroqService()
