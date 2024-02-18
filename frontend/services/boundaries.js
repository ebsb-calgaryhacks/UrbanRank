import axios from 'axios'

const BASE_URL = 'http://127.0.0.1:5000'

export async function getBoundaries() {
    try {
        const response = await axios.get(`${BASE_URL}/boundaries`)
        return response
    } catch (err) {
        console.error(err)
    }
}

