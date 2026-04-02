import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { getTourById } from '../api/tourService'

export default function TourDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [tour, setTour] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [quantity, setQuantity] = useState(1)

  useEffect(() => {
    const loadTour = async () => {
      try {
        setLoading(true)
        const data = await getTourById(id)
        setTour(data)
        setError('')
      } catch (err) {
        setError(err.response?.data?.detail || 'Khong tim thay tour.')
      } finally {
        setLoading(false)
      }
    }

    loadTour()
  }, [id])

  if (loading) {
    return <div style={{ padding: '40px' }}>Dang tai chi tiet tour...</div>
  }

  if (error || !tour) {
    return (
      <div style={{ padding: '40px' }}>
        <p style={{ color: '#dc2626' }}>{error || 'Khong tim thay tour.'}</p>
        <Link to="/tours">Quay lai danh sach tour</Link>
      </div>
    )
  }

  const total = quantity * tour.price

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-gray-50)' }}>
      <Header />

      <main style={{ maxWidth: 'var(--container-max)', margin: '0 auto', padding: 'var(--spacing-2xl) var(--spacing-lg)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.6fr) minmax(320px, 1fr)', gap: 'var(--spacing-2xl)' }}>
          <section>
            <div
              style={{
                height: '360px',
                borderRadius: 'var(--border-radius-2xl)',
                backgroundImage: `url(${tour.image || 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1200'})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                marginBottom: 'var(--spacing-xl)'
              }}
            />
            <p style={{ color: 'var(--primary-color)', fontWeight: 'var(--font-bold)', marginBottom: 'var(--spacing-sm)' }}>{tour.destination}</p>
            <h1 style={{ fontSize: 'var(--text-4xl)', fontWeight: 'var(--font-black)', marginBottom: 'var(--spacing-md)' }}>{tour.name}</h1>
            <p style={{ color: 'var(--text-gray-600)', lineHeight: 1.7, marginBottom: 'var(--spacing-xl)' }}>{tour.description}</p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 'var(--spacing-md)' }}>
              <div style={{ backgroundColor: 'var(--bg-white)', padding: 'var(--spacing-lg)', borderRadius: 'var(--border-radius-xl)' }}>
                <p style={{ color: 'var(--text-gray-500)' }}>Thoi luong</p>
                <strong>{tour.duration_days} ngay</strong>
              </div>
              <div style={{ backgroundColor: 'var(--bg-white)', padding: 'var(--spacing-lg)', borderRadius: 'var(--border-radius-xl)' }}>
                <p style={{ color: 'var(--text-gray-500)' }}>Suc chua</p>
                <strong>{tour.max_participants} khach</strong>
              </div>
              <div style={{ backgroundColor: 'var(--bg-white)', padding: 'var(--spacing-lg)', borderRadius: 'var(--border-radius-xl)' }}>
                <p style={{ color: 'var(--text-gray-500)' }}>Con lai</p>
                <strong>{tour.available_slots} cho</strong>
              </div>
              <div style={{ backgroundColor: 'var(--bg-white)', padding: 'var(--spacing-lg)', borderRadius: 'var(--border-radius-xl)' }}>
                <p style={{ color: 'var(--text-gray-500)' }}>Khoi hanh</p>
                <strong>{new Date(tour.start_date).toLocaleDateString()}</strong>
              </div>
            </div>
          </section>

          <aside style={{ alignSelf: 'start', position: 'sticky', top: '100px' }}>
            <div style={{ backgroundColor: 'var(--bg-white)', borderRadius: 'var(--border-radius-2xl)', padding: 'var(--spacing-xl)', boxShadow: 'var(--shadow-xl)' }}>
              <p style={{ color: 'var(--text-gray-500)', marginBottom: 'var(--spacing-xs)' }}>Gia tour</p>
              <div style={{ fontSize: 'var(--text-4xl)', fontWeight: 'var(--font-black)', color: 'var(--primary-color)', marginBottom: 'var(--spacing-lg)' }}>
                ${tour.price}
              </div>

              <label style={{ display: 'block', marginBottom: 'var(--spacing-sm)', fontWeight: 'var(--font-medium)' }}>
                So luong nguoi
              </label>
              <input
                type="number"
                min="1"
                max={tour.available_slots || 1}
                value={quantity}
                onChange={(event) => setQuantity(Math.max(1, Number(event.target.value) || 1))}
                style={{ width: '100%', padding: 'var(--spacing-md)', borderRadius: 'var(--border-radius-lg)', border: '1px solid var(--border-gray-300)', marginBottom: 'var(--spacing-lg)' }}
              />

              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--spacing-xl)' }}>
                <span>Tam tinh</span>
                <strong>${total}</strong>
              </div>

              <button
                onClick={() => navigate('/checkout', { state: { tour, quantity } })}
                disabled={tour.available_slots < 1}
                style={{
                  width: '100%',
                  padding: 'var(--spacing-lg)',
                  borderRadius: 'var(--border-radius-xl)',
                  border: 'none',
                  backgroundColor: tour.available_slots < 1 ? 'var(--bg-gray-300)' : 'var(--primary-color)',
                  color: 'white',
                  fontWeight: 'var(--font-bold)',
                  cursor: tour.available_slots < 1 ? 'not-allowed' : 'pointer'
                }}
              >
                {tour.available_slots < 1 ? 'Da het cho' : 'Mua tour ngay'}
              </button>
            </div>
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  )
}
