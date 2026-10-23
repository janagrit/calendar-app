# Calendar App — Todo

Simple month-view calendar. Vanilla HTML/CSS/JS, no build step — open `index.html` in a browser.
Events are stored in localStorage under `calendar.events` as a JSON array:
`{ id, title, date: "YYYY-MM-DD", startTime: "HH:MM" | "", endTime: "HH:MM" | "", description }`

## Checklist

- [x] **1. Project scaffold** — create `index.html`, `styles.css`, `app.js`
  - AC: Opening `index.html` shows the header (prev / month title / next / Today / + Add Event) with no console errors.
  - AC: CSS and JS files are linked and load.

- [x] **2. Month grid + navigation**
  - AC: Shows a 7-column grid (Sun–Sat headers) with all days of the current month in the correct weekday columns.
  - AC: Leading/trailing days from adjacent months are visibly dimmed.
  - AC: Today's date is highlighted.
  - AC: Prev/Next change the month (including across year boundaries, e.g. Dec → Jan); "Today" returns to the current month.
  - AC: The title shows the month and year, e.g. "October 2026".

- [x] **3. localStorage storage layer**
  - AC: `loadEvents()` returns an array from `calendar.events`, or `[]` if the key is missing.
  - AC: Corrupt JSON in storage doesn't crash the app (falls back to `[]`).
  - AC: `saveEvents()` writes valid JSON; events survive a page reload.

- [x] **4. Add-event modal**
  - AC: "+ Add Event" opens the modal with the date prefilled to today; clicking a day cell opens it prefilled with that day.
  - AC: The form has title, date, start time, end time, and description fields.
  - AC: The modal closes on Cancel, Esc, or a backdrop click, without saving.

- [x] **5. Create event + show on grid**
  - AC: Saving a valid form adds the event to storage and closes the modal.
  - AC: The event appears as a chip on its day (start time + title), with chips sorted by start time.
  - AC: If a day has more than 3 events, it shows 3 chips plus "+N more".
  - AC: User text is rendered as plain text (HTML in a title is not interpreted).

- [x] **6. Edit event**
  - AC: Clicking an event chip opens the modal prefilled with that event (title reads "Edit Event").
  - AC: Saving updates the existing event (same id, no duplicate), both on the grid and in storage.
  - AC: Changing the date moves the chip to the new day.

- [x] **7. Delete event**
  - AC: A Delete button is visible only in edit mode.
  - AC: Delete asks for confirmation; on confirm the event is removed from the grid and from storage; on cancel nothing changes.

- [x] **8. Basic validation**
  - AC: Title is required (after trimming), max 100 chars.
  - AC: Date is required and must be valid.
  - AC: If both times are set, end time must be after start time.
  - AC: Description max 500 chars.
  - AC: Errors appear inline next to the field; nothing is saved while errors exist; errors clear on a successful save or when the modal reopens.

- [x] **9. Responsive UI**
  - AC: At 375px wide: no horizontal page scroll, all 7 columns visible, and the header controls wrap neatly.
  - AC: On small screens, chips stay readable (truncated with ellipsis) and the modal fits the viewport.
  - AC: Buttons and day cells are easy to tap (≥ 36px).

- [x] **10. End-to-end manual test + review**
  - AC: Full flow works: navigate → add → reload (persists) → edit → delete → reload.
  - AC: Invalid submissions are blocked with visible errors.
  - AC: A Review section summarizing the changes is added below.

## Review

**Files added**
- `index.html` — header toolbar, weekday row, grid container, `<dialog>` modal with the event form.
- `styles.css` — 7-column CSS Grid month layout, chip and modal styles, mobile breakpoint at 600px.
- `app.js` (~200 lines) — storage (`loadEvents`/`saveEvents`), `render()` for the 6×7 grid, `openModal`, `validate`/`showErrors`, and event handlers (grid click delegation, nav, save, delete).

**Notes**
- No dependencies or build step; open `index.html` directly.
- All user text is rendered through `textContent`, so HTML in titles is shown literally.
- All-day events (no start time) sort before timed events on a day.
- "+N more" is informational; clicking it opens the add modal for that day.

**Verification (headless Chrome, scripted)**
- Grid has 42 cells; title "October 2026"; today highlighted; Next ×3 → "January 2027"; Today returns.
- Empty title + end-before-start → both inline errors shown, nothing stored.
- Add → chip "10:00 <b>Standup</b>" shown as plain text; stored JSON valid.
- Edit → same id, title updated, no duplicate. 4 events on one day → 3 chips + "+1 more".
- Delete (confirm accepted) → removed from storage. Corrupt JSON → `loadEvents()` returns `[]`.
- Reload → events persist. Narrow viewport (500px, the minimum the test browser allowed) → mobile styles apply, no horizontal scroll, no console errors. 375px is untested.

