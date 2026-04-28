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

export const getTourReviews = async (id) => {
  const response = await axios.get(`${API_BASE}/tours/${id}/reviews`)
  return response.data
}

export const getMyTourReview = async (id, token) => {
  const response = await axios.get(`${API_BASE}/tours/${id}/reviews/my`, authHeaders(token))
  return response.data
}

export const upsertMyTourReview = async (id, payload, token) => {
  const response = await axios.put(`${API_BASE}/tours/${id}/reviews/my`, payload, authHeaders(token))
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

export const getPublicBookingById = async (id) => {
  const response = await axios.get(`${API_BASE}/bookings/public/${id}`)
  return response.data
}

export const createBooking = async (bookingData, token) => {
  const config = token ? authHeaders(token) : undefined
  const response = await axios.post(`${API_BASE}/bookings/`, bookingData, config)
  return response.data
}

export const createVnpayPayment = async (payload, token) => {
  const config = token ? authHeaders(token) : undefined
  const response = await axios.post(`${API_BASE}/payments/vnpay/create`, payload, config)
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

export const getMyChatConversations = async (sessionKey, token) => {
  const response = await axios.get(`${API_BASE}/chat/conversations`, {
    params: { session_key: sessionKey || undefined },
    ...(token ? authHeaders(token) : {})
  })
  return response.data
}

export const getChatConversationDetail = async (conversationId, sessionKey, token) => {
  const response = await axios.get(`${API_BASE}/chat/conversations/${conversationId}`, {
    params: { session_key: sessionKey || undefined },
    ...(token ? authHeaders(token) : {})
  })
  return response.data
}

export const createChatConversation = async (payload, token) => {
  const response = await axios.post(`${API_BASE}/chat/conversations`, payload, token ? authHeaders(token) : undefined)
  return response.data
}

export const sendChatMessage = async (conversationId, payload, token) => {
  const response = await axios.post(`${API_BASE}/chat/conversations/${conversationId}/messages`, payload, token ? authHeaders(token) : undefined)
  return response.data
}

export const getAdminChatConversations = async (token) => {
  const response = await axios.get(`${API_BASE}/chat/admin/conversations`, authHeaders(token))
  return response.data
}

export const getAdminChatConversationDetail = async (conversationId, token) => {
  const response = await axios.get(`${API_BASE}/chat/admin/conversations/${conversationId}`, authHeaders(token))
  return response.data
}

export const sendAdminChatMessage = async (conversationId, payload, token) => {
  const response = await axios.post(`${API_BASE}/chat/admin/conversations/${conversationId}/messages`, payload, authHeaders(token))
  return response.data
}

export const getGuideTours = async (token) => {
  const response = await axios.get(`${API_BASE}/guides/me/tours`, authHeaders(token))
  return response.data
}

export const getGuideBookings = async (token) => {
  const response = await axios.get(`${API_BASE}/guides/me/bookings`, authHeaders(token))
  return response.data
}

export const guideCheckInBooking = async (qrContent, token) => {
  const response = await axios.post(`${API_BASE}/guides/me/check-in`, { qr_content: qrContent }, authHeaders(token))
  return response.data
}

export const getGuideChatConversations = async (token) => {
  const response = await axios.get(`${API_BASE}/chat/guide/conversations`, authHeaders(token))
  return response.data
}

export const getGuideChatConversationDetail = async (conversationId, token) => {
  const response = await axios.get(`${API_BASE}/chat/guide/conversations/${conversationId}`, authHeaders(token))
  return response.data
}

export const sendGuideChatMessage = async (conversationId, payload, token) => {
  const response = await axios.post(`${API_BASE}/chat/guide/conversations/${conversationId}/messages`, payload, authHeaders(token))
  return response.data
}
