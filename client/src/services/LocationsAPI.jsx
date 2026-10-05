// client/src/services/LocationsAPI.jsx
// Every call the frontend makes to the locations API lives here.
// Components import these functions instead of calling fetch() themselves,
// so if a URL ever changes you edit one file.
//
// The URLs start with /api — vite.config.js proxies anything starting with
// /api to http://localhost:3000, which is the Express server.

const getAllLocations = async () => {
    const response = await fetch('/api/locations')

    if (!response.ok) {
        throw new Error('Failed to fetch locations')
    }

    return response.json()
}

const getLocationById = async (id) => {
    const response = await fetch(`/api/locations/${id}`)

    if (!response.ok) {
        throw new Error(`Failed to fetch location ${id}`)
    }

    return response.json()
}

export default { getAllLocations, getLocationById }
