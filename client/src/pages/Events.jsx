import React, { useState, useEffect } from 'react'
import Event from '../components/Event'
import EventsAPI from '../services/EventsAPI'
import LocationsAPI from '../services/LocationsAPI'
import '../css/Events.css'

// Stretch feature: every event in the database on one page,
// with a dropdown to narrow it down to a single location.
const Events = () => {
    const [events, setEvents] = useState([])
    const [locations, setLocations] = useState([])
    const [selectedLocation, setSelectedLocation] = useState('all')

    // Load the dropdown options once.
    useEffect(() => {
        (async () => {
            try {
                const locationsData = await LocationsAPI.getAllLocations()
                setLocations(locationsData)
            }
            catch (error) {
                console.error(error)
            }
        })()
    }, [])

    // Re-run whenever the dropdown changes. Note that filtering happens on
    // the SERVER — picking a location calls a different endpoint rather than
    // fetching everything and hiding rows in the browser.
    useEffect(() => {
        (async () => {
            try {
                const eventsData = selectedLocation === 'all'
                    ? await EventsAPI.getAllEvents()
                    : await EventsAPI.getEventsByLocationId(selectedLocation)

                setEvents(eventsData)
            }
            catch (error) {
                console.error(error)
            }
        })()
    }, [selectedLocation])

    return (
        <div className='all-events'>
            <header>
                <h2>All Events</h2>

                <label htmlFor='location-filter'>Filter by location</label>
                <select
                    id='location-filter'
                    value={selectedLocation}
                    onChange={(e) => setSelectedLocation(e.target.value)}
                >
                    <option value='all'>All locations</option>
                    {locations.map((location) =>
                        <option key={location.id} value={location.id}>
                            {location.name}
                        </option>
                    )}
                </select>
            </header>

            <main>
                {
                    events && events.length > 0 ? events.map((event) =>
                        <Event
                            key={event.id}
                            id={event.id}
                            title={event.title}
                            date={event.date}
                            time={event.time}
                            image={event.image}
                        />
                    ) : <h2><i className="fa-regular fa-calendar-xmark fa-shake"></i> {'No events found.'}</h2>
                }
            </main>
        </div>
    )
}

export default Events
