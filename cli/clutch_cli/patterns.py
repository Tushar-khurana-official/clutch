import typer
from rich.console import Console
from rich.panel import Panel
from rich.table import Table
from clutch_cli.api import get_client

console = Console()


def patterns():
    """Show your coding patterns and habits."""
    with get_client() as client:
        try:
            console.print("[dim]Analyzing your coding patterns...[/dim]")

            response = client.get("/insights/patterns")
            if response.status_code != 200:
                console.print("[red]❌ Failed to fetch patterns.[/red]")
                raise typer.Exit(1)

            data = response.json()

            if "message" in data:
                console.print(f"[yellow]{data['message']}[/yellow]")
                raise typer.Exit()

            # Summary panel
            console.print(Panel(
                f"📅 [bold]Best Day:[/bold] {data['best_day']}\n"
                f"📉 [bold]Worst Day:[/bold] {data['worst_day']}\n"
                f"💯 [bold]Consistency Score:[/bold] {data['consistency_score']}%\n"
                f"📊 [bold]Avg Daily Commits:[/bold] {data['avg_daily_commits']}\n"
                f"🗓️  [bold]Total Active Days:[/bold] {data['total_active_days']}",
                title="[bold]Clutch — Coding Patterns[/bold]",
                border_style="green",
            ))

            # Day distribution table
            table = Table(
                title="📆 Commits by Day of Week",
                border_style="green",
                show_header=True,
                header_style="bold green",
            )
            table.add_column("Day", style="bold")
            table.add_column("Commits", justify="right")
            table.add_column("Activity")

            max_commits = max(data["day_distribution"].values()) or 1
            for day, commits in data["day_distribution"].items():
                bar_length = int((commits / max_commits) * 20)
                bar = "█" * bar_length
                table.add_row(day, str(commits), f"[green]{bar}[/green]")

            console.print()
            console.print(table)

            # Top repos
            if data.get("top_repos"):
                console.print()
                top_table = Table(
                    title="🏆 Most Active Repositories",
                    border_style="green",
                    show_header=True,
                    header_style="bold green",
                )
                top_table.add_column("Repository", style="bold")
                top_table.add_column("Active Days", justify="right")

                for repo in data["top_repos"]:
                    top_table.add_row(
                        repo["repo"],
                        str(repo["days_active"]),
                    )
                console.print(top_table)

            console.print()

        except Exception:
            console.print("[red]❌ Could not connect to Clutch API.[/red]")
            raise typer.Exit(1)