---

# Accessibility fixes (WCAG 2.2 AA)

- [x] **A1. Keyboard access to days** — day number becomes a `<button>` with a full-date `aria-label`; `aria-current="date"` on today
  - AC: Tab reaches every day; Enter/Space opens the Add modal for that date.
- [x] **A2. Focus restoration** — after save/delete, focus returns to the affected day (or "+ Add Event")
  - AC: `document.activeElement` is not `<body>` after save or delete.
- [x] **A3. Contrast** — `--muted` #6b7280, `--chip-text` #1d4fb8, `--border-strong` #8a9099 on inputs/buttons
  - AC: text ≥ 4.5:1, input/button borders ≥ 3:1.
- [x] **A4. Labels** — chips announce title, time and date; weekday header row `aria-hidden`
- [x] **A5. Form errors** — `aria-describedby` links errors to fields; `aria-required` on title/date; focus moves to first invalid field
- [x] **A6. Month announcements** — `aria-live="polite"` on month title; dialog `aria-labelledby`
- [x] **A7. Focus & targets** — explicit `:focus-visible` ring; chips ≥ 24px tall
  - AC: Visible focus on every control; no chip under 24px.

---

# Design system fixes

- [x] **D1. Tokenise colors, type, spacing** — no raw hex/rgba outside `:root`; 4-step type scale; 4px spacing scale
  - AC: `grep` finds no hex/rgba outside token blocks; ≤ 5 distinct font sizes; spacing values from `--space-*`.
- [x] **D2. Dark mode** — `prefers-color-scheme: dark` overrides the color tokens only
  - AC: All text ≥ 4.5:1 and input borders ≥ 3:1 in dark mode; no hardcoded light colors remain visible.
- [x] **D3. Even rows + day-number alignment**
  - AC: On desktop all 6 week rows are the same height regardless of event count (phones keep compact content-height rows); day-number text aligns with chip text.

## Review (accessibility + design system)

**Accessibility (A1–A7)** — `index.html`, `app.js`, `styles.css`
- Day numbers are now `<button>`s labelled with the full date (`aria-current="date"` on today); chips announce title, time and date.
- Focus returns to the affected day after save/delete; failed validation focuses the first invalid field; errors are linked via `aria-describedby`.
- Month title is `aria-live`; dialog has `aria-labelledby`; required fields marked.
- Contrast raised (`--muted`, `--chip-text`, `--border-strong`); explicit `:focus-visible` ring; chips ≥ 24px.

**Design system (D1–D3)** — `styles.css` only
- All colors, font sizes, spacing and radii come from tokens in `:root`; no raw hex/rgba or px spacing outside token blocks; 4 font sizes (xs/sm/lg/xl).
- Dark mode overrides color tokens only; every pair checked (text ≥ 6.9:1, borders/focus ≥ 3.5:1). Form fields and dialog follow the theme.
- Desktop rows are equal height (`grid-auto-rows: minmax(110px, 1fr)`); day-number text aligns with chip text (circle only on today).
- Trade-off: equal rows on phones made the whole month as tall as its busiest week, so phones keep compact content-height rows.

**Verification (headless Chrome)** — desktop 1280px light, 375px mobile dark: no horizontal scroll, rows 146px on desktop, number/chip text both at x=885, mobile grid 501px tall, chips 24px, no console errors.

**Still open** — make "+N more" show the hidden events (needs a popover; deferred).

---

# Deploy to Netlify

- [x] **N1. Log in** — user runs `! npx netlify-cli login` (opens browser, interactive)
  - AC: `npx netlify-cli status` shows the logged-in account.
- [x] **N2. Stage only the app files** — copy `index.html`, `styles.css`, `app.js` into a temp publish folder (outside the repo)
  - AC: `CLAUDE.md`, `tasks/`, `.claude/` are NOT published. No repo files change.
- [x] **N3. Draft deploy** — `netlify deploy --dir <folder>` creates a new site and a preview URL
  - AC: preview URL loads, month grid renders, adding an event works, no console errors.
- [x] **N4. Production deploy** — `netlify deploy --prod --dir <folder>`
  - AC: live URL serves the same build.
  - Status: deployed to https://janagrit-calendar.netlify.app, but the site returns 401 (Netlify visitor access protection is on). Needs to be made public in Netlify UI before it can be verified.

