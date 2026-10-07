# Computabilis

![JavaScript](https://img.shields.io/badge/JavaScript-ES_Modules-F7DF1E?logo=javascript&logoColor=111111)
![HTML5](https://img.shields.io/badge/HTML5-Mobile_First-E34F26?logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-Responsive-1572B6?logo=css3&logoColor=white)
![Storage](https://img.shields.io/badge/Storage-Local_Only-4F46E5)
![License](https://img.shields.io/badge/License-MIT-0F766E)

Computabilis is a small, mobile-first monthly finance calculator. It keeps income, expenses, budgets, and reports in the browser without accounts, servers, or bank integrations.

## Why I built it

I originally created Computabilis to help my partner do her everyday calculations at the beginning and end of each month. The goal is deliberately modest: make recurring personal finance work faster on a phone without asking her to learn a complex budgeting system or hand financial data to another service.

That constraint defines the project. Computabilis favors a short monthly workflow, clear totals, local storage, and portable backups over features that would add setup or maintenance.

## Features

- Monthly income, expense, balance, and remaining-budget totals.
- A separate expense budget for each month.
- Add, edit, filter, and delete entries.
- Brazilian real formatting with calculations stored as integer cents.
- Automatic persistence in the current browser.
- JSON backup and restoration for moving data between devices.
- Safe monthly CSV export.
- Printable monthly report.
- Light and dark themes.
- Responsive controls designed for phone use.
- Basic offline cache through a service worker.

## Privacy and storage

There is no login or backend. Data is stored in `localStorage` under the key `computabilis:v1` and remains on the device and browser where it was entered.

This also means browser data removal, private browsing, or a device change can erase the local copy. Use **Download backup** regularly and keep the JSON file somewhere safe. Restoring a backup replaces the data currently stored by Computabilis.

## Run locally

Service workers require an HTTP origin, so use any static file server instead of opening `index.html` directly. For example, with a previously installed Node.js environment:

```bash
npx serve .
```

Then open the local address printed by the server.

The published version is available at [luddevergard3n.github.io/Computabilis](https://luddevergard3n.github.io/Computabilis/).

## Tests

The project uses the Node.js test runner and has no runtime dependencies:

```bash
npm test
```

The tests cover currency parsing, integer-cent totals, month filtering, and validation of restored entries.

## Project structure

```text
Computabilis/
├── index.html       Interface and accessible form structure
├── app.js           State, calculations, persistence, backup, and rendering
├── style.css        Mobile-first responsive presentation
├── manifest.json    Web app metadata
├── sw.js            Offline cache
├── test/
│   └── app.test.js  Deterministic financial-logic checks
└── LICENSE
```

## Design decisions

- Money is stored as integer cents to avoid floating-point errors in totals.
- The selected month controls every summary instead of mixing data from different months.
- User-provided text is rendered with DOM text nodes rather than HTML injection.
- JSON is the canonical backup format; CSV is an export format for spreadsheets.
- No framework, database, authentication layer, analytics, or cloud service is required.

## Current limits

- Data is not automatically synchronized between devices.
- Notifications and bank imports are intentionally out of scope.
- Offline caching does not replace a JSON backup.
- The web manifest currently has no install icons; the site still works normally in a mobile browser.

## License

MIT License. See [LICENSE](LICENSE).
