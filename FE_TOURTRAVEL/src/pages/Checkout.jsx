import { useMemo, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { createBooking } from '../api/tourService'

const emptyForm = {
  user_name: '',
  user_email: '',
  user_phone: ''
}

export default function Checkout() {
  const location = useLocation()
  const navigate = useNavigate()
  const [formData, setFormData] = useState(emptyForm)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const tour = location.state?.tour
  const quantity = location.state?.quantity || 1

  const total = useMemo(() => (tour ? tour.price * quantity : 0), [quantity, tour])

  if (!tour) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-gray-50)' }}>
        <Header />
        <main style={{ maxWidth: '900px', margin: '0 auto', padding: '40px 20px' }}>
          <p>Chua co tour nao duoc chon.</p>
          <Link to="/tours">Quay lai danh sach tour</Link>
        </main>
        <Footer />
      </div>
    )
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    try {
      setLoading(true)
      setError('')
      const booking = await createBooking({
        ...formData,
        tour_id: tour.id,
        quantity
      })
      setMessage(`Dat tour thanh cong. Ma don: ${booking.id}`)
      setTimeout(() => {
        navigate('/admin')
      }, 1400)
    } catch (err) {
      setError(err.response?.data?.detail || 'Dat tour that bai.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-gray-50)' }}>
      <Header />

      <main style={{ maxWidth: 'var(--container-max)', margin: '0 auto', padding: 'var(--spacing-2xl) var(--spacing-lg)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.2fr) minmax(300px, 0.8fr)', gap: 'var(--spacing-2xl)' }}>
          <form onSubmit={handleSubmit} style={{ backgroundColor: 'var(--bg-white)', borderRadius: 'var(--border-radius-2xl)', padding: 'var(--spacing-xl)', boxShadow: 'var(--shadow-xl)' }}>
            <h1 style={{ fontSize: 'var(--text-3xl)', fontWeight: 'var(--font-black)', marginBottom: 'var(--spacing-xl)' }}>
              Hoan tat mua tour
            </h1>

            <div style={{ display: 'grid', gap: 'var(--spacing-lg)' }}>
              <input
                required
                value={formData.user_name}
                onChange={(event) => setFormData((prev) => ({ ...prev, user_name: event.target.value }))}
                placeholder="Ho va ten"
                style={{ padding: 'var(--spacing-md)', borderRadius: 'var(--border-radius-lg)', border: '1px solid var(--border-gray-300)' }}
              />
              <input
                required
                type="email"
                value={formData.user_email}
                onChange={(event) => setFormData((prev) => ({ ...prev, user_email: event.target.value }))}
                placeholder="Email"
                style={{ padding: 'var(--spacing-md)', borderRadius: 'var(--border-radius-lg)', border: '1px solid var(--border-gray-300)' }}
              />
              <input
                required
                value={formData.user_phone}
                onChange={(event) => setFormData((prev) => ({ ...prev, user_phone: event.target.value }))}
                placeholder="So dien thoai"
                style={{ padding: 'var(--spacing-md)', borderRadius: 'var(--border-radius-lg)', border: '1px solid var(--border-gray-300)' }}
              />
            </div>

            {error && <p style={{ color: '#dc2626', marginTop: 'var(--spacing-lg)' }}>{error}</p>}
            {message && <p style={{ color: '#166534', marginTop: 'var(--spacing-lg)' }}>{message}</p>}

            <button
              type="submit"
              disabled={loading}
              style={{
                marginTop: 'var(--spacing-xl)',
                width: '100%',
                padding: 'var(--spacing-lg)',
                border: 'none',
                borderRadius: 'var(--border-radius-xl)',
                backgroundColor: 'var(--primary-color)',
                color: 'white',
                fontWeight: 'var(--font-bold)',
                cursor: loading ? 'wait' : 'pointer',
                opacity: loading ? 0.7 : 1
              }}
            >
              {loading ? 'Dang xu ly...' : 'Xac nhan mua tour'}
            </button>
          </form>

          <aside style={{ backgroundColor: 'var(--bg-white)', borderRadius: 'var(--border-radius-2xl)', padding: 'var(--spacing-xl)', boxShadow: 'var(--shadow-xl)', height: 'fit-content' }}>
            <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 'var(--font-bold)', marginBottom: 'var(--spacing-lg)' }}>Don hang</h2>
            <p style={{ fontWeight: 'var(--font-bold)' }}>{tour.name}</p>
            <p style={{ color: 'var(--text-gray-500)' }}>{tour.destination}</p>
            <div style={{ margin: 'var(--spacing-lg) 0', paddingTop: 'var(--spacing-lg)', borderTop: '1px solid var(--border-gray-200)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--spacing-sm)' }}>
                <span>Don gia</span>
                <span>${tour.price}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--spacing-sm)' }}>
                <span>So luong</span>
                <span>{quantity}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--text-lg)', fontWeight: 'var(--font-black)', marginTop: 'var(--spacing-md)' }}>
                <span>Tong</span>
                <span>${total}</span>
              </div>
            </div>
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  )
}
