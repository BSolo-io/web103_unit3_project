import React, { useState, useEffect } from 'react'
import EventsAPI from '../services/EventsAPI'
import dates from '../utilities/dates'
import '../css/Event.css'

const Event = (props) => {

    const [event, setEvent] = useState(null)
    const [remainingMs, setRemainingMs] = useState(null)

    // 1. Fetch this single event from the API using the id passed in.
    useEffect(() => {
        (async () => {
            try {
                const eventData = await EventsAPI.getEventsById(props.id)
                setEvent(eventData)
                setRemainingMs(Number(eventData.remaining))
            }
            catch (error) {
                console.error(error)
            }
        })()
    }, [props.id])

    // 2. Tick the countdown down once a second so it is live, not frozen.
    //    The cleanup function is important — without it, every re-render
    //    would stack another interval on top of the last one.
    useEffect(() => {
        if (remainingMs === null) return

        const interval = setInterval(() => {
            setRemainingMs((previous) => previous - 1000)
        }, 1000)

        return () => clearInterval(interval)
    }, [remainingMs === null])

    // 3. Whenever the countdown changes, add or remove the "passed" styling.
    useEffect(() => {
        if (event && remainingMs !== null) {
            dates.formatNegativeTimeRemaining(remainingMs, event.id)
        }
    }, [remainingMs, event])

    if (!event) return null

    return (
        <article className='event-information'>
            <img src={event.image} alt={event.title} />

            <div className='event-information-overlay'>
                <div className='text'>
                    <h3>{event.title}</h3>
                    <p>
                        <i className="fa-regular fa-calendar fa-bounce"></i> {event.date}
                        <br /> {dates.formatTime(event.time)}
                    </p>
                    <p>{event.description}</p>
                    <p id={`remaining-${event.id}`}>
                        {dates.formatRemainingTime(remainingMs)}
                    </p>
                </div>
            </div>
        </article>
    )
}

export default Event
