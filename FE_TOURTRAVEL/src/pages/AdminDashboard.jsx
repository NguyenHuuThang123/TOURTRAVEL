import { useEffect, useMemo, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import {
  getAdminChatConversationDetail,
  getAdminChatConversations,
  createTour,
  createUserByAdmin,
  deleteBooking,
  deleteTour,
  deleteUserByAdmin,
  getBookings,
  getTours,
  getUsers,
  sendAdminChatMessage,
  toggleUserBlock,
  updateBooking,
  updateTour,
  updateUserByAdmin
} from '../api/tourService'

const initialTour = {
  id: '',
  name: '',
  description: '',
  destination: '',
  price: 0,
  duration_days: 1,
  max_participants: 1,
  available_slots: 1,
  start_date: '',
  end_date: '',
  image: '',
  travel_style: ''
}

const initialUser = {
  id: '',
  name: '',
  email: '',
  phone: '',
  password: '',
  role: 'user',
  is_blocked: false
}

const sidebarItems = [
  { id: 'bookings', label: 'Bookings', icon: 'BK' },
  { id: 'chats', label: 'Chats', icon: 'CH' },
  { id: 'tours', label: 'Tours', icon: 'TR' },
  { id: 'users', label: 'Users', icon: 'US' },
  { id: 'editor', label: 'Tour Editor', icon: 'ED' }
]

function toDateTimeLocal(value) {
  if (!value) return ''
  return new Date(value).toISOString().slice(0, 16)
}

function formatCurrency(value) {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0
  }).format((value || 0) * 26000)
}

function formatDateTime(value) {
  if (!value) return '-'
  return new Date(value).toLocaleString('vi-VN')
}

function titleForSection(section) {
  if (section === 'bookings') return 'All Bookings'
  if (section === 'chats') return 'Customer Chats'
  if (section === 'tours') return 'Tour Inventory'
  if (section === 'users') return 'User Management'
  if (section === 'user-editor') return 'Create / Update User'
  return 'Create / Update Tour'
}

