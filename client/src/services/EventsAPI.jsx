// client/src/services/EventsAPI.jsx

const getAllEvents = async () => {
    const response = await fetch('/api/events')

    if (!response.ok) {
        throw new Error('Failed to fetch events')
    }

    return response.json()
}

// Named getEventsById (not getEventById) because that is the name the
// starter's Event.jsx already calls. Keeping it avoids editing that call.
const getEventsById = async (id) => {
    const response = await fetch(`/api/events/${id}`)

    if (!response.ok) {
        throw new Error(`Failed to fetch event ${id}`)
    }

    return response.json()
}

const getEventsByLocationId = async (locationId) => {
    const response = await fetch(`/api/events/location/${locationId}`)

    if (!response.ok) {
        throw new Error(`Failed to fetch events for location ${locationId}`)
    }

    return response.json()
}

export default { getAllEvents, getEventsById, getEventsByLocationId }
