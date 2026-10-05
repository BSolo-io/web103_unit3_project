// client/src/utilities/dates.jsx
// Pure formatting helpers. No fetching, no components — just turning
// values from the database into text a human wants to read.

// "19:30"  ->  "7:30 PM"
const formatTime = (time) => {
    if (!time) return ''

    const [rawHour, minute] = time.split(':')
    const hour = parseInt(rawHour, 10)

    const suffix = hour >= 12 ? 'PM' : 'AM'
    const hour12 = hour % 12 === 0 ? 12 : hour % 12

    return `${hour12}:${minute} ${suffix}`
}

// Milliseconds -> "Starts in 3 days, 4 hours" / "Passed 2 days ago"
// The server sends a NEGATIVE number once an event is in the past.
const formatRemainingTime = (remaining) => {
    const ms = Number(remaining)

    if (!Number.isFinite(ms)) return ''

    const hasPassed = ms < 0
    const absolute = Math.abs(ms)

    const days = Math.floor(absolute / 86400000)
    const hours = Math.floor((absolute % 86400000) / 3600000)
    const minutes = Math.floor((absolute % 3600000) / 60000)
    const seconds = Math.floor((absolute % 60000) / 1000)

    const plural = (n, word) => `${n} ${word}${n === 1 ? '' : 's'}`

    const parts = []
    if (days > 0) parts.push(plural(days, 'day'))
    if (hours > 0) parts.push(plural(hours, 'hour'))
    if (days === 0) parts.push(plural(minutes, 'minute'))
    if (days === 0 && hours === 0) parts.push(plural(seconds, 'second'))

    const text = parts.join(', ')

    return hasPassed ? `Passed ${text} ago` : `Starts in ${text}`
}

// Adds the red "this already happened" style from Event.css when the
// countdown has gone negative, and removes it when it hasn't.
const formatNegativeTimeRemaining = (remaining, id) => {
    const element = document.getElementById(`remaining-${id}`)

    if (!element) return

    if (Number(remaining) < 0) {
        element.classList.add('negative-time-remaining')
    }
    else {
        element.classList.remove('negative-time-remaining')
    }
}

export default { formatTime, formatRemainingTime, formatNegativeTimeRemaining }