---

# Portfolio redesign + logo

- [x] **R1. Logo** — new `logo.svg` (calendar mark + wordmark), shown in the header; also used as favicon
  - AC: crisp at 32px and 160px; readable in light and dark mode.
- [x] **R2. Typography** — Google Fonts: a display face for the month title + Inter for UI text (via tokens)
  - AC: only `--font-*` tokens change the font; text still ≥ 4.5:1 contrast.
- [x] **R3. Refined look (tokens + a few rules in styles.css)** — soft gradient page background, grid as an elevated rounded card, subtle shadows, softer chips, polished today marker
  - AC: no raw colors outside `:root`; dark mode still passes contrast checks.
- [x] **R4. Header layout** — brand on the left, month navigation in the middle, actions on the right; stacks neatly on phones
  - AC: no horizontal scroll at 375px.
- [x] **R5. Modal polish** — more spacing, larger radius, blurred backdrop
- [x] **R6. Portfolio meta** — page title, description, Open Graph tags, theme-color
- [x] **R7. Verify** — headless Chrome: desktop light + mobile dark screenshots, no console errors, focus rings visible
- [ ] **R8. Redeploy** to Netlify (after the site is made public)

---

# NYC weather on each day

Source: Open-Meteo (free, no API key, CORS allowed). NYC = 40.71, -74.01, timezone America/New_York, °F.
- Forecast API covers ~93 days back to 15 days ahead.
- Archive API covers older dates (actual recorded weather).
- Dates more than ~15 days ahead: no data, the cell simply shows no weather.

- [x] **W1. Fetch** — `loadWeather()` in `app.js`: for the 42 visible days, one request to the forecast API (+ one to the archive API only if the month is older); cache results in a `Map` keyed by `YYYY-MM-DD` so switching months back and forth doesn't refetch
  - AC: max 2 requests per month view; network failure logs to console and the calendar still works.
- [x] **W2. Show** — small line in each day cell: weather icon (from WMO weather code) + `high° / low°`, e.g. `☀️ 68° / 54°`
  - AC: render() stays synchronous; weather fills in after the fetch resolves without moving focus.
- [x] **W3. Accessibility** — weather text included in the day button's aria-label ("Sunny, high 68, low 54"); emoji hidden from screen readers
- [x] **W4. Style** — muted small text via existing tokens; fits mobile cells without overflow
- [x] **W5. Verify** — headless Chrome: current month shows weather for past + next 15 days, previous year month shows archive data, offline = no errors in UI
  - Status: deployed (Daybook + weather) to https://janagrit-calendar.netlify.app — still returns 401 until Visitor access is set to Public in Netlify.

## Review (deploy + weather + Daybook redesign)

**Deploy (N1–N4)** — new Netlify site `janagrit-calendar` (team janagrit). Only `index.html`, `styles.css`, `app.js`, `logo.svg` are published from a temp folder; repo files (`CLAUDE.md`, `tasks/`, `.claude/`) are not uploaded. CLI needs Node ≥ 22 (used Node 24 via nvm).

**NYC weather (W1–W5)** — `app.js`, `styles.css`
- Open-Meteo forecast API (≈3 months back → 15 days ahead) + archive API for older months; no key, CORS ok.
- Cached per date in a `Map`; requests debounced 300 ms (fast paging previously caused HTTP 429).
- Weather is added to existing cells after the fetch, so focus is not lost; screen readers get it via the day button label.
- Desktop: `☀️ 69° / 45°`; phones: icon + high only. Days beyond the forecast show nothing. Offline: calendar works, no UI errors.

**Daybook redesign (R1–R7)** — `logo.svg` (new), `index.html`, `styles.css`
- Logo mark (indigo gradient calendar) in header + favicon; "Daybook" wordmark as text.
- Inter font; Linear-style indigo accent (#5e6ad2, 4.7:1 with white); soft header glow; grid as elevated rounded card; chips with accent bar; today ring.
- Header: brand | month nav | actions; phones: brand + actions on top, nav below.
- Modal: more padding, blurred backdrop, accent focus ring on inputs.
- Meta: title, description, Open Graph, theme-color; Open-Meteo attribution in footer (required by CC BY 4.0).
- Verified in headless Chrome: 1280px light + 375px dark, no horizontal scroll, no console errors, 41/42 days with weather.

**Still open**
- Netlify Visitor access → Public (user action), then re-check public URLs.
- "+N more" doesn't reveal hidden events (from earlier review).

**README** — added `README.md` (logo, live demo link, features, tech, run locally, notes, credits). Not published to Netlify.
