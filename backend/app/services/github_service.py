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

    async def get_streak(self, username: str) -> dict:
        """Calculate current and longest commit streak."""
        activity = await self.get_activity(username, days=365)
        active_dates = set(
            d["date"] for d in activity["daily_activity"] if d["commits"] > 0
        )

        # Calculate current streak
        current_streak = 0
        check_date = datetime.utcnow().date()
        while str(check_date) in active_dates:
            current_streak += 1
            check_date -= timedelta(days=1)

        # Calculate longest streak
        longest_streak = 0
        temp_streak = 0
        for i in range(365):
            date = str((datetime.utcnow() - timedelta(days=i)).date())
            if date in active_dates:
                temp_streak += 1
                longest_streak = max(longest_streak, temp_streak)
            else:
                temp_streak = 0

        return {
            "current_streak": current_streak,
            "longest_streak": longest_streak,
            "total_active_days": len(active_dates),
        }

    async def get_language_breakdown(self, username: str) -> dict:
        """Get language usage across user's repositories."""
        async with httpx.AsyncClient() as client:
            repos_response = await client.get(
                f"{self.BASE_URL}/user/repos?per_page=50&sort=updated",
                headers=self.headers,
            )
            repos = repos_response.json()

        languages = {}
        async with httpx.AsyncClient() as client:
            for repo in repos[:20]:  # Limit to top 20 repos
                lang_response = await client.get(
                    f"{self.BASE_URL}/repos/{repo['full_name']}/languages",
                    headers=self.headers,
                )
                repo_langs = lang_response.json()
                for lang, bytes_count in repo_langs.items():
                    languages[lang] = languages.get(lang, 0) + bytes_count

        total = sum(languages.values()) or 1
        return {
            lang: {
                "bytes": bytes_count,
                "percentage": round((bytes_count / total) * 100, 2),
            }
            for lang, bytes_count in sorted(
                languages.items(), key=lambda x: x[1], reverse=True
            )
        }

    async def sync_to_db(self, user, db) -> int:
        """Sync GitHub activity to the database."""
        from app.models.activity import DailyActivity

        activity = await self.get_activity(user.username, days=30)

        synced = 0
        for day_data in activity["daily_activity"]:
            day_date = datetime.strptime(day_data["date"], "%Y-%m-%d").date()
            existing = (
                db.query(DailyActivity)
                .filter(
                    DailyActivity.user_id == user.id,
                    DailyActivity.date == day_date,
                )
                .first()
            )
            if existing:
                existing.commits = day_data["commits"]
                existing.prs_opened = day_data["prs"]
                existing.issues_opened = day_data["issues"]
                existing.reviews = day_data["reviews"]
                existing.repos_contributed = day_data["repos"]
            else:
                new_activity = DailyActivity(
                    user_id=user.id,
                    date=day_date,
                    commits=day_data["commits"],
                    prs_opened=day_data["prs"],
                    issues_opened=day_data["issues"],
                    reviews=day_data["reviews"],
                    repos_contributed=day_data["repos"],
                )
                db.add(new_activity)
            synced += 1

        user.last_synced_at = datetime.utcnow()
        db.commit()
        return synced