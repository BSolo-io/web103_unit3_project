// server/config/reset.js
// Run with:  npm run reset
// Drops and rebuilds BOTH tables, then seeds them.

import { pool } from './database.js'

/* ------------------------------------------------------------------ *
 * Helper: build a date N days from today, as 'YYYY-MM-DD'.
 * Seeding relative to today means there are always past events AND
 * upcoming ones, so the countdown and the "event has passed" styling
 * both have something to show whenever you record your walkthrough.
 * ------------------------------------------------------------------ */
const dayOffset = (days) => {
    const d = new Date()
    d.setDate(d.getDate() + days)
    return d.toISOString().split('T')[0]
}

/* ----------------------------- Schema ----------------------------- */

const createTablesQuery = `
    DROP TABLE IF EXISTS events;
    DROP TABLE IF EXISTS locations;

    CREATE TABLE locations (
        id      SERIAL PRIMARY KEY,
        name    VARCHAR(100) NOT NULL,
        address VARCHAR(150) NOT NULL,
        city    VARCHAR(80)  NOT NULL,
        state   VARCHAR(40)  NOT NULL,
        zip     VARCHAR(20)  NOT NULL,
        image   TEXT         NOT NULL,
        blurb   TEXT         NOT NULL
    );

    CREATE TABLE events (
        id          SERIAL PRIMARY KEY,
        title       VARCHAR(150) NOT NULL,
        description TEXT         NOT NULL,
        date        DATE         NOT NULL,
        time        TIME         NOT NULL,
        image       TEXT         NOT NULL,
        location_id INTEGER      NOT NULL REFERENCES locations(id) ON DELETE CASCADE
    );
`
// `REFERENCES locations(id)` is a foreign key: it tells Postgres that
// events.location_id must match a real row in locations. That is why
// `events` is dropped BEFORE `locations` above — you cannot delete a table
// that another table still points at.

/* ------------------------------ Data ------------------------------ */

const locations = [
    {
        name: 'The Crossroads Hearth',
        address: '1 Ember Walk',
        city: 'Erebus',
        state: 'Underworld',
        zip: '00001',
        image: '/images/hearth.svg',
        blurb: "Hestia keeps the fire that never goes out. Everyone passes through here first."
    },
    {
        name: 'The Cistern of Tides',
        address: '44 Drowned Causeway',
        city: 'Oceanus',
        state: 'Underworld',
        zip: '00002',
        image: '/images/cistern.svg',
        blurb: "Poseidon's flooded amphitheatre. Bring footing you trust."
    },
    {
        name: "Demeter's Winterbound Grove",
        address: '7 Frostfall Row',
        city: 'Elysium',
        state: 'Underworld',
        zip: '00003',
        image: '/images/grove.svg',
        blurb: 'A grove held in permanent winter. Quiet, cold, and unexpectedly crowded.'
    },
    {
        name: 'The Thunder Terrace',
        address: '900 Olympus Overlook',
        city: 'Olympus',
        state: 'Above',
        zip: '00004',
        image: '/images/terrace.svg',
        blurb: 'Open-air, very loud, and struck by lightning roughly twice an hour.'
    }
]

