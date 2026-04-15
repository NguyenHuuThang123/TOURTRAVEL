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

export const loginWithGoogle = async (credential) => {
  const response = await axios.post(`${API_BASE}/auth/google`, { credential })
  return response.data
}

export const getCurrentUser = async (token) => {
  const response = await axios.get(`${API_BASE}/auth/me`, authHeaders(token))
  return response.data
}

export const updateCurrentUser = async (payload, token) => {
  const response = await axios.put(`${API_BASE}/auth/me`, payload, authHeaders(token))
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

export const getUsers = async (token) => {
  const response = await axios.get(`${API_BASE}/users/`, authHeaders(token))
  return response.data
}

export const createUserByAdmin = async (payload, token) => {
  const response = await axios.post(`${API_BASE}/users/`, payload, authHeaders(token))
  return response.data
}

export const updateUserByAdmin = async (id, payload, token) => {
  const response = await axios.put(`${API_BASE}/users/${id}`, payload, authHeaders(token))
  return response.data
}

export const toggleUserBlock = async (id, is_blocked, token) => {
  const response = await axios.patch(`${API_BASE}/users/${id}/block`, { is_blocked }, authHeaders(token))
  return response.data
}

export const deleteUserByAdmin = async (id, token) => {
  await axios.delete(`${API_BASE}/users/${id}`, authHeaders(token))
}

export const getBookingById = async (id, token) => {
  const response = await axios.get(`${API_BASE}/bookings/${id}`, authHeaders(token))
  return response.data
}

export const createBooking = async (bookingData, token) => {
  const config = token ? authHeaders(token) : undefined
  const response = await axios.post(`${API_BASE}/bookings/`, bookingData, config)
  return response.data
}

export const getMyBookings = async (token) => {
  const response = await axios.get(`${API_BASE}/bookings/my`, authHeaders(token))
  return response.data
}

export const cancelMyBooking = async (id, token) => {
  const response = await axios.put(`${API_BASE}/bookings/my/${id}/cancel`, {}, authHeaders(token))
  return response.data
}

export const updateBooking = async (id, bookingData, token) => {
  const response = await axios.put(`${API_BASE}/bookings/${id}`, bookingData, authHeaders(token))
  return response.data
}

export const deleteBooking = async (id, token) => {
  await axios.delete(`${API_BASE}/bookings/${id}`, authHeaders(token))
}
