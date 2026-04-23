import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { cancelMyBooking, getMyBookings } from '../api/tourService'
import { useAuth } from '../context/AuthContext'
import { formatCurrency } from '../utils/currency'

const bookingStatusLabel = {
  pending: 'Đang xử lý',
  confirmed: 'Đã xác nhận',
  cancelled: 'Đã hủy'
}

export default function Account() {
  const { user, token, updateProfile } = useAuth()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: ''
  })
  const [bookings, setBookings] = useState([])
  const [loadingBookings, setLoadingBookings] = useState(true)
  const [savingProfile, setSavingProfile] = useState(false)
  const [profileMessage, setProfileMessage] = useState('')
  const [profileError, setProfileError] = useState('')
  const [bookingError, setBookingError] = useState('')
  const [busyBookingId, setBusyBookingId] = useState('')

  useEffect(() => {
    if (!user) return
    setFormData({
      name: user.name || '',
      email: user.email || '',
      phone: user.phone || ''
    })
  }, [user])

  useEffect(() => {
    if (!token) return
    loadBookings()
  }, [token])

  const loadBookings = async () => {
    try {
      setLoadingBookings(true)
      setBookingError('')
      const data = await getMyBookings(token)
      setBookings(data)
    } catch (err) {
      setBookingError(err.response?.data?.detail || 'Khong the tai danh sach tour da dat.')
    } finally {
      setLoadingBookings(false)
    }
  }

  const bookingStats = useMemo(() => {
    const total = bookings.length
    const confirmed = bookings.filter((item) => item.status === 'confirmed').length
    const cancelled = bookings.filter((item) => item.status === 'cancelled').length
    const totalSpend = bookings
      .filter((item) => item.status !== 'cancelled')
      .reduce((sum, item) => sum + Number(item.total_price || 0), 0)

    return { total, confirmed, cancelled, totalSpend }
  }, [bookings])

  const handleProfileSubmit = async (event) => {
    event.preventDefault()
    try {
      setSavingProfile(true)
      setProfileError('')
      setProfileMessage('')
      await updateProfile({
        name: formData.name,
        email: formData.email,
        phone: formData.phone || null
      })
      setProfileMessage('Thông tin của bạn đã được cập nhật thành công.')
      await loadBookings()
    } catch (err) {
      setProfileError(err.response?.data?.detail || 'Không thể cập nhật thông tin của bạn.')
    } finally {
      setSavingProfile(false)
    }
  }

  const handleCancelBooking = async (bookingId) => {
    try {
      setBusyBookingId(bookingId)
      setBookingError('')
      const updated = await cancelMyBooking(bookingId, token)
      setBookings((prev) => prev.map((item) => (item.id === bookingId ? updated : item)))
    } catch (err) {
      setBookingError(err.response?.data?.detail || 'Không thể hủy booking này.')
    } finally {
      setBusyBookingId('')
    }
  }

  return (
    <div className="account-shell">
      <Header />

      <main className="container account-main">
        <section className="account-hero">
          <div>
            <p className="account-eyebrow">Thông tin tài khoản</p>
            <h1>Tài khoản của bạn</h1>
            <p>Cập nhật thông tin cá nhân và theo dõi các tour bạn đã đặt trong cùng một nơi.</p>
          </div>
          <div className="account-stat-row">
            <article className="account-stat-card">
              <span>Tổng booking</span>
              <strong>{bookingStats.total}</strong>
            </article>
            <article className="account-stat-card">
              <span>Đã xác nhận</span>
              <strong>{bookingStats.confirmed}</strong>
            </article>
            <article className="account-stat-card">
              <span>Đã hủy</span>
              <strong>{bookingStats.cancelled}</strong>
            </article>
            <article className="account-stat-card">
              <span>Đã chi</span>
              <strong>{formatCurrency(bookingStats.totalSpend)}</strong>
            </article>
          </div>
        </section>

        <div className="account-layout">
          <section className="account-panel">
            <div className="account-panel-head">
              <div>
                <p className="account-panel-eyebrow">Profile</p>
                <h2>Thông tin người dùng</h2>
              </div>
            </div>

            <form className="account-form" onSubmit={handleProfileSubmit}>
              <label className="account-field">
                <span>Họ và tên</span>
                <input
                  required
                  value={formData.name}
                  onChange={(event) => setFormData((prev) => ({ ...prev, name: event.target.value }))}
                />
              </label>

              <label className="account-field">
                <span>Email</span>
                <input
                  required
                  type="email"
                  value={formData.email}
                  onChange={(event) => setFormData((prev) => ({ ...prev, email: event.target.value }))}
                />
              </label>

              <label className="account-field">
                <span>Số điện thoại</span>
                <input
                  placeholder="Nhập số điện thoại"
                  value={formData.phone}
                  onChange={(event) => setFormData((prev) => ({ ...prev, phone: event.target.value }))}
                />
              </label>

              {profileError && <div className="account-feedback error">{profileError}</div>}
              {profileMessage && <div className="account-feedback ok">{profileMessage}</div>}

              <button type="submit" className="account-primary-btn" disabled={savingProfile}>
                {savingProfile ? 'Đang lưu...' : 'Lưu thông tin'}
              </button>
            </form>
          </section>

          <section className="account-panel">
            <div className="account-panel-head">
              <div>
                <p className="account-panel-eyebrow">Bookings</p>
                <h2>Tour đã đặt</h2>
              </div>
              <Link to="/tours" className="account-secondary-link">Đặt thêm tour</Link>
            </div>

            {loadingBookings && <div className="account-empty-state">Đang tải booking của bạn...</div>}
            {bookingError && <div className="account-feedback error">{bookingError}</div>}

            {!loadingBookings && !bookingError && bookings.length === 0 && (
              <div className="account-empty-state">
                <p>Bạn chưa có booking nào.</p>
                <Link to="/tours" className="account-primary-btn inline">Khám phá tour</Link>
              </div>
            )}

            {!loadingBookings && bookings.length > 0 && (
              <div className="account-booking-list">
                {bookings.map((booking) => (
                  <article key={booking.id} className="account-booking-card">
                    <div
                      className="account-booking-image"
                      style={{
                        backgroundImage: `url(${booking.tour_image || 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800'})`
                      }}
                    />

                    <div className="account-booking-content">
                      <div className="account-booking-top">
                        <div>
                          <p className="account-booking-destination">{booking.tour_destination || 'TourTravel Experience'}</p>
                          <h3>{booking.tour_name}</h3>
                        </div>
                        <span className={`account-status-badge ${booking.status}`}>{bookingStatusLabel[booking.status] || booking.status}</span>
                      </div>

                      <div className="account-booking-meta">
                        <span>Khởi hành: {booking.start_date ? new Date(booking.start_date).toLocaleDateString() : 'Đang cập nhật'}</span>
                        <span>Số lượng: {booking.quantity} người</span>
                        <span>Tổng tiền: {formatCurrency(booking.total_price)}</span>
                      </div>

                      <div className="account-booking-actions">
                        <Link to={`/tours/${booking.tour_id}`} className="account-secondary-link">Xem tour</Link>
                        {booking.status !== 'cancelled' && (
                          <button
                            type="button"
                            className="account-danger-btn"
                            disabled={busyBookingId === booking.id}
                            onClick={() => handleCancelBooking(booking.id)}
                          >
                            {busyBookingId === booking.id ? 'Đang hủy...' : 'Hủy booking'}
                          </button>
                        )}
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>

      <Footer />
    </div>
  )
}
