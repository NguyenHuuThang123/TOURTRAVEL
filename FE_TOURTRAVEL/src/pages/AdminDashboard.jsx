import { useEffect, useState } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
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

const inputStyle = {
  padding: 'var(--spacing-md)',
  borderRadius: 'var(--border-radius-lg)',
  border: '1px solid var(--border-gray-300)'
}

const primaryButton = {
  border: 'none',
  borderRadius: 'var(--border-radius-lg)',
  padding: 'var(--spacing-md) var(--spacing-lg)',
  backgroundColor: 'var(--primary-color)',
  color: 'white',
  fontWeight: 'var(--font-bold)',
  cursor: 'pointer'
}

const secondaryButton = {
  border: '1px solid var(--border-gray-300)',
  borderRadius: 'var(--border-radius-lg)',
  padding: 'var(--spacing-md) var(--spacing-lg)',
  backgroundColor: 'var(--bg-white)',
  color: 'var(--text-gray-900)',
  fontWeight: 'var(--font-bold)',
  cursor: 'pointer'
}

const dangerButton = {
  ...secondaryButton,
  border: '1px solid #fecaca',
  color: '#dc2626',
  backgroundColor: '#fef2f2'
}

function toDateTimeLocal(value) {
  if (!value) return ''
  return new Date(value).toISOString().slice(0, 16)
}

