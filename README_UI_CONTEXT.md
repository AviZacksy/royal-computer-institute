# UI Context — Royal CI (Next.js + Tailwind)

This document is a **UI-focused map** of the project for designers/developers (including other AI agents).  
Goal: improve the UI safely **without breaking routes, flows, or demo behaviors**.

---

## 1) Project overview

- **App name**: `royal-ci`
- **Purpose**: Demo frontend for “Royal Computer Institute” website with common institute flows:
  - Course browsing
  - Online admission form (demo)
  - Student login (demo)
  - Exam login + registration (demo)
  - Fee status / receipt (demo)
  - Certificate apply + verification (demo)
  - Query/contact pages (demo)
  - Gallery + videos (demo)
- **Tech**:
  - Next.js **16.2.4** (App Router)
  - React **19.2.4**
  - TypeScript
  - Tailwind CSS **v4** via PostCSS plugin (`@tailwindcss/postcss`)

---

## 2) Current pages / routes list

Routes are defined under `src/app/*` using App Router.

- `/` — Home (hero + highlights + popular courses + services + videos)
- `/courses` — Courses grid
- `/admission` — Online admission form (demo submit)
- `/admission-login` — Admission portal login UI (demo action)
- `/student-login` — Student login UI (demo)
- `/exam-login` — Exam login UI (demo)
- `/exam-registration` — Exam registration form (demo action)
- `/fee-paid` — Fee status cards (demo actions/messages)
- `/certificate` — Certificate apply + verify panels (demo)
- `/gallery` — Photos + videos + demo notice
- `/online-advertising` — Promo videos (demo)
- `/query` — Online query form (demo submit)
- `/contact` — Contact info + map placeholder
- `/_not-found` — Not Found UI

Navigation links are centralized in:
- `src/components/site/nav.ts`

---

## 3) Main components list

### Layout / Site chrome
- `src/components/site/SiteLayout.tsx`
  - Global header (announcement + navbar)
  - Main content wrapper
  - Mobile bottom CTA
  - Global footer
- `src/components/site/AnnouncementBar.tsx`
- `src/components/site/mobile/MobileNav.tsx`
- `src/components/site/mobile/SmartBackButton.tsx`
- `src/components/site/mobile/MobileBottomCTA.tsx`

### UI primitives (reusable)
- `src/components/ui/Button.tsx`
  - `Button`, `ButtonLink`, `ButtonAnchor`
  - Variants: `primary | secondary | outline | ghost | accent | whatsapp`
- `src/components/ui/Card.tsx`
  - `Card`, `CardHeader`, `CardContent`
- `src/components/ui/Input.tsx`
  - `Input`, `Select`, `Textarea`
- `src/components/ui/Field.tsx`
  - Form field label wrapper
- `src/components/ui/Page.tsx`
  - `PageShell` for consistent page header + card wrapper

### Demo helpers
- `src/components/demo/DemoAction.tsx`
  - Button that reveals a demo message panel
- `src/components/demo/DemoNotice.tsx`
  - “Demo Mode” notice section

### Feature panels/forms
- `src/components/forms/AdmissionForm.tsx`
- `src/components/forms/QueryForm.tsx`
- `src/components/forms/StudentLoginCard.tsx`
- `src/components/forms/ExamLoginCard.tsx`
- `src/components/forms/FeeStatusCards.tsx`
- `src/components/forms/CertificatePanel.tsx`

### Media
- `src/components/media/VideoStrip.tsx`
  - Horizontal snap strip on mobile
  - Grid on desktop

### Content blocks
- `src/components/site/ContactPanel.tsx`

---

## 4) Current frontend flow (entry → actions)

### Entry
- User lands on `/` (Home).
- Global header + nav is always present via `SiteLayout`.

### Typical user journey (demo)
- **Explore courses**
  - `/` → click “View Courses” → `/courses`
- **Start admission**
  - `/` or nav → `/admission`
  - Fill form → submit sets local state (`submitted`) and shows a demo message
- **Logins**
  - `/student-login` or `/exam-login` → form submit sets local state and reveals demo messages
- **Exam registration**
  - `/exam-registration` → form fields → “Register” demo action
- **Fee status**
  - `/fee-paid` → Paid/Pending cards → buttons show demo notices
- **Certificates**
  - `/certificate` → apply form + verify form → local state toggles panels/messages
- **Contact / Query**
  - `/contact` shows institute contact info + placeholder map
  - `/query` shows demo query form submission message

### Final actions (demo-only)
There is **no backend**. “Submit/Login/Register/Pay” actions typically:
- Prevent default submit
- Set local React state
- Show a “This feature will be activated…” message

---

## 5) Existing styling system (current state)

### Tailwind usage
UI is built with Tailwind utility classes directly in components.

### Fonts
Loaded via `next/font/google` in `src/app/layout.tsx`:
- DM Sans (body)
- Playfair Display (display/headings)
- Bebas Neue (metrics/stats styling helper)

### Global CSS
`src/app/globals.css`:
- `@import "tailwindcss";`
- Defines CSS variables for colors/radii/shadows in an `@theme` block (Tailwind v4).
- Defines helper classes: `.font-body`, `.font-display`, `.font-metric`.

### Theme tokens vs real utilities (important)
Tailwind v4 “CSS-first” theming can define `--color-*` tokens in `@theme`, but **custom utility class names** like `bg-royal` only work if Tailwind recognizes those tokens and generates utilities as expected.

