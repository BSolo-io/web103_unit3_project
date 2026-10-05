# WEB103 Project 3 - *The Four Shrines*

Submitted by: **Borys Solorzano**

About this web app: **A virtual community space for the Underworld of Hades II. Four shrines — Hestia's Hearth, Poseidon's Cistern, Demeter's Winterbound Grove, and Zeus's Thunder Terrace — are laid out on an interactive map. Hovering a building reveals its name; clicking it opens that shrine's page with every event scheduled there, each with a live countdown. Past events are struck through in red.**

Time spent: **[X]** hours

## Required Features

The following **required** functionality is completed:

<!-- Make sure to check off completed functionality below -->
- [x] **The web app uses React to display data from the API**
- [x] **The web app is connected to a PostgreSQL database**
  - [x] **The web app is connected to a Render PostgreSQL database**
  - [x] **The database contains an appropriately structured `events` table**
- [x] **Front page of web app is functional and appropriately styled**
  - [x] **The web app displays a title**
  - [x] **Website includes a visual interface that allows users to select a location they would like to view**
- [x] **Each location has a corresponding page**
  - [x] **Each location has a detail page with its own unique URL**
  - [x] **Clicking on a location navigates to its corresponding detail page and displays a list of all events from the `events` table associated with that location**

The following **optional** features are implemented:

- [x] **The app includes an additional Events page**
  - [x] An additional page shows all possible events
  - [x] Users can sort or filter events by location
- [x] **Each Event includes a countdown to when the Event will occur**
  - [x] Events display a countdown showing the time remaining before that event
  - [x] Events appear with different formatting when the event has passed

The following **additional** features are implemented:

- [x] The countdown is live — it ticks down once per second rather than being frozen at page load
- [x] Filtering on the Events page happens server-side, hitting `/api/events/location/:id` rather than filtering an already-downloaded array in the browser
- [x] All event artwork is original SVG, generated rather than hotlinked, so nothing breaks if an external host goes down
- [x] Seed dates are generated relative to today, so there are always both upcoming and past events to demonstrate

## Video Walkthrough

Here's a walkthrough of implemented required features:

<img src='./walkthrough.gif' title='Video Walkthrough' width='' alt='Video Walkthrough' />

GIF created with [ScreenToGif](https://www.screentogif.com/)

## Database Schema

**`locations`**

| Column | Type | Notes |
|---|---|---|
| `id` | SERIAL PRIMARY KEY | |
| `name` | VARCHAR(100) | drives the hover labels on the map |
| `address`, `city`, `state`, `zip` | VARCHAR | shown in the page header |
| `image` | TEXT | banner art |
| `blurb` | TEXT | one-line description |

**`events`**

| Column | Type | Notes |
|---|---|---|
| `id` | SERIAL PRIMARY KEY | |
| `title` | VARCHAR(150) | |
| `description` | TEXT | |
| `date` | DATE | |
| `time` | TIME | |
| `image` | TEXT | |
| `location_id` | INTEGER REFERENCES locations(id) | foreign key |

`remaining` is **not** a column. It's computed per request:

```sql
(EXTRACT(EPOCH FROM ((date + time) - LOCALTIMESTAMP)) * 1000)::double precision AS remaining
```

It goes negative once the event is in the past, which is what drives the red "has passed" styling.

## API Endpoints

| Method | Route | Returns |
|---|---|---|
| GET | `/api/locations` | all locations |
| GET | `/api/locations/:locationId` | one location |
| GET | `/api/events` | all events |
| GET | `/api/events/:eventId` | one event |
| GET | `/api/events/location/:locationId` | all events at one location |

## Running It Locally

```bash
npm install
# create server/.env with your Render credentials (see .env.example)
npm run reset   # creates and seeds both tables
npm run dev     # vite on :5173, express on :3000
```

## Notes

The bug that cost the most time was a SQL one with no error message attached. Events were coming back in a nonsensical order: Oct 30, Oct 11, Sep 15, Sep 30. The cause was that the SELECT aliases the date column for display:

```sql
TO_CHAR(date, 'Dy, Mon FMDD, YYYY') AS date
...
ORDER BY date
```

In SQL, `ORDER BY` prefers an *output alias* over the source column when the names collide. So it was sorting the formatted **string** alphabetically by weekday abbreviation — Fri, Sun, Tue, Wed. Qualifying it as `ORDER BY events.date` forces the real column and fixes it. Nothing throws; the data is just quietly wrong.

The reason the date gets formatted in SQL at all is that a Postgres `DATE` arrives in JavaScript as a `Date` object, and rendering an object in JSX crashes React with "Objects are not valid as a React child."

Two things in the starter don't run as shipped: `App.jsx` imports `./pages/Events`, which doesn't exist until you create it, and `Event.jsx` calls `EventsAPI` and `dates` without importing either.

Finally, `dotenv.config()` had to move into `database.js`. ES module imports are hoisted, so calling `dotenv.config()` inside `reset.js` before importing the pool would still run *after* `database.js` had already been evaluated against an empty `process.env`.

## License

Copyright [2026] [Borys Solorzano]

Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at

> http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
