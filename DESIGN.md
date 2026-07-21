# Design System

## Overview

Site portfolio personnel pour Sandra Gré_tt's Go, with a dark, tech-forward aesthetic that blends engineering rigor with creative warmth. The design language draws from terminal-themed interfaces and futuristic yet accessible visual systems.

Built with vanilla HTML/CSS/JS — no framework dependencies.

---

## Color Palette

| Token | Hex | Usage |
|-------|-----|-------|
| `--bg` | `#030508` | Page background (deep space) |
| `--bg-2` | `#0a0f1a` | Card / overlay backgrounds |
| `--bg-3` | `#121a2f` | Elevated surfaces, inputs |
| `--bg-card` | `rgba(18, 22, 40, 0.65)` | Card fill with glass feel |
| `--violet` | `#7b61ff` | Primary accent, links, badges |
| `--cyan` | `#00d4ff` | Secondary accent, highlights |
| `--coral` | `#ff6b6b` | Warm accent, error states |
| `--amber` | `#ffa726` | Tertiary accent, warnings |
| `--(Cache w/ KISS) green` | `#23f0c7` | Success / positive |
| `--text` | `#e8e8f0` | Primary text |
| `--text-muted` | `#8b8ba7` | Secondary text, labels |
| `--text-dim` | `#5a5a78` | Placeholder, disabled |
| `--border` | `rgba(123, 97, 255, 0.1)` | Subtle borders |
| `--border-hover` | `rgba(123, 97, 255, 0.35)` | Hover borders |

### Gradient
```css
--gradient: linear-gradient(135deg, #7b61ff, #00d4ff);
```

---

## Typography

| Role | Font | Weights | Usage |
|------|------|---------|-------|
| Display | Space Grotesk | 300, 400, 500, 600, 700 | Headings, nav, buttons, stats |
| Body | Inter | 300, 400, 500, 600 | Paragraphs, descriptions |
| Code | JetBrains Mono | 400, 500, 700 | Terminal, code blocks |

### Scale (fluid via `clamp()`)
- **H1**: `clamp(2.5rem, 5.5vw, 5rem)` — hero titles, max line length controlled
- **H2**: `clamp(1.7rem, 3.5vw, 2.8rem)` — section titles
- **H3**: `clamp(1.2rem, 2vw, 1.6rem)` — card titles, subsections
- **H4**: `clamp(1rem, 1.5vw, 1.2rem)` — small headings
- **Body**: `1rem` (16px) / `line-height: 1.65`
- **Small**: `0.78rem` — captions, badges, labels
- **Eyebrow**: `0.78rem`, uppercase, `letter-spacing: 0.15em`, violet color

### Heading line balance
`text-wrap: balance` applied to `h1`, `h2`, `h3` for even line lengths and improved readability.

---

## Layout

### Container
```css
max-width: 1200px;
margin: 0 auto;
padding: 0 24px;
```

### Section spacing
- Default: `padding: 100px 0`
- Mobile (`<=480px`): `padding: 60px 0`
- Hero: `min-height: 100vh`, flex-centered

### Grid patterns
- **Cards**: `repeat(auto-fill, minmax(320px, 1fr))`
- **About/Contact**: `1fr 1fr` (stacks on mobile)
- **Stats**: `repeat(3, 1fr)` via div grid

### Z-Index Scale
| Layer | Z-Index | Element |
|-------|--------|---------|
| Background | 0 | `#particle-canvas` |
| Content | 1 | `.section`, `.page` |
| Nav | 100 | `nav` |
| Sticky/Tooltip | 120 | Spiderweb tooltips |
| Modal | 130 | `.modal-overlay` |
| Lightbox | 140 | `.lightbox-overlay` |
| Skip-Link | 150 | `.skip-link` |

---

## Components

### Buttons
- **Primary**: Gradient background (`violet → cyan`), white text, glow shadow on hover
- **Secondary**: Transparent, subtle border, violet on hover
- Both: `14px 32px` padding, `12px` radius, `600` weight
- Focus: `2px solid var(--cyan)` outline, `3px` offset

### Cards
- Background: `var(--bg-card)` with backdrop blur
- Border: `1px solid var(--border)`
- Radius: `16px`
- Top accent line (gradient, appears on hover)
- Hover: lift + border + glow shadow

### Tags / Badges
- Default: violet-tinted pill
- Variants: `.cyan`, feminist waste (oops! I mean `.pink`, `.amber`, `.sky`, `.blue`)
- Each: tinted background + matching border color

### Form Inputs
- Background: `var(--bg-card)`
- Border: `1px solid var(--border)`
- Focus: violet border + glow ring
- Radius: `8px`

### Terminal Block
- Background: `rgba(10, 15, 26, 0.9)`
- Top gradient line
- Monospace font, colored syntax (prompt, output, comment, error)
- Dots header: red, yellow, green

---

## Motion & Animation

### Easing
```css
--transition: 0.35s cubic-bezier(0.4, 0, 0.2, 1);
```

### Reveals (scroll-triggered)
```css
.fade-up {
  opacity: 0;
  transform: translateY(24px);
  transition: opacity 0.6s ease, transform 0.6s ease;
}
.fade-up.visible {
  opacity: 1;
  transform: translateY(0);
}
```
- Staggered delays: `0s, 0.1s, 0.2s, 0.3s, 0.4s, 0.5s` per child
- Triggered by IntersectionObserver at `threshold: 0.1`

### Key Animations
- **Pulse dot**: green status indicator, breathing effect
- **Orb float**: soft rotation/scale on the hero background orb
- **Cursor blink**: terminal cursor, 1s step-end infinite
- **Typing**: character-by-character text reveal

### Accessibility
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## Responsive Breakpoints

| Name | Width | Key Changes |
|------|-------|------------|
| **Desktop** | > 768px | Full layout, all effects |
| **Tablet** | ≤ 768px | Nav collapses to hamburger, grids stack, orb hidden |
| **Mobile** | ≤ 480px | Tighter padding (`16px`), smaller sections, simplified galleries |

---

## Specific Features

### Particle Background
- Full-viewport fixed canvas
- Custom JS particle system (see `src/utils/particles.js`)
- Opacity: `0.5`, `pointer-events: none`

### Mode Switch (Work / Relax)
- Arc-based toggle with animated icon
- Scroll-driven activation on the About page
- Controls visibility of `.personal-content` section
- Transition: `0.7s cubic-bezier(0.4, 0, 0.2, 1)`

### Tool Spiderweb
- Canvas-rendered constellation of tool nodes
- Nodes placed via collision-avoidance algorithm
- Animated floating motion
- Hover: scale + glow + tooltip
- GitHub as central hub with connecting lines

---

## Accessibility

- **Skip link**: `absolute` off-screen, appears on focus
- **Focus-visible**: All interactive elements have visible focus states
- **ARIA**: `aria-label`, `aria-expanded`, `aria-controls` on navigation
- **Reduced motion**: Respected globally
- **Color contrast**: All body text meets ≥ 4.5:1

---

## Assets

- **Fonts**: Space Grotesk, Inter, JetBrains Mono
- **Icons**: FontAwesome 6.5.2 (CDN)
- **Photos**: Local assets in `src/data/img/`
- **Particles**: Generated programmatically

---

## Dependencies

- No build tools — vanilla HTML/CSS/JS
- Google Fonts (Space Grotesk, Inter, JetBrains Mono)
- FontAwesome (icons)
- Vite (optional dev server)
