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
