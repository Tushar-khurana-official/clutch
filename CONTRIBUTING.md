# Contributing to Clutch

Thanks for wanting to contribute. Clutch is an open source developer activity dashboard and all contributions are welcome.

---

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/YOUR_USERNAME/clutch.git`
3. Create a branch: `git checkout -b feat/your-feature`
4. Make your changes
5. Push and open a Pull Request to `development`

---

## Branch Strategy

- `main` — stable, deployed
- `development` — active development, all PRs go here
- `feat/xyz` — feature branches, deleted after merge

---

## Commit Convention

We use [Conventional Commits](https://www.conventionalcommits.org/). Write the full word, not abbreviations:
```
feature(scope): add wakatime integration
fix(scope): correct streak calculation on day boundaries
docs(scope): update setup instructions
chore(scope): bump dependencies
test(scope): add github service unit tests
```

---

## Code Style

- Python — PEP8, type hints where possible
- TypeScript — strict mode, functional components, hooks
- CSS — use the existing CSS variables in `index.css`, avoid hardcoded values

---

## Pull Request Guidelines

- Keep PRs focused — one feature or fix per PR
- Write a clear description of what and why
- Add tests for new backend functionality
- Screenshots for UI changes are appreciated

---

## Questions?

Open a discussion or issue on GitHub.