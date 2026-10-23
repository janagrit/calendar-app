<p align="center">
  <img src="logo.svg" alt="Daybook logo" width="64" height="64">
</p>

<h1 align="center">Daybook</h1>

<p align="center">A clean month-view calendar with events and New York City weather for every day.</p>

<p align="center"><a href="https://janagrit-calendar.netlify.app">Live demo</a></p>

## Features

- Month grid with previous / next / today navigation
- Add, edit and delete events (title, date, start/end time, description)
- Form validation with clear error messages
- Events saved in your browser (`localStorage`)
- Daily NYC weather (icon + high/low °F) from [Open-Meteo](https://open-meteo.com/)
- Light and dark mode, responsive down to phone size
- Accessible: keyboard navigation, visible focus, screen-reader labels

## Tech

Plain HTML, CSS and JavaScript — no framework, no build step.

```
index.html   page layout and event dialog
styles.css   design tokens, light/dark theme, responsive layout
app.js       rendering, events, validation, storage, weather
logo.svg     logo and favicon
```

## Run locally

Open `index.html` in a browser, or serve the folder:

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

## Notes

- Events live only in the browser you created them in; there is no account or sync.
- Weather forecasts reach about 15 days ahead; older dates show recorded weather.

## Credits

Weather data by [Open-Meteo.com](https://open-meteo.com/) (CC BY 4.0). Font: [Inter](https://rsms.me/inter/).