// location_id matches the order above: 1 = Hearth, 2 = Cistern, 3 = Grove, 4 = Terrace
const events = [
    // --- The Crossroads Hearth -------------------------------------
    { title: 'Nightly Hearth Gathering',      description: 'Open to anyone making a run. Food, fire, and whatever gossip Hypnos is awake enough to share.', days: -12, time: '20:00:00', image: '/images/feast.svg',    location_id: 1 },
    { title: 'Scorch Technique Workshop',     description: 'Hestia walks newcomers through stacking fire damage without burning down the room.',            days: -2,  time: '18:30:00', image: '/images/ritual.svg',   location_id: 1 },
    { title: 'Keepsake Exchange',             description: 'Trade keepsakes with other shades. Bring something you actually want to part with.',             days: 3,   time: '17:00:00', image: '/images/market.svg',   location_id: 1 },
    { title: 'The Long Vigil',                description: 'An all-night sit by the fire before the solstice run. No combat, no speeches.',                  days: 18,  time: '22:00:00', image: '/images/feast.svg',    location_id: 1 },

    // --- The Cistern of Tides --------------------------------------
    { title: 'Tidewater Duels',               description: 'Knockback-only rules. The walls are the real opponent.',                                          days: -20, time: '19:00:00', image: '/images/duel.svg',     location_id: 2 },
    { title: 'Slip Trials: Open Bracket',     description: 'Anyone can enter. Most do not finish. Poseidon finds this hilarious.',                            days: -5,  time: '16:00:00', image: '/images/trial.svg',    location_id: 2 },
    { title: 'Depth Market',                  description: 'Salvage, shells and questionable charms, laid out along the causeway at low tide.',               days: 6,   time: '11:00:00', image: '/images/market.svg',   location_id: 2 },
    { title: 'The Flood Rite',                description: 'The cistern fills completely. Attendance is encouraged; swimming is mandatory.',                  days: 25,  time: '21:30:00', image: '/images/ritual.svg',   location_id: 2 },

    // --- Demeter's Winterbound Grove -------------------------------
    { title: 'Frostbound Meditation',         description: 'Two hours of sitting very still in the cold. Surprisingly popular.',                              days: -9,  time: '07:00:00', image: '/images/ritual.svg',   location_id: 3 },
    { title: 'Harvest of the Dead Season',    description: 'A feast assembled entirely from things that should not grow in winter.',                          days: -1,  time: '19:30:00', image: '/images/feast.svg',    location_id: 3 },
    { title: 'Freeze Stacking Clinic',        description: 'Demeter demonstrates how to lock a room down before it notices you arrived.',                     days: 9,   time: '15:00:00', image: '/images/trial.svg',    location_id: 3 },
    { title: 'The Thaw Negotiation',          description: 'An annual argument about when winter should end. It never ends early.',                           days: 31,  time: '13:00:00', image: '/images/market.svg',   location_id: 3 },

    // --- The Thunder Terrace ---------------------------------------
    { title: 'Open Bolt Sparring',            description: 'Bring your own lightning. Grounding is provided but not guaranteed.',                             days: -16, time: '18:00:00', image: '/images/duel.svg',     location_id: 4 },
    { title: 'Blitz Chain Exhibition',        description: 'Zeus clears a full arena without aiming once. Mostly a flex.',                                     days: -4,  time: '20:30:00', image: '/images/trial.svg',    location_id: 4 },
    { title: 'Storm Season Opening Feast',    description: 'Loud, overcrowded, and the single best meal on the terrace all year.',                            days: 2,   time: '19:00:00', image: '/images/feast.svg',    location_id: 4 },
    { title: 'The Thunder Tournament',        description: 'Four brackets, one champion, and a trophy nobody has ever managed to hold onto.',                 days: 14,  time: '12:00:00', image: '/images/duel.svg',     location_id: 4 }
]

/* ---------------------------- Seeding ----------------------------- */

const createTables = async () => {
    await pool.query(createTablesQuery)
    console.log('🗃️  Tables created (locations, events)')
}

const seedLocations = async () => {
    const query = `
        INSERT INTO locations (name, address, city, state, zip, image, blurb)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
    `
    for (const l of locations) {
        await pool.query(query, [l.name, l.address, l.city, l.state, l.zip, l.image, l.blurb])
        console.log(`   📍 ${l.name}`)
    }
}

const seedEvents = async () => {
    const query = `
        INSERT INTO events (title, description, date, time, image, location_id)
        VALUES ($1, $2, $3, $4, $5, $6)
    `
    for (const e of events) {
        await pool.query(query, [
            e.title,
            e.description,
            dayOffset(e.days),
            e.time,
            e.image,
            e.location_id
        ])
        console.log(`   🎟️  ${e.title}`)
    }
}

const reset = async () => {
    try {
        await createTables()
        await seedLocations()
        await seedEvents()
        console.log(`\n🎉 Seeded ${locations.length} locations and ${events.length} events.`)
    }
    catch (error) {
        console.error('❌ Reset failed:', error.message)
    }
    finally {
        await pool.end()
    }
}

reset()