In this codebase, many components/pages were updated to use:
- Custom utilities like `bg-royal`, `text-muted`, `border-gold/15`, etc.
- To ensure styles actually render, hex-based arbitrary values are also used in many places: `bg-[#1a1a2e]`, etc.

If improving UI, decide **one consistent approach**:
- **Option A (recommended)**: Prefer Tailwind v4 `@theme` and ensure custom color utilities are generated and consistently used.
- **Option B (safe fallback)**: Standardize on `bg-[#...]` / `text-[#...]` / `border-[#...]/..` across the design system.

### Tailwind config file
No `tailwind.config.*` file is present.
Tailwind is configured via CSS-first approach (`globals.css`) + PostCSS:
- `postcss.config.mjs` uses `@tailwindcss/postcss`

---

## 6) Tailwind config usage (if any)

- **No JS config**: no `tailwind.config.ts/js`.
- **CSS-first**: `@import "tailwindcss";` in `src/app/globals.css`.
- **PostCSS plugin**: `postcss.config.mjs`:
  - `@tailwindcss/postcss`

---

## 7) Important files and what each does

### App entry and layout
- `src/app/layout.tsx`
  - Global `<html>` and `<body>`
  - Loads fonts
  - Wraps all pages with `SiteLayout`
- `src/app/globals.css`
  - Tailwind import
  - Theme tokens + global base styles
- `src/components/site/SiteLayout.tsx`
  - Header / main / footer composition
  - Adds mobile bottom CTA
  - Adds mobile bottom padding on main to avoid overlap

### Navigation
- `src/components/site/nav.ts`
  - Single source of truth for route labels/links

### Institute data
- `src/config/institute.ts`
  - Institute identity + contact
  - WhatsApp link formatting (must remain correct)

### Page wrapper pattern
- `src/components/ui/Page.tsx` (`PageShell`)
  - Used by most non-home routes
  - Controls consistent padding + page titles

### Forms/demo behavior
- `src/components/forms/*`
  - Each form uses local state; no API calls
- `src/components/demo/*`
  - Central “demo message” behavior

### Media/images
- `src/components/media/VideoStrip.tsx`
  - Renders videos from `public/Video/...`
- `next.config.ts`
  - Allows remote images from Unsplash domains (safe to keep)
- `public/images/*`
  - Static images including gallery images under `public/images/gallery/*`

---

## 8) Current UI problems / inconsistencies (as of now)

### Theming / color utility inconsistency
- Mixture of:
  - “Custom named” utilities (`bg-royal`, `text-muted`, etc.) and
  - Hex arbitrary utilities (`bg-[#1a1a2e]`, etc.)
- If Tailwind does not generate a custom utility, UI can degrade to “white + text”.

### `/_not-found` page is visually inconsistent
- `src/app/not-found.tsx` still uses `zinc-*` classes and `dark:*` variants which are not aligned with the institute theme.

### Component-level duplication
- Repeated card micro-layout patterns exist in `/` and `/courses` instead of extracting a “CourseCard” component.

### Mixed semantics of CTA patterns
- Home uses multiple CTA styles; other pages rely on `PageShell` + simple cards.

### Mobile overlays
- The fixed mobile CTA requires coordinated bottom padding in main; any new full-height sections must account for it.

---

## 9) Features that must not break (critical)

- **Routes and navigation**
  - Keep existing routes and hrefs from `NAV_ITEMS` working.
- **All demo interactions**
  - Forms must still prevent default submit and show demo messages.
  - Buttons like “Enquire”, “Login”, “Register”, “Pay Now” should keep their current click behavior.
- **Institute contact data**
  - `INSTITUTE` fields and `WHATSAPP_LINK` format must remain correct.
- **Media rendering**
  - Videos must still play from `public/Video/...`
  - Gallery images must still load from `public/images/gallery/*.jpg`
- **Next/Image remote patterns**
  - Keep `next.config.ts` remotePatterns as-is unless intentionally expanded.
- **Layout structure**
  - Header/footer should remain globally applied via `SiteLayout`.

---

## 10) Instructions for another AI designer/developer to improve UI safely

### High-level approach
- Treat `src/components/ui/*` as the **design system**.
- Make changes there first; avoid page-by-page tweaking unless necessary.

### Recommended improvement order
1. **Stabilize theme approach**
   - Choose either:
     - Tailwind v4 `@theme` custom names (verify utility generation), OR
     - Standardize on hex arbitrary utilities.
   - Do not mix both long-term.
2. **Normalize layout**
   - Ensure `PageShell` sets consistent background, spacing, and typography.
   - Ensure mobile bottom CTA padding is always handled.
3. **Unify “card” and “section” patterns**
   - Consider creating:
     - `Section` wrapper (label + title + subtitle)
     - `StatCard`, `CourseCard`, `FeatureCard` components
4. **Fix visual outliers**
   - Update `src/app/not-found.tsx` to match the theme.
5. **Keep changes non-breaking**
   - Don’t rename routes.
   - Don’t change form submit handlers and state flows.
   - Avoid altering `NAV_ITEMS` ordering unless intentional.

### Testing checklist (manual)
- Visit every route in `NAV_ITEMS`.
- On each form page:
  - Submit form → ensure demo message still appears.
  - Click secondary actions (e.g., “Demo Result”, “Check Status”) → demo messages appear.
- On mobile:
  - Ensure bottom CTA does not cover content.
  - Open mobile menu and click links; menu should close and navigate.

### Commands
- Dev: `npm run dev`
- Lint: `npm run lint`
- Build: `npm run build`

