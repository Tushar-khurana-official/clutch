import httpx
from datetime import datetime, timedelta


class GitHubService:
    BASE_URL = "https://api.github.com"

    def __init__(self, access_token: str):
        self.access_token = access_token
        self.headers = {
            "Authorization": f"Bearer {access_token}",
            "Accept": "application/vnd.github+json",
        }

    async def get_activity(self, username: str, days: int = 30) -> dict:
        """Fetch user's GitHub events for the past N days."""
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{self.BASE_URL}/users/{username}/events?per_page=100",
                headers=self.headers,
            )
            events = response.json()

        # Process events into daily buckets
        daily = {}
        for event in events:
            date = event["created_at"][:10]  # YYYY-MM-DD
            if date not in daily:
                daily[date] = {
                    "date": date,
                    "commits": 0,
                    "prs": 0,
                    "issues": 0,
                    "reviews": 0,
                    "repos": set(),
                }
            if event["type"] == "PushEvent":
                daily[date]["commits"] += event["payload"].get("size", 0)
                daily[date]["repos"].add(event["repo"]["name"])
            elif event["type"] == "PullRequestEvent":
                daily[date]["prs"] += 1
            elif event["type"] == "IssuesEvent":
                daily[date]["issues"] += 1
            elif event["type"] == "PullRequestReviewEvent":
                daily[date]["reviews"] += 1

        # Convert sets to lists for JSON serialization
        for day in daily.values():
            day["repos"] = list(day["repos"])

        return {
            "username": username,
            "days": days,
            "daily_activity": list(daily.values()),
            "total_commits": sum(d["commits"] for d in daily.values()),
            "total_prs": sum(d["prs"] for d in daily.values()),
            "total_issues": sum(d["issues"] for d in daily.values()),
            "active_days": len(daily),
        }