# Kron Wealth — Single-Page Parallax Scroll Conversion Plan

## Overview

Convert the multi-page React site into a single-page parallax scroll experience with smooth scrolling, scroll-triggered animations, sticky elements, and Lottie animations. Privacy Policy stays as a separate route.

---

## Step 1: Install Dependencies

```bash
cd client
npm install motion lenis @lottiefiles/dotlottie-react
```

- **motion** (v12+) — scroll-triggered animations, `useScroll`, `useTransform`, parallax
- **lenis** — smooth scroll engine
- **@lottiefiles/dotlottie-react** — Lottie animations

> No GSAP. Motion.dev handles both parallax and animations.

---

## Step 2: New File Structure

```
client/src/
  App.jsx                    ← MODIFY (two routes: "/" and "/privacy")
  main.jsx                   ← MODIFY (add Lenis provider)
  index.css                  ← MODIFY (Lenis styles, scroll-margin for sections)

  sections/                  ← NEW directory
    HeroSection.jsx          ← NEW (from Home.jsx hero)
    AboutSection.jsx         ← NEW (from AboutUs.jsx)
    ApproachSection.jsx      ← NEW (from OurApproach.jsx)
    ServicesSection.jsx       ← NEW (from Services.jsx)
    ContactSection.jsx       ← NEW (from GetInTouch.jsx — keeps form + POST)

  components/layout/
    Navbar.jsx               ← MODIFY (anchor links + scroll-spy)
    Layout.jsx               ← MODIFY (remove scroll-to-top on route change)
    Footer.jsx               ← MODIFY (anchor links instead of router Links)

  components/
    ScrollAnimations.jsx     ← NEW (reusable motion wrappers: FadeInUp, ParallaxLayer, StaggerChildren)
    LenisProvider.jsx        ← NEW (Lenis smooth scroll setup)
    LottieScrollPlayer.jsx   ← NEW (Lottie animation tied to scroll progress)

  pages/
    HomePage.jsx             ← NEW (assembles all sections in order)
    PrivacyPolicy.jsx        ← KEEP (unchanged)
    Home.jsx                 ← DELETE after migration
    AboutUs.jsx              ← DELETE after migration
    OurApproach.jsx          ← DELETE after migration
    Services.jsx             ← DELETE after migration
    GetInTouch.jsx           ← DELETE after migration
```

---

## Step 3: File-by-File Changes

### 3.1 `components/LenisProvider.jsx` (NEW)

- Initialize Lenis smooth scroll
- Wrap children with Lenis context
- Integrate with Motion.dev's `useScroll` via the `requestAnimationFrame` loop
- Export `useLenis` hook for programmatic scrolling (e.g., navbar clicks)

```jsx
// Creates a Lenis instance, runs its RAF loop,
// provides scrollTo functionality to Navbar
```

### 3.2 `components/ScrollAnimations.jsx` (NEW)

Reusable scroll-triggered animation wrappers using `motion` and `useInView`:

- **`FadeInUp`** — fades in and slides up when element enters viewport
- **`FadeIn`** — simple fade on scroll
- **`ParallaxLayer`** — uses `useScroll` + `useTransform` to move element at different rate (configurable speed prop)
- **`StaggerChildren`** — staggers children animation on scroll into view
- **`ScaleOnScroll`** — scales element based on scroll progress

### 3.3 `components/LottieScrollPlayer.jsx` (NEW)

- Takes a `.lottie` URL and a ref to the scroll container
- Uses `useScroll` to get scroll progress in the section
- Maps scroll progress to Lottie frame via `useTransform`
- Uses `@lottiefiles/dotlottie-react` `DotLottieReact` component

### 3.4 `sections/HeroSection.jsx` (NEW — from Home.jsx)

- `id="hero"` for anchor linking
- **Parallax**: Background gradient layers move at different speeds using `ParallaxLayer` (speed: 0.3, 0.5, 0.7)
- **Lottie**: Subtle background animation (abstract geometric/financial pattern) behind the text, opacity 0.15, reacting to scroll
- **Animations**: Title words stagger in on load (not scroll — immediate), subtitle fades in after
- **Sticky**: None for hero (it scrolls naturally)
- Remove `<Link>` components, replace with anchor `<a href="#about">` and `<a href="#contact">`
- Keep bottom fade gradient

### 3.5 `sections/AboutSection.jsx` (NEW — from AboutUs.jsx)

