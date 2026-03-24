# Kron

Business website for Kron Wealth — React frontend with Express backend, deployed to GitHub Pages.

## Project Structure

```
client/                      # React SPA (Vite + Tailwind CSS v4)
  src/
    components/
      layout/
        Layout.jsx           # Main layout wrapper (Navbar + Outlet + Footer)
        Navbar.jsx            # Scroll-spy navigation with mobile menu
        Footer.jsx            # Site footer
      AnimatedHourglass.jsx   # Lazy-loaded video hourglass (responsive mp4/webm)
      LenisProvider.jsx       # Smooth scrolling context provider (Lenis + snap)
      LottieScrollPlayer.jsx  # Lottie animation player
      ScrollAnimations.jsx    # FadeInUp, FadeIn, ParallaxLayer, StaggerChildren, etc.
      ScrollPath.jsx          # Animated SVG path component
    pages/
      HomePage.jsx            # Composes all sections into single-page layout
      PrivacyPolicy.jsx       # Privacy policy page
    sections/
      HeroSection.jsx         # Full-screen hero with animated hourglass
      AboutSection.jsx        # Founder section with parallax image
      ApproachSection.jsx     # "Our Approach" with animated cards & river-path layout
      ServicesSection.jsx     # Services showcase
      ContactSection.jsx     # Contact form
    App.jsx                   # Route definitions (react-router-dom v7)
    main.jsx                  # Entry point (BrowserRouter, LenisProvider)
    index.css                 # Tailwind v4 theme, custom colors, fonts
  public/
    images/                   # hero-hourglass.jpg, kron-logo-full.png, kron-signature.png
    videos/                   # hourglass.mp4/webm, hourglass-mobile.mp4/webm
    fonts/                    # RetroSignature.otf (custom display font)
    lottie/                   # Lottie animation files
server/                       # Express API server
  index.js                    # Server entry (port 3001, CORS, routes)
  lib/supabase.js             # Supabase client initialization
  routes/contact.js           # POST /api/contact (validate + insert to Supabase)
```

## Tech Stack

- **Client:** React 19, React Router v7, Tailwind CSS v4, Vite 7
- **Animations:** Motion (Framer Motion v12), Lenis (smooth scrolling + snap), LottieFiles
- **Server:** Express 4, Supabase (database/backend services)
- **Deployment:** GitHub Pages (base path `/Kron-Wealth/`, GitHub Actions CI/CD)
- **Language:** JavaScript (ESM throughout, no TypeScript)

## Theme

- **Colors:** `--color-kron-green: #10312C`, `--color-kron-gold: #B97A45`, `--color-kron-sage: #C1CCC5`, `--color-kron-mist: #ECF3F4`, `--color-kron-brown: #3F3025`
- **Fonts:** RetroSignature (display/cursive), Georgia (body/serif)

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
- Tailwind v4 via Vite plugin (no `tailwind.config.js` — uses CSS-first configuration in `index.css`)
- API routes mounted under `/api` (e.g., `/api/contact`, `/api/health`)
- Scroll animations use Motion's `useInView` / `useScroll` with IntersectionObserver for lazy loading
- Responsive video: separate mobile/desktop variants loaded via `<source>` elements
- Environment variables: `PORT`, `CLIENT_ORIGIN`, plus Supabase keys in `.env`
- `.env` files are gitignored — never commit secrets
