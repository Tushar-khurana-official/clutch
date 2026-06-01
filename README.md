# • Clutch — Developer Activity Dashboard

> Connect to your coding pulse. Track commits, streaks, and get AI-powered insights from your GitHub activity.

![License](https://img.shields.io/badge/license-MIT-green)
![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen)
![FastAPI](https://img.shields.io/badge/FastAPI-0.115-009688)
![React](https://img.shields.io/badge/React-18-61DAFB)

---

## What is Clutch?

Clutch is an open source developer dashboard that connects to your GitHub and gives you:

- **Commit streaks** — track your daily consistency
- **Activity charts** — visualize your last 30 days of work
- **AI weekly insights** — get honest, encouraging summaries of your coding week
- **Coding patterns** — discover your most productive days and languages
- **Public profiles** — share your activity at `clutch.app/u/username`

---

## Tech Stack

| Layer | Tech |
|-------|------|
| Backend | FastAPI, SQLAlchemy, PostgreSQL |
| Frontend | React, TypeScript, Tailwind CSS, Recharts |
| Auth | GitHub OAuth + JWT |
| AI | Groq (llama-3.1-8b-instant) |
| Deploy | Render (backend) + Vercel (frontend) |

---

## Project Structure
```
clutch/
├── backend/        # FastAPI + SQLAlchemy
└── frontend/       # React + TypeScript + Tailwind

```
---

## Contributing

We love contributions! See [CONTRIBUTING.md](./CONTRIBUTING.md) for the full guide.

---

## License

MIT — free to use, modify, and distribute.

---

Built with ❤️ for the developer community.