- `id="about"` for anchor linking
- Combines the founder section + philosophy from AboutUs.jsx (skip the page header since it's now a scroll section)
- **Section header**: "About Us" title with `FadeInUp` animation
- **Parallax**: The founder headshot placeholder has slight parallax offset (moves slower than text)
- **Animations**:
  - Text paragraphs stagger in with `FadeInUp`
  - The emerald-to-gold accent bar animates width from 0 to full on scroll
  - Philosophy section fades in separately
- **Sticky**: Founder image sticks briefly while text scrolls alongside (using CSS `position: sticky` with top offset, only on desktop)
- Replace `<Link>` with anchor `<a>` tags

### 3.6 `sections/ApproachSection.jsx` (NEW — from OurApproach.jsx)

- `id="approach"` for anchor linking
- **Section header**: "Our Approach" with `FadeInUp`
- **Parallax**: Step number circles have subtle parallax (slightly different speeds)
- **Animations**:
  - Each step card staggers in using `StaggerChildren` — appears one by one as user scrolls
  - The connector lines animate (draw-in effect) between steps using `motion` `pathLength`
  - Step numbers scale up slightly on scroll
- **Sticky**: On desktop, the section title stays sticky at the top while the 4 steps scroll through
- **Lottie**: Small animated icon for each step (optional — use simple CSS animations as fallback if no suitable Lottie files)
- Replace `<Link>` with anchor tags

### 3.7 `sections/ServicesSection.jsx` (NEW — from Services.jsx)

- `id="services"` for anchor linking
- **Section header**: "Our Services" with `FadeInUp`
- **Animations**:
  - Service cards use `StaggerChildren` — cards appear in a staggered grid pattern
  - Cards have hover parallax tilt effect (subtle 3D rotation using `motion` `whileHover`)
  - Icons rotate/pulse slightly on card entry
- **Parallax**: Subtle background movement (decorative gradient blobs)
- **Lottie**: Section divider between intro text and cards — a subtle financial/growth animation
- Replace `<Link>` with anchor tags

### 3.8 `sections/ContactSection.jsx` (NEW — from GetInTouch.jsx)

- `id="contact"` for anchor linking
- **Keep all form logic** (useState, handleSubmit, POST to `/api/contact`) — copy directly from GetInTouch.jsx
- **Animations**:
  - Contact info slides in from left with `FadeInUp`
  - Form slides in from right
  - Form fields stagger in
  - Submit button has a subtle pulse animation
- **Parallax**: Light background gradient shifts on scroll
- No `<Link>` tags needed (no navigation CTAs in contact section)

### 3.9 `pages/HomePage.jsx` (NEW)

```jsx
import HeroSection from '../sections/HeroSection'
import AboutSection from '../sections/AboutSection'
import ApproachSection from '../sections/ApproachSection'
import ServicesSection from '../sections/ServicesSection'
import ContactSection from '../sections/ContactSection'

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <AboutSection />
      <ApproachSection />
      <ServicesSection />
      <ContactSection />
    </>
  )
}
```

### 3.10 `App.jsx` (MODIFY)

```jsx
import { Routes, Route } from 'react-router-dom'
import Layout from './components/layout/Layout'
import HomePage from './pages/HomePage'
import PrivacyPolicy from './pages/PrivacyPolicy'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
      </Route>
    </Routes>
  )
}
```

### 3.11 `main.jsx` (MODIFY)

- Wrap `<App />` with `<LenisProvider>` for smooth scrolling

### 3.12 `index.css` (MODIFY)

- Remove `scroll-behavior: smooth` from `html` (Lenis handles this)
- Add `scroll-margin-top: 64px` (navbar height) on section `[id]` selectors
- Add Lenis base styles (`html.lenis { height: auto; }`)

### 3.13 `components/layout/Navbar.jsx` (MODIFY)

**Major changes:**

- Replace `react-router-dom` `Link` with `<a href="#section">` for main nav on the home page
- For Privacy Policy page, link back to `/#section`
- **Scroll-spy**: Use `IntersectionObserver` to detect which section is in view and highlight the corresponding nav link
  - Observe each section element by `id`
  - The section with the highest intersection ratio gets the active state
  - Update `activeSection` state accordingly
- **Smooth scroll on click**: Use Lenis `scrollTo('#section')` on nav link click
- Keep the mobile hamburger menu
- **Navbar background**: Transparent at top of hero, transitions to `bg-navy/95` after scrolling past hero (use scroll position listener)
- Active link uses `text-gold` (same as current)

```jsx
const navLinks = [
  { href: '#hero', label: 'Home' },
  { href: '#about', label: 'About Us' },
  { href: '#approach', label: 'Our Approach' },
  { href: '#services', label: 'Services' },
  { href: '#contact', label: 'Get in Touch' },
]
```

### 3.14 `components/layout/Footer.jsx` (MODIFY)

- Replace `<Link to="/...">` with `<a href="#...">` for section navigation
- Keep `<Link to="/privacy">` as a router link (separate page)
- Replace `<Link to="/" >Home</Link>` with `<a href="#hero">Home</a>`, etc.

### 3.15 `components/layout/Layout.jsx` (MODIFY)

- Remove the `useEffect` that scrolls to top on pathname change (Lenis handles scroll, and single-page doesn't need this for section nav)
- Keep it for actual route changes (/ vs /privacy) — conditionally scroll to top only when the route truly changes, not on hash changes

---

## Step 4: Parallax & Animation Specifics by Section

| Section | Parallax | Scroll Animation | Sticky | Lottie |
|---------|----------|-----------------|--------|--------|
| Hero | 3 background layers at speeds 0.3/0.5/0.7 | Title staggers in on load | None | Background decorative (opacity 0.15) |
| About | Founder image moves at 0.8x speed | Text paragraphs FadeInUp, accent bar width animation | Founder image sticks on desktop | None |
| Approach | Step circles at 0.9x speed | Cards stagger in, connector lines draw-in | Section title sticks on desktop | Optional step icons |
| Services | Background blobs at 0.3x speed | Cards stagger in grid, hover tilt | None | Section divider animation |
| Contact | Background gradient shifts | Left/right slide-in, form fields stagger | None | None |

---

## Step 5: Lottie Animation Sources

For Lottie files, use free animations from LottieFiles.com:
- **Hero background**: Abstract geometric/dot-grid animation
- **Section divider**: Subtle wave or growth line animation
- **Step icons** (optional): Simple animated icons for each approach step

Store `.lottie` files in `client/public/lottie/` directory. Reference via `/lottie/filename.lottie`.

---

## Step 6: Mobile Responsiveness

- **Parallax**: Reduce or disable parallax effects on mobile (check `window.matchMedia` or use CSS `@media`). Heavy parallax on mobile causes jank.
- **Sticky elements**: Disable sticky behavior on mobile (already using `md:` prefix for desktop-only sticky)
- **Lottie**: Reduce Lottie animation complexity on mobile or skip scroll-linked behavior (play once on viewport entry instead)
- **Navbar**: Keep hamburger menu. Scroll-spy still works on mobile.
- **Animations**: Keep scroll-triggered animations but reduce distance/duration for mobile

---

## Step 7: Implementation Order

1. **Install deps** and create `LenisProvider.jsx`
2. **Create `ScrollAnimations.jsx`** with reusable wrappers
3. **Create `LottieScrollPlayer.jsx`**
4. **Convert each section** (Hero → About → Approach → Services → Contact)
5. **Create `HomePage.jsx`** assembling all sections
6. **Update `App.jsx`** to use new routes
7. **Update `Navbar.jsx`** with anchor links + scroll-spy
8. **Update `Footer.jsx`** with anchor links
9. **Update `Layout.jsx`** and `main.jsx`
10. **Update `index.css`** with Lenis styles and scroll margins
11. **Download/create Lottie files** and place in public/lottie/
12. **Delete old page files** (Home, AboutUs, OurApproach, Services, GetInTouch)
13. **Test and verify**

---

## Step 8: Verification

- [ ] `npm run dev` starts without errors
- [ ] Single page loads with all 5 sections visible on scroll
- [ ] Smooth scrolling works (Lenis)
- [ ] Navbar links scroll to correct sections
- [ ] Scroll-spy highlights active nav link correctly
- [ ] Parallax effects create depth (elements move at different speeds)
- [ ] Scroll-triggered animations fire as sections enter viewport
- [ ] Sticky elements work on desktop (founder image, approach title)
- [ ] Lottie animations play/react to scroll
- [ ] Contact form submits successfully to `/api/contact`
- [ ] Privacy Policy page still works as separate route
- [ ] Footer links work (section anchors + privacy router link)
- [ ] Mobile responsive — no jank, hamburger menu works, parallax reduced
- [ ] `npm run build` succeeds
- [ ] No console errors or warnings
