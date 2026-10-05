// server/config/database.js
import pg from 'pg'
import dotenv from 'dotenv'

// NOTE: the assignment's snippet leaves this out, but it is required here.
// ES module imports are hoisted — they run before any other statement in the
// file that imports this one. So if reset.js called dotenv.config() itself,
// this file would already have been evaluated with an empty process.env.
// Loading it here guarantees the variables exist before `config` is built.
dotenv.config()

// Render requires SSL. A Postgres running on your own machine rejects it.
const isLocal =
    process.env.PGHOST === 'localhost' || process.env.PGHOST === '127.0.0.1'

const config = {
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    host: process.env.PGHOST,
    port: process.env.PGPORT,
    database: process.env.PGDATABASE,
    ssl: isLocal ? false : { rejectUnauthorized: false }
}

export const pool = new pg.Pool(config)
