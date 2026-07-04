# Ineffable Backend

Express + MongoDB backend for the frontend.

## Setup
1. Copy `.env.example` to `.env`.
2. Set `MONGODB_URI`.
3. Install dependencies and run `npm run dev`.

## API
- `GET /api/health`
- `GET /api/minecraft-status`
- `GET /api/journals`
- `POST /api/journals`
- `DELETE /api/journals/:id`
- `DELETE /api/journals/all`
- `GET /api/tickets`
- `POST /api/tickets`
- `DELETE /api/tickets/:id`
- `GET /api/config`
- `POST /api/config`
- `GET /api/audit-logs`
- `POST /api/audit-logs`
- `POST /api/audit-logs/clear`
- `POST /api/checkout`
- `GET /api/auth/discord/url`
