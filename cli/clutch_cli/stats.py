import typer
from rich.console import Console
from rich.panel import Panel
from rich.table import Table
from clutch_cli.api import get_client

console = Console()


def stats(days: int = typer.Option(30, help="Number of days to look back.")):
    """Show your GitHub activity stats."""
    with get_client() as client:
        try:
            response = client.get(f"/github/activity?days={days}")
            if response.status_code != 200:
                console.print("[red]❌ Failed to fetch activity data.[/red]")
                raise typer.Exit(1)

            data = response.json()

            table = Table(
                title=f"📊 Your Stats — Last {days} Days",
                border_style="green",
                show_header=True,
                header_style="bold green",
            )

            table.add_column("Metric", style="bold")
            table.add_column("Count", justify="right")

            table.add_row("Total Commits", str(data["total_commits"]))
            table.add_row("Pull Requests", str(data["total_prs"]))
            table.add_row("Issues", str(data["total_issues"]))
            table.add_row("Active Days", str(data["active_days"]))

            console.print()
            console.print(table)
            console.print()

        except Exception:
            console.print("[red]❌ Could not connect to Clutch API.[/red]")
            raise typer.Exit(1)