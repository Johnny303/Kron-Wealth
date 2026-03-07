# Kron

Business website with a React frontend and Express backend.

## Project Structure

```
client/          # React SPA (Vite + Tailwind CSS v4)
  src/
    components/  # Reusable UI (layout/Navbar, layout/Footer, layout/Layout)
    pages/       # Route pages (Home, AboutUs, OurApproach, Services, GetInTouch, PrivacyPolicy)
    App.jsx      # Route definitions (react-router-dom v7)
    main.jsx     # Entry point
server/          # Express API server
  index.js       # Server entry (port 3001)
  routes/        # API route handlers (contact.js)
```

## Tech Stack

- **Client:** React 19, React Router v7, Tailwind CSS v4, Vite 7
- **Server:** Express 4, Supabase (database/backend services)
- **Language:** JavaScript (ESM throughout, no TypeScript)

## Commands

### Client (`cd client`)
- `npm run dev` — Start dev server (localhost:5173, proxies /api to :3001)
- `npm run build` — Production build
- `npm run lint` — ESLint
- `npm run preview` — Preview production build

### Server (`cd server`)
- `npm run dev` — Start with file watching (`node --watch`)
- `npm start` — Start without watching

## Conventions

- ESM imports (`import`/`export`) — no CommonJS
- JSX files use `.jsx` extension
- Tailwind v4 via Vite plugin (no `tailwind.config.js` — uses CSS-first configuration)
- API routes mounted under `/api` (e.g., `/api/contact`, `/api/health`)
- Environment variables: `PORT`, `CLIENT_ORIGIN`, plus Supabase keys in `.env`
- `.env` files are gitignored — never commit secrets
