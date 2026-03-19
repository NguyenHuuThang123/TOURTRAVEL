import axios from 'axios'

const API_BASE = '/api'

export const getTours = async () => {
  try {
    const response = await axios.get(`${API_BASE}/tours`)
    return response.data
  } catch (error) {
    console.error('Error fetching tours:', error)
    throw error
  }
}

export const getTourById = async (id) => {
  try {
    const response = await axios.get(`${API_BASE}/tours/${id}`)
    return response.data
  } catch (error) {
    console.error('Error fetching tour:', error)
    throw error
  }
}

export const createBooking = async (bookingData) => {
  try {
    const response = await axios.post(`${API_BASE}/bookings`, bookingData)
    return response.data
  } catch (error) {
    console.error('Error creating booking:', error)
    throw error
  }
}
