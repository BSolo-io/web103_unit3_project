// server/routes/locations.js
// Routes map a URL to a controller function. No database code lives here.

import express from 'express'
import LocationsController from '../controllers/locations.js'

const router = express.Router()

// These end up mounted under /api in server.js, so the full URLs are:
//   GET /api/locations
//   GET /api/locations/2
router.get('/locations', LocationsController.getAllLocations)
router.get('/locations/:locationId', LocationsController.getLocationById)

export default router
