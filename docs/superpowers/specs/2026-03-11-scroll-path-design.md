# Scroll-Triggered Curved Path Animation

## Overview

A gold gradient ribbon that draws itself progressively as the user scrolls down the homepage, creating a visual thread connecting sections from About through Contact. The path sweeps dramatically across the full viewport width (and sometimes beyond the edges) with elegant S-curves.

## Design Decisions

- **Placement:** Between sections, starting after Hero. Connects About → Approach → Services → Contact
- **Style:** Thin (~5-6px) gold gradient ribbon with a soft glow aura behind it
- **Animation:** Draw-on reveal — the path traces itself as the user scrolls, mapped to overall scroll progress
- **Curves:** Full-width sweeping S-curves that extend to (and sometimes past) viewport edges
- **Colors:** Gold gradient using `#D4A056` → `#B97A45` → `#C4903A` → `#8B5E30`
- **Mobile:** Simplified curves, thinner stroke (~3-4px), hidden below 480px for performance

## Architecture

### New Component: `ScrollPath.jsx`

Single SVG overlay component rendered in `HomePage.jsx`.

- **Positioning:** `position: fixed`, `inset: 0`, `pointer-events: none`, `z-index: 1`
- **SVG viewBox:** Matches viewport dimensions, recalculated on resize
- **Path:** Single cubic Bezier path with control points that sweep edge-to-edge
- **Gradient:** SVG `<linearGradient>` applied to stroke
- **Glow:** Second path behind main with larger stroke-width and blur filter

### Scroll Animation

- `useScroll()` from `motion/react` tracks page scroll progress (0 → 1)
- `useTransform()` maps scroll progress to `stroke-dashoffset` (pathLength → 0)
- The path draws from start to end as the user scrolls from About to Contact
- Scroll range: starts when About section enters viewport, completes at Contact

### Responsive Path Calculation

- Path control points calculated from section DOM positions via refs
- `ResizeObserver` recalculates on window resize
- Control points swing to `~-5%` and `~105%` of viewport width (extending past edges)
- Mobile: gentler curves staying within `~10%` to `~90%` of width

### Integration

- Rendered inside `HomePage.jsx` as a sibling to sections
- Sections need `ref` forwarding or `id`-based DOM queries for position calculation
- No changes needed to existing section components (uses `document.getElementById`)

## Technology

- `motion/react` (already installed) — useScroll, useTransform, motion.path
- SVG — path definition, linearGradient, filter for glow
- ResizeObserver — responsive recalculation
- No new dependencies required
