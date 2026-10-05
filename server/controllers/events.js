// server/controllers/events.js
import { pool } from '../config/database.js'

/* Why not just `SELECT *`?
 *
 * 1. A Postgres DATE comes back to JavaScript as a Date OBJECT. Putting an
 *    object straight into JSX crashes React with "Objects are not valid as a
 *    React child". TO_CHAR turns it into a string on the database side.
 *
 * 2. `remaining` is computed here rather than stored, because "how long until
 *    this event" changes every second. EXTRACT(EPOCH ...) gives seconds;
 *    multiplying by 1000 gives milliseconds, which is what JavaScript uses.
 *    It goes NEGATIVE once the event is in the past — that is what drives the
 *    "this event has passed" styling on the frontend.
 */
const EVENT_FIELDS = `
    id,
    title,
    description,
    image,
    location_id,
    TO_CHAR(date, 'Dy, Mon FMDD, YYYY') AS date,
    TO_CHAR(time, 'HH24:MI')            AS time,
    (EXTRACT(EPOCH FROM ((date + time) - LOCALTIMESTAMP)) * 1000)::double precision AS remaining
`

const getAllEvents = async (req, res) => {
    try {
        const results = await pool.query(
            `SELECT ${EVENT_FIELDS} FROM events ORDER BY events.date, events.time`
        )
        res.status(200).json(results.rows)
    }
    catch (error) {
        res.status(500).json({ error: error.message })
    }
}

const getEventById = async (req, res) => {
    try {
        const eventId = req.params.eventId

        const results = await pool.query(
            `SELECT ${EVENT_FIELDS} FROM events WHERE id = $1`,
            [eventId]
        )

        if (results.rows.length === 0) {
            return res.status(404).json({ error: 'Event not found' })
        }

        res.status(200).json(results.rows[0])
    }
    catch (error) {
        res.status(500).json({ error: error.message })
    }
}

const getEventsByLocationId = async (req, res) => {
    try {
        const locationId = req.params.locationId

        const results = await pool.query(
            `SELECT ${EVENT_FIELDS} FROM events WHERE location_id = $1 ORDER BY events.date, events.time`,
            [locationId]
        )

        res.status(200).json(results.rows)
    }
    catch (error) {
        res.status(500).json({ error: error.message })
    }
}

export default { getAllEvents, getEventById, getEventsByLocationId }
