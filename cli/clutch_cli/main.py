import typer
from clutch_cli import auth, streak, stats, insight, repos, patterns

app = typer.Typer(
    name="clutch",
    help="GitHub tracks your work. Clutch tracks you.",
    no_args_is_help=True,
)

app.add_typer(auth.app, name="auth")
app.command()(streak.streak)
app.command()(stats.stats)
app.command()(insight.insight)
app.command()(repos.repos)
app.command()(patterns.patterns)


if __name__ == "__main__":
    app()