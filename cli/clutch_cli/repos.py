import typer
from rich.console import Console
from rich.table import Table
from clutch_cli.api import get_client

console = Console()


def repos():
    """Show your most recently active repositories."""
    with get_client() as client:
        try:
            response = client.get("/github/repos")
            if response.status_code != 200:
                console.print("[red]❌ Failed to fetch repositories.[/red]")
                raise typer.Exit(1)

            repos_data = response.json()

            table = Table(
                title="📦 Your Repositories",
                border_style="green",
                show_header=True,
                header_style="bold green",
            )

            table.add_column("Repository", style="bold")
            table.add_column("Language")
            table.add_column("Stars", justify="right")
            table.add_column("Forks", justify="right")
            table.add_column("Last Updated")

            for repo in repos_data[:10]:
                table.add_row(
                    repo["name"],
                    repo.get("language") or "—",
                    str(repo.get("stargazers_count", 0)),
                    str(repo.get("forks_count", 0)),
                    repo["updated_at"][:10],
                )

            console.print()
            console.print(table)
            console.print()

        except Exception:
            console.print("[red]❌ Could not connect to Clutch API.[/red]")
            raise typer.Exit(1)