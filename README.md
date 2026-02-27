# City Factory Online Platform (MVP)

React + TypeScript single-page app for **City Factory**, an urban innovation platform being developed by the **City of Espoo**.

## Run locally

1. Install dependencies:

```bash
npm install
```

2. Start the dev server:

```bash
npm run dev
```

Then open the URL shown in your terminal (usually `http://localhost:5173`).

## What’s included

- **Pages**: Home, Events, Projects, Get Involved, Feedback, Contact
- **Events API**: pulls upcoming Espoo events from Helsinki Linked Events
  - `https://api.hel.fi/linkedevents/v1/event/?data_source=espoo&start=now&sort=start_time&page_size=20`
- **Projects**: realistic MVP placeholder projects
- **Feedback MVP**:
  - Generates reference numbers like `CF-YYYYMMDD-XXXX`
  - Stores submissions in **browser localStorage** (prototype)
  - Status lookup page at `/feedback/status`
- **Espoo.fi-inspired styling**: clean layout, Espoo-like primary blue, accessible 16px+ base text

## Notes (MVP prototype)

- **Language toggle** (EN/FI) is UI-only for now (content is still English).
- **Photo upload** field exists in Feedback, but photos are not stored yet.

