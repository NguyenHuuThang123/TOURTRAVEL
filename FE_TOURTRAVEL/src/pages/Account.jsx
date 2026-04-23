import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { cancelMyBooking, getMyBookings } from '../api/tourService'
import { useAuth } from '../context/AuthContext'
import { formatCurrency } from '../utils/currency'

const bookingStatusLabel = {
  pending: 'Dang xu ly',
  confirmed: 'Da xac nhan',
  cancelled: 'Da huy'
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
      setProfileMessage('Thong tin tai khoan da duoc cap nhat.')
      await loadBookings()
    } catch (err) {
      setProfileError(err.response?.data?.detail || 'Khong the cap nhat thong tin.')
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
      setBookingError(err.response?.data?.detail || 'Khong the huy booking nay.')
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
            <p className="account-eyebrow">User Center</p>
            <h1>Tai khoan cua ban</h1>
            <p>Cap nhat thong tin ca nhan va theo doi cac tour ban da dat trong cung mot noi.</p>
          </div>
          <div className="account-stat-row">
            <article className="account-stat-card">
              <span>Tong booking</span>
              <strong>{bookingStats.total}</strong>
            </article>
            <article className="account-stat-card">
              <span>Da xac nhan</span>
              <strong>{bookingStats.confirmed}</strong>
            </article>
            <article className="account-stat-card">
              <span>Da huy</span>
              <strong>{bookingStats.cancelled}</strong>
            </article>
            <article className="account-stat-card">
              <span>Da chi</span>
              <strong>{formatCurrency(bookingStats.totalSpend)}</strong>
            </article>
          </div>
        </section>

        <div className="account-layout">
          <section className="account-panel">
            <div className="account-panel-head">
              <div>
                <p className="account-panel-eyebrow">Profile</p>
                <h2>Thong tin nguoi dung</h2>
              </div>
            </div>

            <form className="account-form" onSubmit={handleProfileSubmit}>
              <label className="account-field">
                <span>Ho va ten</span>
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
                <span>So dien thoai</span>
                <input
                  placeholder="Nhap so dien thoai"
                  value={formData.phone}
                  onChange={(event) => setFormData((prev) => ({ ...prev, phone: event.target.value }))}
                />
              </label>

              {profileError && <div className="account-feedback error">{profileError}</div>}
              {profileMessage && <div className="account-feedback ok">{profileMessage}</div>}

              <button type="submit" className="account-primary-btn" disabled={savingProfile}>
                {savingProfile ? 'Dang luu...' : 'Luu thong tin'}
              </button>
            </form>
          </section>

          <section className="account-panel">
            <div className="account-panel-head">
              <div>
                <p className="account-panel-eyebrow">Bookings</p>
                <h2>Tour da dat</h2>
              </div>
              <Link to="/tours" className="account-secondary-link">Dat them tour</Link>
            </div>

            {loadingBookings && <div className="account-empty-state">Dang tai booking cua ban...</div>}
            {bookingError && <div className="account-feedback error">{bookingError}</div>}

            {!loadingBookings && !bookingError && bookings.length === 0 && (
              <div className="account-empty-state">
                <p>Ban chua co booking nao.</p>
                <Link to="/tours" className="account-primary-btn inline">Kham pha tour</Link>
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
                        <span>Khoi hanh: {booking.start_date ? new Date(booking.start_date).toLocaleDateString() : 'Dang cap nhat'}</span>
                        <span>So luong: {booking.quantity} nguoi</span>
                        <span>Tong tien: {formatCurrency(booking.total_price)}</span>
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
                            {busyBookingId === booking.id ? 'Dang huy...' : 'Huy booking'}
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
