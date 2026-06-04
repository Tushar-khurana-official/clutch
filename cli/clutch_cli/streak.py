import typer
from rich.console import Console
from rich.panel import Panel
from clutch_cli.api import get_client

console = Console()


def streak():
    """Show your current and longest commit streak."""
    with get_client() as client:
        try:
            response = client.get("/github/streak")
            if response.status_code != 200:
                console.print("[red]❌ Failed to fetch streak data.[/red]")
                raise typer.Exit(1)

            data = response.json()
            current = data["current_streak"]
            longest = data["longest_streak"]
            total_active = data["total_active_days"]

            # Emoji based on streak length
            if current >= 30:
                emoji = "🏆"
            elif current >= 14:
                emoji = "🔥"
            elif current >= 7:
                emoji = "⚡"
            elif current > 0:
                emoji = "✅"
            else:
                emoji = "💤"

            console.print(Panel(
                f"{emoji} [bold green]Current Streak:[/bold green] {current} days\n"
                f"🏅 [bold]Longest Streak:[/bold] {longest} days\n"
                f"📅 [bold]Total Active Days:[/bold] {total_active} days",
                title="[bold]Clutch — Streak[/bold]",
                border_style="green",
            ))

        except Exception:
            console.print("[red]❌ Could not connect to Clutch API.[/red]")
            raise typer.Exit(1)