export default function AdminDashboard() {
  const { token, user } = useAuth()
  const [tourForm, setTourForm] = useState(initialTour)
  const [tours, setTours] = useState([])
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const [tourData, bookingData] = await Promise.all([getTours(), getBookings(token)])
      setTours(tourData)
      setBookings(bookingData)
      setError('')
    } catch (err) {
      setError(err.response?.data?.detail || 'Khong the tai du lieu quan tri.')
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => setTourForm(initialTour)

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
        setMessage('Cap nhat tour thanh cong.')
      } else {
        await createTour(payload, token)
        setMessage('Them tour moi thanh cong.')
      }

      resetForm()
      await loadData()
    } catch (err) {
      setError(err.response?.data?.detail || 'Khong the luu tour.')
    }
  }

  const handleEditTour = (tour) => {
    setTourForm({
      ...tour,
      start_date: toDateTimeLocal(tour.start_date),
      end_date: toDateTimeLocal(tour.end_date)
    })
  }

  const handleDeleteTour = async (tourId) => {
    try {
      await deleteTour(tourId, true, token)
      setMessage('Da xoa tour.')
      await loadData()
    } catch (err) {
      setError(err.response?.data?.detail || 'Khong the xoa tour.')
    }
  }

  const handleBookingStatus = async (bookingId, status) => {
    try {
      await updateBooking(bookingId, { status }, token)
      setMessage('Da cap nhat trang thai don.')
      await loadData()
    } catch (err) {
      setError(err.response?.data?.detail || 'Khong the cap nhat don.')
    }
  }

  const handleDeleteBooking = async (bookingId) => {
    try {
      await deleteBooking(bookingId, token)
      setMessage('Da xoa don dat.')
      await loadData()
    } catch (err) {
      setError(err.response?.data?.detail || 'Khong the xoa don.')
    }
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-gray-50)' }}>
      <Header />

      <main style={{ maxWidth: 'var(--container-max)', margin: '0 auto', padding: 'var(--spacing-2xl) var(--spacing-lg)' }}>
        <div style={{ marginBottom: 'var(--spacing-2xl)' }}>
          <h1 style={{ fontSize: 'var(--text-4xl)', fontWeight: 'var(--font-black)', marginBottom: 'var(--spacing-sm)' }}>
            Quan Tri Tour va Don Ban
          </h1>
          <p style={{ color: 'var(--text-gray-500)' }}>
            Them, sua, xoa tour va xu ly don mua ngay tren du lieu MongoDB.
          </p>
          <p style={{ color: 'var(--text-light)', marginTop: '6px' }}>
            Dang dang nhap: {user?.name} ({user?.role})
          </p>
        </div>

        {message && <p style={{ color: '#166534' }}>{message}</p>}
        {error && <p style={{ color: '#dc2626' }}>{error}</p>}
        {loading && <p>Dang tai du lieu...</p>}

        <section style={{ display: 'grid', gridTemplateColumns: 'minmax(320px, 0.95fr) minmax(0, 1.05fr)', gap: 'var(--spacing-2xl)', marginBottom: 'var(--spacing-2xl)' }}>
          <form onSubmit={handleTourSubmit} style={{ backgroundColor: 'var(--bg-white)', borderRadius: 'var(--border-radius-2xl)', padding: 'var(--spacing-xl)', boxShadow: 'var(--shadow-xl)' }}>
            <h2 style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-bold)', marginBottom: 'var(--spacing-lg)' }}>
              {tourForm.id ? 'Sua tour' : 'Them tour moi'}
            </h2>
            <div style={{ display: 'grid', gap: 'var(--spacing-md)' }}>
              <input required value={tourForm.name} onChange={(event) => setTourForm((prev) => ({ ...prev, name: event.target.value }))} placeholder="Ten tour" style={inputStyle} />
              <textarea required value={tourForm.description} onChange={(event) => setTourForm((prev) => ({ ...prev, description: event.target.value }))} placeholder="Mo ta tour" rows="4" style={{ ...inputStyle, resize: 'vertical' }} />
              <input required value={tourForm.destination} onChange={(event) => setTourForm((prev) => ({ ...prev, destination: event.target.value }))} placeholder="Diem den" style={inputStyle} />
              <input value={tourForm.image} onChange={(event) => setTourForm((prev) => ({ ...prev, image: event.target.value }))} placeholder="Link hinh anh" style={inputStyle} />
              <input value={tourForm.travel_style} onChange={(event) => setTourForm((prev) => ({ ...prev, travel_style: event.target.value }))} placeholder="Loai hinh du lich" style={inputStyle} />
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 'var(--spacing-md)' }}>
                <input required type="number" min="1" value={tourForm.price} onChange={(event) => setTourForm((prev) => ({ ...prev, price: event.target.value }))} placeholder="Gia" style={inputStyle} />
                <input required type="number" min="1" value={tourForm.duration_days} onChange={(event) => setTourForm((prev) => ({ ...prev, duration_days: event.target.value }))} placeholder="So ngay" style={inputStyle} />
                <input required type="number" min="1" value={tourForm.max_participants} onChange={(event) => setTourForm((prev) => ({ ...prev, max_participants: event.target.value }))} placeholder="Suc chua toi da" style={inputStyle} />
                <input required type="number" min="0" value={tourForm.available_slots} onChange={(event) => setTourForm((prev) => ({ ...prev, available_slots: event.target.value }))} placeholder="Cho trong" style={inputStyle} />
                <input required type="datetime-local" value={tourForm.start_date} onChange={(event) => setTourForm((prev) => ({ ...prev, start_date: event.target.value }))} style={inputStyle} />
                <input required type="datetime-local" value={tourForm.end_date} onChange={(event) => setTourForm((prev) => ({ ...prev, end_date: event.target.value }))} style={inputStyle} />
              </div>
            </div>

            <div style={{ display: 'flex', gap: 'var(--spacing-md)', marginTop: 'var(--spacing-lg)' }}>
              <button type="submit" style={primaryButton}>
                {tourForm.id ? 'Luu cap nhat' : 'Them tour'}
              </button>
              <button type="button" onClick={resetForm} style={secondaryButton}>
                Tao moi
              </button>
            </div>
          </form>

          <div style={{ backgroundColor: 'var(--bg-white)', borderRadius: 'var(--border-radius-2xl)', padding: 'var(--spacing-xl)', boxShadow: 'var(--shadow-xl)' }}>
            <h2 style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-bold)', marginBottom: 'var(--spacing-lg)' }}>Danh sach tour</h2>
            <div style={{ display: 'grid', gap: 'var(--spacing-md)' }}>
              {tours.map((tour) => (
                <article key={tour.id} style={{ border: '1px solid var(--border-gray-200)', borderRadius: 'var(--border-radius-xl)', padding: 'var(--spacing-lg)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: 'var(--spacing-md)', alignItems: 'start' }}>
                    <div>
                      <h3 style={{ marginBottom: 'var(--spacing-xs)' }}>{tour.name}</h3>
                      <p style={{ color: 'var(--text-gray-500)', marginBottom: 'var(--spacing-sm)' }}>{tour.destination}</p>
                      <p style={{ color: 'var(--text-gray-600)' }}>${tour.price} • {tour.available_slots}/{tour.max_participants} cho</p>
                    </div>
                    <div style={{ display: 'flex', gap: 'var(--spacing-sm)' }}>
                      <button onClick={() => handleEditTour(tour)} style={secondaryButton}>Sua</button>
                      <button onClick={() => handleDeleteTour(tour.id)} style={dangerButton}>Xoa</button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section style={{ backgroundColor: 'var(--bg-white)', borderRadius: 'var(--border-radius-2xl)', padding: 'var(--spacing-xl)', boxShadow: 'var(--shadow-xl)' }}>
          <h2 style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-bold)', marginBottom: 'var(--spacing-lg)' }}>Don mua / ban</h2>
          <div style={{ display: 'grid', gap: 'var(--spacing-md)' }}>
            {bookings.map((booking) => (
              <article key={booking.id} style={{ border: '1px solid var(--border-gray-200)', borderRadius: 'var(--border-radius-xl)', padding: 'var(--spacing-lg)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 'var(--spacing-md)', flexWrap: 'wrap' }}>
                  <div>
                    <h3 style={{ marginBottom: 'var(--spacing-xs)' }}>{booking.tour_name}</h3>
                    <p style={{ color: 'var(--text-gray-500)', marginBottom: 'var(--spacing-xs)' }}>{booking.user_name} • {booking.user_email}</p>
                    <p style={{ color: 'var(--text-gray-600)' }}>
                      {booking.quantity} khach • ${booking.total_price} • {booking.status}
                    </p>
                  </div>
                  <div style={{ display: 'flex', gap: 'var(--spacing-sm)', flexWrap: 'wrap' }}>
                    <button onClick={() => handleBookingStatus(booking.id, 'confirmed')} style={secondaryButton}>Xac nhan</button>
                    <button onClick={() => handleBookingStatus(booking.id, 'cancelled')} style={dangerButton}>Huy</button>
                    <button onClick={() => handleDeleteBooking(booking.id)} style={secondaryButton}>Xoa don</button>
                  </div>
                </div>
              </article>
            ))}
            {!bookings.length && !loading && <p>Chua co don dat nao.</p>}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
