const STORAGE_KEY = 'calendar.events';
const MAX_CHIPS = 3;

const grid = document.getElementById('grid');
const monthTitle = document.getElementById('month-title');
const modal = document.getElementById('modal');
const form = document.getElementById('event-form');
const modalTitle = document.getElementById('modal-title');
const deleteBtn = document.getElementById('delete');

let events = loadEvents();
let viewYear = new Date().getFullYear();
let viewMonth = new Date().getMonth();
let editingId = null;

// ---------- Storage ----------

function loadEvents() {
  try {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return Array.isArray(data) ? data : [];
  } catch (err) {
    console.error('Could not read events from storage', err);
    return [];
  }
}

function saveEvents() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
  } catch (err) {
    console.error('Could not save events to storage', err);
  }
}

// ---------- Helpers ----------

function toISODate(d) {
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${mm}-${dd}`;
}

function isValidDate(str) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(str)) return false;
  const [y, m, d] = str.split('-').map(Number);
  const dt = new Date(y, m - 1, d);
  return dt.getFullYear() === y && dt.getMonth() === m - 1 && dt.getDate() === d;
}

function newId() {
  return crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(36) + Math.random().toString(36).slice(2);
}

// ---------- Rendering ----------

function render() {
  monthTitle.textContent = new Date(viewYear, viewMonth, 1)
    .toLocaleDateString(undefined, { month: 'long', year: 'numeric' });

  const firstWeekday = new Date(viewYear, viewMonth, 1).getDay();
  const todayStr = toISODate(new Date());
  grid.replaceChildren();

  // Always 6 weeks so the grid height stays stable between months
  for (let i = 0; i < 42; i++) {
    const day = new Date(viewYear, viewMonth, 1 - firstWeekday + i);
    const dateStr = toISODate(day);

    const cell = document.createElement('div');
    cell.className = 'day';
    cell.dataset.date = dateStr;
    if (day.getMonth() !== viewMonth) cell.classList.add('other-month');
    if (dateStr === todayStr) cell.classList.add('today');

    const label = day.toLocaleDateString(undefined,
      { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
    const num = document.createElement('button');
    num.type = 'button';
    num.className = 'day-number';
    num.textContent = day.getDate();
    num.setAttribute('aria-label', `Add event on ${label}`);
    if (dateStr === todayStr) num.setAttribute('aria-current', 'date');
    cell.append(num);

    const dayEvents = events
      .filter((ev) => ev.date === dateStr)
      .sort((a, b) => (a.startTime || '').localeCompare(b.startTime || ''));

    for (const ev of dayEvents.slice(0, MAX_CHIPS)) {
      const chip = document.createElement('button');
      chip.type = 'button';
      chip.className = 'chip';
      chip.dataset.id = ev.id;
      chip.textContent = (ev.startTime ? ev.startTime + ' ' : '') + ev.title;
      chip.title = ev.title;
      chip.setAttribute('aria-label',
        `Edit ${ev.title}${ev.startTime ? ', ' + ev.startTime : ''}, ${label}`);
      cell.append(chip);
    }

    if (dayEvents.length > MAX_CHIPS) {
      const more = document.createElement('span');
      more.className = 'more';
      more.textContent = `+${dayEvents.length - MAX_CHIPS} more`;
      cell.append(more);
    }

    grid.append(cell);
  }
}

// ---------- Modal ----------

function openModal(date, ev) {
  form.reset();
  showErrors({});
  editingId = ev ? ev.id : null;
  modalTitle.textContent = ev ? 'Edit Event' : 'Add Event';
  deleteBtn.hidden = !ev;

  const f = form.elements;
  f.title.value = ev ? ev.title : '';
  f.date.value = ev ? ev.date : date;
  f.startTime.value = ev ? ev.startTime : '';
  f.endTime.value = ev ? ev.endTime : '';
  f.description.value = ev ? ev.description : '';

  modal.showModal();
  f.title.focus();
}

function readForm() {
  const f = form.elements;
  return {
    title: f.title.value.trim(),
    date: f.date.value,
    startTime: f.startTime.value,
    endTime: f.endTime.value,
    description: f.description.value.trim(),
  };
}

// ---------- Validation ----------

function validate(data) {
  const errors = {};
  if (!data.title) errors.title = 'Title is required.';
  else if (data.title.length > 100) errors.title = 'Title must be 100 characters or fewer.';
  if (!isValidDate(data.date)) errors.date = 'Please enter a valid date.';
  if (data.startTime && data.endTime && data.endTime <= data.startTime) {
    errors.endTime = 'End time must be after start time.';
  }
  if (data.description.length > 500) errors.description = 'Description must be 500 characters or fewer.';
  return errors;
}

function showErrors(errors) {
  for (const p of form.querySelectorAll('.error')) {
    const field = p.dataset.for;
    p.textContent = errors[field] || '';
    form.elements[field].setAttribute('aria-invalid', errors[field] ? 'true' : 'false');
  }
  const first = Object.keys(errors)[0];
  if (first) form.elements[first].focus();
}

// render() replaces the focused element, so put focus back on the affected day
function restoreFocus(date) {
  (grid.querySelector(`[data-date="${date}"] .day-number`) || document.getElementById('add')).focus();
}

// ---------- Event handlers ----------

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const data = readForm();
  const errors = validate(data);
  showErrors(errors);
  if (Object.keys(errors).length) return;

  if (editingId) {
    events = events.map((ev) => (ev.id === editingId ? { ...ev, ...data } : ev));
  } else {
    events.push({ id: newId(), ...data });
  }
  saveEvents();
  modal.close();
  render();
  restoreFocus(data.date);
});

deleteBtn.addEventListener('click', () => {
  const ev = events.find((x) => x.id === editingId);
  if (!ev || !confirm(`Delete "${ev.title}"?`)) return;
  events = events.filter((x) => x.id !== editingId);
  saveEvents();
  modal.close();
  render();
  restoreFocus(ev.date);
});

document.getElementById('cancel').addEventListener('click', () => modal.close());

// Clicking the backdrop (the dialog element itself, outside the form) closes it
modal.addEventListener('click', (e) => {
  if (e.target === modal) modal.close();
});

grid.addEventListener('click', (e) => {
  const chip = e.target.closest('.chip');
  if (chip) {
    openModal(null, events.find((ev) => ev.id === chip.dataset.id));
    return;
  }
  const cell = e.target.closest('.day');
  if (cell) openModal(cell.dataset.date);
});

document.getElementById('prev').addEventListener('click', () => {
  viewMonth--;
  if (viewMonth < 0) { viewMonth = 11; viewYear--; }
  render();
});

document.getElementById('next').addEventListener('click', () => {
  viewMonth++;
  if (viewMonth > 11) { viewMonth = 0; viewYear++; }
  render();
});

document.getElementById('today').addEventListener('click', () => {
  viewYear = new Date().getFullYear();
  viewMonth = new Date().getMonth();
  render();
});

document.getElementById('add').addEventListener('click', () => openModal(toISODate(new Date())));

render();
