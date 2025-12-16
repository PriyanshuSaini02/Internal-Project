# Frontend (Vite + React)

Admin UI for authentication and user management, wired to the backend REST API.

## Prerequisites
- Node.js 18+

## Install & Run
```bash
cd frontend
npm install
npm run dev   # starts Vite dev server
```

## Environment
Create `frontend/.env` (or use `.env.local`):
```
VITE_API_URL=http://localhost:3000/api   # backend base URL
```
If your backend runs on another port, update the value accordingly.

## Available Scripts
- `npm run dev` – start dev server
- `npm run build` – production build
- `npm run preview` – preview built app
- `npm run lint` – lint sources

## Features
- Admin auth: login, register, forgot/reset password
- Protected routes via JWT
- User CRUD: list, search, create, edit, delete
- Profile picture upload
- Responsive, modern UI with spinners/alerts

## Routing (SPA)
- `/login`, `/register`, `/forgot-password`, `/reset-password/:token`
- `/dashboard`, `/users/add`, `/users/:id`, `/users/:id/edit`

## Notes
- The reset password link in emails should point to `/reset-password/:token`.
- API base URL comes from `VITE_API_URL`; defaults to `http://localhost:3000/api` if unset.
