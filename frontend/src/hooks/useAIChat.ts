import { useState, useCallback } from 'react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  isError?: boolean;
}

const INITIAL_MESSAGE: Message = {
  role: 'assistant',
  content: "Hello! I'm your CricVision AI Analyst. How can I help you decode today's match data?",
};

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export const useAIChat = () => {
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30s timeout

      const response = await fetch(`${API_BASE}/api/chat/query`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: content }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errText = await response.text().catch(() => `HTTP ${response.status}`);
        throw new Error(errText || `HTTP ${response.status}`);
      }

      const data = await response.json();
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: data.response || "I'm sorry, I couldn't process that request.",
        },
      ]);
    } catch (error: unknown) {
      let msg = 'Error connecting to AI service. Make sure the backend is running on port 8000.';
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          msg = 'Request timed out. The AI took too long to respond — please try again.';
        } else if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
          msg = 'Cannot reach the backend. Run: `venv\\Scripts\\python -m uvicorn app.main:app --port 8000` in the backend folder.';
        } else {
          msg = `AI Error: ${error.message}`;
        }
      }
      setMessages((prev) => [...prev, { role: 'assistant', content: msg, isError: true }]);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading]);

  const clearMessages = useCallback(() => {
    setMessages([INITIAL_MESSAGE]);
  }, []);

  return { messages, sendMessage, isLoading, clearMessages };
};
