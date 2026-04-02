import { useEffect, useMemo, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import {
  createTour,
  deleteBooking,
  deleteTour,
  getBookings,
  getTours,
  updateBooking,
  updateTour
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

const sidebarItems = [
  { id: 'bookings', label: 'Bookings', icon: 'BK' },
  { id: 'tours', label: 'Tours', icon: 'TR' },
  { id: 'editor', label: 'Editor', icon: 'ED' }
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

export default function AdminDashboard() {
  const { token, user, logout } = useAuth()
  const [activeSection, setActiveSection] = useState('bookings')
  const [tourForm, setTourForm] = useState(initialTour)
  const [tours, setTours] = useState([])
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [bookingStatusFilter, setBookingStatusFilter] = useState('all')
  const [tourStockFilter, setTourStockFilter] = useState('all')

  useEffect(() => {
    if (token) {
      loadData()
    }
  }, [token])

  const loadData = async () => {
    try {
      setLoading(true)
      const [tourData, bookingData] = await Promise.all([getTours(), getBookings(token)])
      setTours(tourData)
      setBookings(bookingData)
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
      { label: 'Confirmed', value: bookings.filter((booking) => booking.status === 'confirmed').length, note: 'Đơn đã xác nhận' },
      { label: 'Low stock tours', value: tours.filter((tour) => tour.available_slots <= 5).length, note: 'Tour cần được ưu tiên' },
      { label: 'Revenue', value: formatCurrency(confirmedRevenue), note: 'Thu nhập từ đơn đã chốt' }
    ]
  }, [bookings, tours])

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

  const resetForm = () => {
    setTourForm(initialTour)
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

      resetForm()
      setActiveSection('tours')
      await loadData()
    } catch (err) {
      setError(err.response?.data?.detail || 'Không thể lưu tour.')
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

  const handleDeleteTour = async (tourId) => {
    try {
      await deleteTour(tourId, true, token)
      setMessage('Đã xóa tour.')
      await loadData()
    } catch (err) {
      setError(err.response?.data?.detail || 'Không thể xóa tour.')
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
          <p>Quản lý sản phẩm tour và tồn kho cho trong.</p>
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

  const renderEditor = () => (
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
          <button type="button" className="admin-ghost-btn" onClick={resetForm}>Reset</button>
        </div>
      </form>
    </div>
  )

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
              <span>{item.icon}</span>
            </button>
          ))}
        </div>
        <button className="admin-side-link logout" onClick={logout} title="Logout">
          <span>LO</span>
        </button>
      </aside>

      <div className="admin-main">
        <header className="admin-topbar">
          <div>
            <p className="admin-topbar-eyebrow">Admin dashboard</p>
            <h1>{activeSection === 'bookings' ? 'All Bookings' : activeSection === 'tours' ? 'Tour Inventory' : 'Create / Update Tour'}</h1>
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

          <input
            className="admin-toolbar-search"
            placeholder={activeSection === 'bookings' ? 'Search customer or booking...' : 'Search tours...'}
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />

          <button className="admin-green-btn" onClick={() => setActiveSection('editor')}>
            {tourForm.id ? 'Update Tour' : 'Create Tour'}
          </button>
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
          {activeSection === 'tours' && renderToursTable()}
          {activeSection === 'editor' && renderEditor()}
        </main>
      </div>
    </div>
  )
}
