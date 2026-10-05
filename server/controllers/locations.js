// server/controllers/locations.js
// A "controller" is just the function that actually talks to the database.
// Routes decide WHICH function runs; controllers decide WHAT it does.

import { pool } from '../config/database.js'

const getAllLocations = async (req, res) => {
    try {
        const results = await pool.query('SELECT * FROM locations ORDER BY id')
        res.status(200).json(results.rows)
    }
    catch (error) {
        res.status(500).json({ error: error.message })
    }
}

const getLocationById = async (req, res) => {
    try {
        const locationId = req.params.locationId

        const results = await pool.query(
            'SELECT * FROM locations WHERE id = $1',
            [locationId]
        )

        if (results.rows.length === 0) {
            return res.status(404).json({ error: 'Location not found' })
        }

        // One location, not a list — so send the single object.
        res.status(200).json(results.rows[0])
    }
    catch (error) {
        res.status(500).json({ error: error.message })
    }
}

export default { getAllLocations, getLocationById }
