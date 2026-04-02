import axios from 'axios'

const API_BASE = '/api'
const authHeaders = (token) => ({
  headers: {
    Authorization: `Bearer ${token}`
  }
})

export const registerUser = async (payload) => {
  const response = await axios.post(`${API_BASE}/auth/register`, payload)
  return response.data
}

export const loginUser = async (payload) => {
  const response = await axios.post(`${API_BASE}/auth/login`, payload)
  return response.data
}

export const getCurrentUser = async (token) => {
  const response = await axios.get(`${API_BASE}/auth/me`, authHeaders(token))
  return response.data
}

export const getTours = async (params = {}) => {
  const response = await axios.get(`${API_BASE}/tours/`, { params })
  return response.data
}

export const getTourById = async (id) => {
  const response = await axios.get(`${API_BASE}/tours/${id}`)
  return response.data
}

export const createTour = async (tourData, token) => {
  const response = await axios.post(`${API_BASE}/tours/`, tourData, authHeaders(token))
  return response.data
}

export const updateTour = async (id, tourData, token) => {
  const response = await axios.put(`${API_BASE}/tours/${id}`, tourData, authHeaders(token))
  return response.data
}

export const deleteTour = async (id, force = false, token) => {
  await axios.delete(`${API_BASE}/tours/${id}`, {
    params: { force },
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
}

export const getBookings = async (token) => {
  const response = await axios.get(`${API_BASE}/bookings/`, authHeaders(token))
  return response.data
}

export const getBookingById = async (id, token) => {
  const response = await axios.get(`${API_BASE}/bookings/${id}`, authHeaders(token))
  return response.data
}

export const createBooking = async (bookingData) => {
  const response = await axios.post(`${API_BASE}/bookings/`, bookingData)
  return response.data
}

export const updateBooking = async (id, bookingData, token) => {
  const response = await axios.put(`${API_BASE}/bookings/${id}`, bookingData, authHeaders(token))
  return response.data
}

export const deleteBooking = async (id, token) => {
  await axios.delete(`${API_BASE}/bookings/${id}`, authHeaders(token))
}
