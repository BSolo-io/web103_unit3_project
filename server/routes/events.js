// server/routes/events.js
import express from 'express'
import EventsController from '../controllers/events.js'

const router = express.Router()

// Mounted under /api, so:
//   GET /api/events
//   GET /api/events/7
//   GET /api/events/location/2
//
// ORDER MATTERS. '/events/location/:locationId' must come before
// '/events/:eventId' would ever match something like '/events/location'.
// Express checks top to bottom and stops at the first match.
router.get('/events', EventsController.getAllEvents)
router.get('/events/location/:locationId', EventsController.getEventsByLocationId)
router.get('/events/:eventId', EventsController.getEventById)

export default router
