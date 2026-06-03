import httpx
from datetime import datetime, timedelta
from sqlalchemy.orm import Session

from app.settings import settings
from app.models.user import User
from app.models.activity import DailyActivity


class InsightsService:
    GROQ_URL = "https://api.groq.com/openai/v1/chat/completions"
    MODEL = "llama-3.1-8b-instant"

    async def _call_groq(self, prompt: str) -> str:
        """Call Groq API and return the response text."""
        async with httpx.AsyncClient() as client:
            response = await client.post(
                self.GROQ_URL,
                headers={
                    "Authorization": f"Bearer {settings.GROQ_API_KEY}",
                    "Content-Type": "application/json",
                },
                json={
                    "model": self.MODEL,
                    "messages": [{"role": "user", "content": prompt}],
                    "max_tokens": 500,
                    "temperature": 0.7,
                },
                timeout=30,
            )
            data = response.json()
            return data["choices"][0]["message"]["content"]

    async def generate_weekly_insight(self, user: User, db: Session) -> dict:
        """Generate AI weekly insight for a user."""
        week_start = (datetime.utcnow() - timedelta(days=7)).date()

        activities = (
            db.query(DailyActivity)
            .filter(
                DailyActivity.user_id == user.id,
                DailyActivity.date >= week_start,
            )
            .all()
        )

        if not activities:
            return {
                "message": "No activity data yet. Run /github/sync first."
            }

        stats = {
            "total_commits": sum(a.commits for a in activities),
            "total_prs": sum(a.prs_opened for a in activities),
            "total_issues": sum(a.issues_opened for a in activities),
            "active_days": len([a for a in activities if a.commits > 0]),
            "best_day": max(activities, key=lambda a: a.commits).date.strftime("%A"),
        }

        prompt = f"""
You are a developer productivity coach analyzing a developer's GitHub activity.

Developer: {user.username}
Past 7 days:
- Total commits: {stats['total_commits']}
- Pull requests opened: {stats['total_prs']}
- Issues opened: {stats['total_issues']}
- Active days: {stats['active_days']} out of 7
- Most productive day: {stats['best_day']}

Write a short, honest, and encouraging weekly summary in 3-4 sentences.
Be specific about patterns you notice. End with one actionable suggestion.
Keep it casual and human, not corporate.
"""
        summary = await self._call_groq(prompt)

        return {
            "week_start": str(week_start),
            "stats": stats,
            "ai_summary": summary,
            "generated_by": "groq/llama-3.1-8b-instant",
        }