export default function AdminDashboard() {
  const { token, user, logout } = useAuth()
  const [activeSection, setActiveSection] = useState('bookings')
  const [tourForm, setTourForm] = useState(initialTour)
  const [userForm, setUserForm] = useState(initialUser)
  const [tours, setTours] = useState([])
  const [bookings, setBookings] = useState([])
  const [users, setUsers] = useState([])
  const [chatConversations, setChatConversations] = useState([])
  const [activeChat, setActiveChat] = useState(null)
  const [chatReply, setChatReply] = useState('')
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [bookingStatusFilter, setBookingStatusFilter] = useState('all')
  const [tourStockFilter, setTourStockFilter] = useState('all')
  const [userRoleFilter, setUserRoleFilter] = useState('all')
  const [userBlockFilter, setUserBlockFilter] = useState('all')

  useEffect(() => {
    if (token) {
      loadData()
    }
  }, [token])

  const loadData = async () => {
    try {
      setLoading(true)
      const [tourData, bookingData, userData, chatData] = await Promise.all([
        getTours(),
        getBookings(token),
        getUsers(token),
        getAdminChatConversations(token)
      ])
      setTours(tourData)
      setBookings(bookingData)
      setUsers(userData)
      setChatConversations(chatData)
      if (chatData.length && !activeChat) {
        const detail = await getAdminChatConversationDetail(chatData[0].id, token)
        setActiveChat(detail)
      }
      setError('')
    } catch (err) {
      setError(err.response?.data?.detail || 'Không thể tải dữ liệu quản trị.')
    } finally {
      setLoading(false)
    }
  }

  const dashboardStats = useMemo(() => {
    const confirmedRevenue = bookings
      .filter((booking) => booking.status === 'confirmed')
      .reduce((sum, booking) => sum + booking.total_price, 0)

    return [
      { label: 'All bookings', value: bookings.length, note: 'Tổng booking trong hệ thống' },
      { label: 'Users', value: users.length, note: 'Tài khoản đang được quản lý' },
      { label: 'Blocked users', value: users.filter((item) => item.is_blocked).length, note: 'Người dùng đang bị chặn' },
      { label: 'Revenue', value: formatCurrency(confirmedRevenue), note: 'Thu nhập từ đơn đã chốt' }
    ]
  }, [bookings, users])

  const filteredBookings = useMemo(() => {
    return bookings.filter((booking) => {
      const matchesStatus = bookingStatusFilter === 'all' || booking.status === bookingStatusFilter
      const keyword = search.trim().toLowerCase()
      const matchesSearch =
        !keyword ||
        booking.tour_name.toLowerCase().includes(keyword) ||
        booking.user_name.toLowerCase().includes(keyword) ||
        booking.user_email.toLowerCase().includes(keyword)
      return matchesStatus && matchesSearch
    })
  }, [bookingStatusFilter, bookings, search])

  const filteredChats = useMemo(() => {
    return chatConversations.filter((item) => {
      const keyword = search.trim().toLowerCase()
      return (
        !keyword ||
        item.user_name.toLowerCase().includes(keyword) ||
        (item.user_email || '').toLowerCase().includes(keyword) ||
        item.last_message_preview.toLowerCase().includes(keyword)
      )
    })
  }, [chatConversations, search])

  const filteredTours = useMemo(() => {
    return tours.filter((tour) => {
      const keyword = search.trim().toLowerCase()
      const matchesSearch =
        !keyword ||
        tour.name.toLowerCase().includes(keyword) ||
        tour.destination.toLowerCase().includes(keyword)

      const matchesStock =
        tourStockFilter === 'all' ||
        (tourStockFilter === 'low' && tour.available_slots <= 5) ||
        (tourStockFilter === 'available' && tour.available_slots > 5)

      return matchesSearch && matchesStock
    })
  }, [search, tourStockFilter, tours])

  const filteredUsers = useMemo(() => {
    return users.filter((item) => {
      const keyword = search.trim().toLowerCase()
      const matchesSearch =
        !keyword ||
        item.name.toLowerCase().includes(keyword) ||
        item.email.toLowerCase().includes(keyword) ||
        (item.phone || '').toLowerCase().includes(keyword)

      const matchesRole = userRoleFilter === 'all' || item.role === userRoleFilter
      const matchesBlocked =
        userBlockFilter === 'all' ||
        (userBlockFilter === 'blocked' && item.is_blocked) ||
        (userBlockFilter === 'active' && !item.is_blocked)

      return matchesSearch && matchesRole && matchesBlocked
    })
  }, [search, userRoleFilter, userBlockFilter, users])

  const resetTourForm = () => {
    setTourForm(initialTour)
  }

  const resetUserForm = () => {
    setUserForm(initialUser)
  }

  const handleTourSubmit = async (event) => {
    event.preventDefault()
    try {
      setError('')
      setMessage('')

      const payload = {
        ...tourForm,
        price: Number(tourForm.price),
        duration_days: Number(tourForm.duration_days),
        max_participants: Number(tourForm.max_participants),
        available_slots: Number(tourForm.available_slots),
        start_date: new Date(tourForm.start_date).toISOString(),
        end_date: new Date(tourForm.end_date).toISOString()
      }

      if (tourForm.id) {
        await updateTour(tourForm.id, payload, token)
        setMessage('Cập nhật tour thành công.')
      } else {
        await createTour(payload, token)
        setMessage('Thêm tour mới thành công.')
      }

      resetTourForm()
      setActiveSection('tours')
      await loadData()
    } catch (err) {
      setError(err.response?.data?.detail || 'Không thể lưu tour.')
    }
  }

  const handleUserSubmit = async (event) => {
    event.preventDefault()
    try {
      setError('')
      setMessage('')

      const payload = {
        name: userForm.name,
        email: userForm.email,
        phone: userForm.phone || null,
        role: userForm.role,
        is_blocked: userForm.is_blocked
      }

      if (userForm.id) {
        await updateUserByAdmin(userForm.id, { ...payload, password: userForm.password || null }, token)
        setMessage('Cập nhật user thành công.')
      } else {
        await createUserByAdmin({ ...payload, password: userForm.password }, token)
        setMessage('Tạo user mới thành công.')
      }

      resetUserForm()
      setActiveSection('users')
      await loadData()
    } catch (err) {
      setError(err.response?.data?.detail || 'Không thể lưu user.')
    }
  }

  const handleEditTour = (tour) => {
    setTourForm({
      ...tour,
      start_date: toDateTimeLocal(tour.start_date),
      end_date: toDateTimeLocal(tour.end_date)
    })
    setActiveSection('editor')
  }

  const handleEditUser = (selectedUser) => {
    setUserForm({
      id: selectedUser.id,
      name: selectedUser.name,
      email: selectedUser.email,
      phone: selectedUser.phone || '',
      password: '',
      role: selectedUser.role,
      is_blocked: Boolean(selectedUser.is_blocked)
    })
    setActiveSection('user-editor')
  }

  const handleDeleteTour = async (tourId) => {
    try {
      await deleteTour(tourId, true, token)
      setMessage('Đã xóa tour.')
      await loadData()
    } catch (err) {
      setError(err.response?.data?.detail || 'Không thể xóa tour.')
    }
  }

  const handleDeleteUser = async (userId) => {
    try {
      await deleteUserByAdmin(userId, token)
      setMessage('Đã xóa user.')
      await loadData()
    } catch (err) {
      setError(err.response?.data?.detail || 'Không thể xóa user.')
    }
  }

  const handleToggleBlock = async (selectedUser) => {
    try {
      await toggleUserBlock(selectedUser.id, !selectedUser.is_blocked, token)
      setMessage(selectedUser.is_blocked ? 'Đã bỏ chặn user.' : 'Đã chặn user.')
      await loadData()
    } catch (err) {
      setError(err.response?.data?.detail || 'Không thể cập nhật trạng thái user.')
    }
  }

  const handleBookingStatus = async (bookingId, status) => {
    try {
      await updateBooking(bookingId, { status }, token)
      setMessage('Đã cập nhật trạng thái đơn.')
      await loadData()
    } catch (err) {
      setError(err.response?.data?.detail || 'Không thể cập nhật đơn.')
    }
  }

  const handleDeleteBooking = async (bookingId) => {
    try {
      await deleteBooking(bookingId, token)
      setMessage('Đã xóa đơn.')
      await loadData()
    } catch (err) {
      setError(err.response?.data?.detail || 'Không thể xóa đơn.')
    }
  }

  const handleOpenChat = async (conversationId) => {
    try {
      setLoading(true)
      const detail = await getAdminChatConversationDetail(conversationId, token)
      setActiveChat(detail)
      setChatConversations((prev) => prev.map((item) => (item.id === detail.conversation.id ? detail.conversation : item)))
      setError('')
    } catch (err) {
      setError(err.response?.data?.detail || 'Không thể tải hội thoại.')
    } finally {
      setLoading(false)
    }
  }

  const handleSendChatReply = async (event) => {
    event.preventDefault()
    if (!activeChat?.conversation?.id || !chatReply.trim()) return

    try {
      setError('')
      setMessage('')
      const detail = await sendAdminChatMessage(activeChat.conversation.id, { content: chatReply.trim() }, token)
      setActiveChat(detail)
      setChatReply('')
      setMessage('Đã gửi phản hồi cho khách hàng.')
      setChatConversations((prev) => {
        const next = prev.filter((item) => item.id !== detail.conversation.id)
        return [detail.conversation, ...next]
      })
    } catch (err) {
      setError(err.response?.data?.detail || 'Không thể gửi phản hồi.')
    }
  }

  const renderBookingsTable = () => (
    <div className="admin-table-wrap">
      <div className="admin-section-header">
        <div>
          <h2>All Bookings</h2>
          <p>Danh sách booking mới nhất và trạng thái xử lý.</p>
        </div>
      </div>

      <div className="admin-table">
        <div className="admin-table-head">
          <span>Service / Tour</span>
          <span>Customer</span>
          <span>Created Date</span>
          <span>Schedule</span>
          <span>List Price</span>
          <span>Total Amount</span>
          <span>Status</span>
          <span>Actions</span>
        </div>

        {filteredBookings.map((booking) => (
          <article key={booking.id} className="admin-table-row">
            <div>
              <strong>{booking.tour_name}</strong>
              <small>ID: {booking.id.slice(-6)}</small>
            </div>
            <div>
              <strong>{booking.user_name}</strong>
              <small>{booking.user_email}</small>
            </div>
            <div>
              <strong>{new Date(booking.created_at).toLocaleDateString('vi-VN')}</strong>
              <small>{new Date(booking.created_at).toLocaleTimeString('vi-VN')}</small>
            </div>
            <div>
              <strong>{booking.quantity} khach</strong>
              <small>{booking.user_phone}</small>
            </div>
            <div>{formatCurrency(booking.total_price / booking.quantity)}</div>
            <div>
              <span className="admin-amount-chip">{formatCurrency(booking.total_price)}</span>
            </div>
            <div>
              <span className={`admin-status-chip admin-status-${booking.status}`}>{booking.status}</span>
            </div>
            <div className="admin-row-actions">
              <button className="admin-link-btn" onClick={() => handleBookingStatus(booking.id, 'confirmed')}>Confirm</button>
              <button className="admin-link-btn danger" onClick={() => handleBookingStatus(booking.id, 'cancelled')}>Cancel</button>
              <button className="admin-link-btn" onClick={() => handleDeleteBooking(booking.id)}>Delete</button>
            </div>
          </article>
        ))}

        {!filteredBookings.length && !loading && <div className="admin-empty-row">Không có booking phù hợp.</div>}
      </div>
    </div>
  )

  const renderToursTable = () => (
    <div className="admin-table-wrap">
      <div className="admin-section-header">
        <div>
          <h2>All Tours</h2>
          <p>Quản lý sản phẩm tour và tồn kho trong hệ thống.</p>
        </div>
      </div>

      <div className="admin-table">
        <div className="admin-table-head admin-tour-head">
          <span>Tour</span>
          <span>Destination</span>
          <span>Duration</span>
          <span>Price</span>
          <span>Slots</span>
          <span>Style</span>
          <span>Actions</span>
        </div>

        {filteredTours.map((tour) => (
          <article key={tour.id} className="admin-table-row admin-tour-row">
            <div className="admin-tour-name-cell">
              <div className="admin-tour-thumb" style={{ backgroundImage: `url(${tour.image || 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800'})` }} />
              <div>
                <strong>{tour.name}</strong>
                <small>{new Date(tour.start_date).toLocaleDateString('vi-VN')}</small>
              </div>
            </div>
            <div>{tour.destination}</div>
            <div>{tour.duration_days} ngay</div>
            <div>{formatCurrency(tour.price)}</div>
            <div>
              <span className={`admin-status-chip ${tour.available_slots <= 5 ? 'admin-status-low' : 'admin-status-open'}`}>
                {tour.available_slots}/{tour.max_participants}
              </span>
            </div>
            <div>{tour.travel_style || 'General'}</div>
            <div className="admin-row-actions">
              <button className="admin-link-btn" onClick={() => handleEditTour(tour)}>Edit</button>
              <button className="admin-link-btn danger" onClick={() => handleDeleteTour(tour.id)}>Delete</button>
            </div>
          </article>
        ))}

        {!filteredTours.length && !loading && <div className="admin-empty-row">Không có tour phù hợp.</div>}
      </div>
    </div>
  )

  const renderChatsPanel = () => (
    <div className="admin-chat-layout">
      <section className="admin-chat-list-wrap">
        <div className="admin-section-header">
          <div>
            <h2>Customer chats</h2>
            <p>Theo dõi yêu cầu mới và mở từng hội thoại để trả lời.</p>
          </div>
        </div>

        <div className="admin-chat-list">
          {filteredChats.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`admin-chat-list-item ${activeChat?.conversation?.id === item.id ? 'active' : ''}`}
              onClick={() => handleOpenChat(item.id)}
            >
              <div>
                <strong>{item.user_name}</strong>
                <span>{item.user_email || 'Khach vang lai'}</span>
                <p>{item.last_message_preview}</p>
              </div>
              <div className="admin-chat-item-side">
                <small>{formatDateTime(item.last_message_at)}</small>
                {!!item.unread_for_admin && <em>{item.unread_for_admin} moi</em>}
              </div>
            </button>
          ))}

          {!filteredChats.length && !loading && <div className="admin-empty-row">Chưa có hội thoại phù hợp.</div>}
        </div>
      </section>

      <section className="admin-chat-thread">
        <div className="admin-section-header">
          <div>
            <h2>{activeChat?.conversation?.user_name || 'Chon mot hoi thoai'}</h2>
            <p>
              {activeChat?.conversation
                ? `${activeChat.conversation.user_email || 'Khach vang lai'} • Trang thai ${activeChat.conversation.status}`
                : 'Chọn một cuộc trò chuyện bên trái để xem nội dung.'}
            </p>
          </div>
        </div>

        <div className="admin-chat-messages">
          {activeChat?.messages?.map((message) => (
            <article key={message.id} className={`admin-chat-bubble ${message.sender_type === 'admin' ? 'admin' : 'customer'}`}>
              <strong>{message.sender_name}</strong>
              <p>{message.content}</p>
              <small>{formatDateTime(message.created_at)}</small>
            </article>
          ))}

          {!activeChat?.messages?.length && <div className="admin-empty-row">Chưa có tin nhắn để hiển thị.</div>}
        </div>

        <form className="admin-chat-compose" onSubmit={handleSendChatReply}>
          <textarea
            rows="4"
            placeholder="Nhap phan hoi cho khach hang..."
            value={chatReply}
            onChange={(event) => setChatReply(event.target.value)}
          />
          <button type="submit" className="admin-green-btn" disabled={!activeChat?.conversation?.id || !chatReply.trim()}>
            Gui phan hoi
          </button>
        </form>
      </section>
    </div>
  )

  const renderUsersTable = () => (
    <div className="admin-table-wrap">
      <div className="admin-section-header">
        <div>
          <h2>All Users</h2>
          <p>Quản lý tài khoản, phân quyền admin hoặc chặn người dùng.</p>
        </div>
      </div>

      <div className="admin-table">
        <div className="admin-table-head admin-user-head">
          <span>User</span>
          <span>Contact</span>
          <span>Role</span>
          <span>Status</span>
          <span>Created</span>
          <span>Actions</span>
        </div>

        {filteredUsers.map((item) => (
          <article key={item.id} className="admin-table-row admin-user-row">
            <div className="admin-tour-name-cell">
              <div className="admin-user-mini-avatar">{item.name?.slice(0, 1) || 'U'}</div>
              <div>
                <strong>{item.name}</strong>
                <small>ID: {item.id.slice(-6)}</small>
              </div>
            </div>
            <div>
              <strong>{item.email}</strong>
              <small>{item.phone || 'Chua co so dien thoai'}</small>
            </div>
            <div>
              <span className={`admin-status-chip ${item.role === 'admin' ? 'admin-status-open' : 'admin-status-neutral'}`}>
                {item.role}
              </span>
            </div>
            <div>
              <span className={`admin-status-chip ${item.is_blocked ? 'admin-status-cancelled' : 'admin-status-open'}`}>
                {item.is_blocked ? 'blocked' : 'active'}
              </span>
            </div>
            <div>{formatDateTime(item.created_at)}</div>
            <div className="admin-row-actions">
              <button className="admin-link-btn" onClick={() => handleEditUser(item)}>Edit</button>
              <button className={`admin-link-btn ${item.is_blocked ? '' : 'danger'}`} onClick={() => handleToggleBlock(item)}>
                {item.is_blocked ? 'Unblock' : 'Block'}
              </button>
              <button className="admin-link-btn danger" onClick={() => handleDeleteUser(item.id)}>Delete</button>
            </div>
          </article>
        ))}

        {!filteredUsers.length && !loading && <div className="admin-empty-row">Không có user phù hợp.</div>}
      </div>
    </div>
  )

  const renderTourEditor = () => (
    <div className="admin-editor-wrap">
      <div className="admin-section-header">
        <div>
          <h2>{tourForm.id ? 'Edit Tour' : 'Create Tour'}</h2>
          <p>Tạo mới hoặc cập nhật tour trong dashboard admin.</p>
        </div>
      </div>

      <form onSubmit={handleTourSubmit} className="admin-editor-form">
        <label className="admin-editor-field admin-span-2">
          <span>Tour name</span>
          <input required value={tourForm.name} onChange={(event) => setTourForm((prev) => ({ ...prev, name: event.target.value }))} />
        </label>

        <label className="admin-editor-field admin-span-2">
          <span>Description</span>
          <textarea required rows="4" value={tourForm.description} onChange={(event) => setTourForm((prev) => ({ ...prev, description: event.target.value }))} />
        </label>

        <label className="admin-editor-field">
          <span>Destination</span>
          <input required value={tourForm.destination} onChange={(event) => setTourForm((prev) => ({ ...prev, destination: event.target.value }))} />
        </label>

        <label className="admin-editor-field">
          <span>Style</span>
          <input value={tourForm.travel_style} onChange={(event) => setTourForm((prev) => ({ ...prev, travel_style: event.target.value }))} />
        </label>

        <label className="admin-editor-field admin-span-2">
          <span>Image URL</span>
          <input value={tourForm.image} onChange={(event) => setTourForm((prev) => ({ ...prev, image: event.target.value }))} />
        </label>

        <label className="admin-editor-field">
          <span>Price</span>
          <input required type="number" min="1" value={tourForm.price} onChange={(event) => setTourForm((prev) => ({ ...prev, price: event.target.value }))} />
        </label>

        <label className="admin-editor-field">
          <span>Duration</span>
          <input required type="number" min="1" value={tourForm.duration_days} onChange={(event) => setTourForm((prev) => ({ ...prev, duration_days: event.target.value }))} />
        </label>

        <label className="admin-editor-field">
          <span>Max participants</span>
          <input required type="number" min="1" value={tourForm.max_participants} onChange={(event) => setTourForm((prev) => ({ ...prev, max_participants: event.target.value }))} />
        </label>

        <label className="admin-editor-field">
          <span>Available slots</span>
          <input required type="number" min="0" value={tourForm.available_slots} onChange={(event) => setTourForm((prev) => ({ ...prev, available_slots: event.target.value }))} />
        </label>

        <label className="admin-editor-field">
          <span>Start date</span>
          <input required type="datetime-local" value={tourForm.start_date} onChange={(event) => setTourForm((prev) => ({ ...prev, start_date: event.target.value }))} />
        </label>

        <label className="admin-editor-field">
          <span>End date</span>
          <input required type="datetime-local" value={tourForm.end_date} onChange={(event) => setTourForm((prev) => ({ ...prev, end_date: event.target.value }))} />
        </label>

        <div className="admin-editor-actions admin-span-2">
          <button type="submit" className="admin-green-btn">{tourForm.id ? 'Save changes' : 'Create tour'}</button>
          <button type="button" className="admin-ghost-btn" onClick={resetTourForm}>Reset</button>
        </div>
      </form>
    </div>
  )

  const renderUserEditor = () => (
    <div className="admin-editor-wrap">
      <div className="admin-section-header">
        <div>
          <h2>{userForm.id ? 'Edit User' : 'Create User'}</h2>
          <p>Tạo, sửa, phân quyền và chặn user ngay trong dashboard admin.</p>
        </div>
      </div>

      <form onSubmit={handleUserSubmit} className="admin-editor-form">
        <label className="admin-editor-field">
          <span>Full name</span>
          <input required value={userForm.name} onChange={(event) => setUserForm((prev) => ({ ...prev, name: event.target.value }))} />
        </label>

        <label className="admin-editor-field">
          <span>Email</span>
          <input required type="email" value={userForm.email} onChange={(event) => setUserForm((prev) => ({ ...prev, email: event.target.value }))} />
        </label>

        <label className="admin-editor-field">
          <span>Phone</span>
          <input value={userForm.phone} onChange={(event) => setUserForm((prev) => ({ ...prev, phone: event.target.value }))} />
        </label>

        <label className="admin-editor-field">
          <span>Role</span>
          <select value={userForm.role} onChange={(event) => setUserForm((prev) => ({ ...prev, role: event.target.value }))}>
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </label>

        <label className="admin-editor-field admin-span-2">
          <span>{userForm.id ? 'New password (optional)' : 'Password'}</span>
          <input
            required={!userForm.id}
            type="password"
            value={userForm.password}
            onChange={(event) => setUserForm((prev) => ({ ...prev, password: event.target.value }))}
          />
        </label>

        <label className="admin-editor-check admin-span-2">
          <input
            type="checkbox"
            checked={userForm.is_blocked}
            onChange={(event) => setUserForm((prev) => ({ ...prev, is_blocked: event.target.checked }))}
          />
          <span>Blocked user</span>
        </label>

        <div className="admin-editor-actions admin-span-2">
          <button type="submit" className="admin-green-btn">{userForm.id ? 'Save user' : 'Create user'}</button>
          <button type="button" className="admin-ghost-btn" onClick={resetUserForm}>Reset</button>
        </div>
      </form>
    </div>
  )

  const createButtonLabel =
    activeSection === 'users' || activeSection === 'user-editor'
      ? (userForm.id ? 'Update User' : 'Create User')
      : (tourForm.id ? 'Update Tour' : 'Create Tour')

  const createButtonAction = () => {
    if (activeSection === 'chats') {
      return
    }
    if (activeSection === 'users' || activeSection === 'user-editor') {
      setActiveSection('user-editor')
      return
    }
    setActiveSection('editor')
  }

  return (
    <div className="admin-shell">
      <aside className="admin-side-nav">
        <div className="admin-brand">Tour<span>Travel</span></div>
        <div className="admin-side-icons">
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              className={`admin-side-link ${activeSection === item.id ? 'active' : ''}`}
              onClick={() => setActiveSection(item.id)}
              title={item.label}
            >
              <span className="admin-side-link-icon">{item.icon}</span>
              <span className="admin-side-link-label">{item.label}</span>
            </button>
          ))}
          <button
            className={`admin-side-link ${activeSection === 'user-editor' ? 'active' : ''}`}
            onClick={() => setActiveSection('user-editor')}
            title="User Editor"
          >
            <span className="admin-side-link-icon">UE</span>
            <span className="admin-side-link-label">User Editor</span>
          </button>
        </div>
        <button className="admin-side-link logout" onClick={logout} title="Logout">
          <span className="admin-side-link-icon">LO</span>
          <span className="admin-side-link-label">Logout</span>
        </button>
      </aside>

      <div className="admin-main">
        <header className="admin-topbar">
          <div>
            <p className="admin-topbar-eyebrow">Admin dashboard</p>
            <h1>{titleForSection(activeSection)}</h1>
          </div>

          <div className="admin-topbar-actions">
            <button className="admin-icon-btn">🔔</button>
            <div className="admin-userbox">
              <div className="admin-user-avatar">{user?.name?.slice(0, 1) || 'A'}</div>
              <div>
                <strong>{user?.name}</strong>
                <span>Administrator</span>
              </div>
            </div>
            <button className="admin-logout-top" onClick={logout}>
              Đăng xuất
            </button>
          </div>
        </header>

        <section className="admin-metric-row">
          {dashboardStats.map((item) => (
            <article key={item.label} className="admin-metric-card">
              <span>{item.label}</span>
              <strong>{item.value}</strong>
              <small>{item.note}</small>
            </article>
          ))}
        </section>

        <section className="admin-toolbar">
          {activeSection === 'bookings' && (
            <>
              <select value={bookingStatusFilter} onChange={(event) => setBookingStatusFilter(event.target.value)} className="admin-toolbar-control">
                <option value="all">All Status</option>
                <option value="confirmed">Confirmed</option>
                <option value="pending">Pending</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <select className="admin-toolbar-control">
                <option>All Services</option>
                <option>Adventure</option>
                <option>Luxury</option>
                <option>Cultural</option>
              </select>
            </>
          )}

          {activeSection === 'tours' && (
            <select value={tourStockFilter} onChange={(event) => setTourStockFilter(event.target.value)} className="admin-toolbar-control">
              <option value="all">All Tours</option>
              <option value="available">Healthy Stock</option>
              <option value="low">Low Stock</option>
            </select>
          )}

          {activeSection === 'users' && (
            <>
              <select value={userRoleFilter} onChange={(event) => setUserRoleFilter(event.target.value)} className="admin-toolbar-control">
                <option value="all">All Roles</option>
                <option value="user">Users</option>
                <option value="admin">Admins</option>
              </select>
              <select value={userBlockFilter} onChange={(event) => setUserBlockFilter(event.target.value)} className="admin-toolbar-control">
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="blocked">Blocked</option>
              </select>
            </>
          )}

          <input
            className="admin-toolbar-search"
            placeholder={
              activeSection === 'bookings'
                ? 'Search customer or booking...'
                : activeSection === 'chats'
                  ? 'Search chat by customer, email or message...'
                : activeSection === 'users'
                  ? 'Search user by name, email or phone...'
                  : 'Search tours...'
            }
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />

          {activeSection !== 'chats' && (
            <button className="admin-green-btn" onClick={createButtonAction}>
              {createButtonLabel}
            </button>
          )}
          <button className="admin-ghost-btn" onClick={loadData}>Refresh</button>
        </section>

        {(message || error || loading) && (
          <section className="admin-feedback-bar">
            {loading && <span>Dang tai du lieu...</span>}
            {message && <span className="ok">{message}</span>}
            {error && <span className="err">{error}</span>}
          </section>
        )}

        <main className="admin-content-area">
          {activeSection === 'bookings' && renderBookingsTable()}
          {activeSection === 'chats' && renderChatsPanel()}
          {activeSection === 'tours' && renderToursTable()}
          {activeSection === 'users' && renderUsersTable()}
          {activeSection === 'editor' && renderTourEditor()}
          {activeSection === 'user-editor' && renderUserEditor()}
        </main>
      </div>
    </div>
  )
}
