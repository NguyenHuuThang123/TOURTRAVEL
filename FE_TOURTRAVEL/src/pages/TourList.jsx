import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { getTours } from '../api/tourService'

const cardStyle = {
  backgroundColor: 'var(--bg-white)',
  borderRadius: 'var(--border-radius-xl)',
  overflow: 'hidden',
  boxShadow: 'var(--shadow-sm)',
  border: '1px solid var(--border-gray-200)'
}

export default function TourList() {
  const [tours, setTours] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [destination, setDestination] = useState('')
  const [sortBy, setSortBy] = useState('latest')

  useEffect(() => {
    loadTours()
  }, [])

  const loadTours = async () => {
    try {
      setLoading(true)
      setError('')
      const data = await getTours()
      setTours(data)
    } catch (err) {
      setError(err.response?.data?.detail || 'Khong the tai danh sach tour.')
    } finally {
      setLoading(false)
    }
  }

  const visibleTours = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase()
    const normalizedDestination = destination.trim().toLowerCase()

    const filtered = tours.filter((tour) => {
      const matchesSearch =
        !normalizedSearch ||
        tour.name.toLowerCase().includes(normalizedSearch) ||
        tour.description.toLowerCase().includes(normalizedSearch)
      const matchesDestination =
        !normalizedDestination || tour.destination.toLowerCase().includes(normalizedDestination)

      return matchesSearch && matchesDestination
    })

    return filtered.sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price
      if (sortBy === 'price-desc') return b.price - a.price
      if (sortBy === 'duration') return a.duration_days - b.duration_days
      return new Date(a.start_date) - new Date(b.start_date)
    })
  }, [destination, search, sortBy, tours])

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-gray-50)' }}>
      <Header />

      <main style={{ maxWidth: 'var(--container-max)', margin: '0 auto', padding: 'var(--spacing-2xl) var(--spacing-lg)' }}>
        <section style={{ marginBottom: 'var(--spacing-2xl)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 'var(--spacing-lg)', flexWrap: 'wrap', marginBottom: 'var(--spacing-xl)' }}>
            <div>
              <h1 style={{ fontSize: 'var(--text-4xl)', fontWeight: 'var(--font-black)', marginBottom: 'var(--spacing-sm)' }}>
                Danh Sach Tour
              </h1>
              <p style={{ color: 'var(--text-gray-500)' }}>
                Tim kiem tour va dat mua ngay tren he thong MongoDB.
              </p>
            </div>
            <Link
              to="/admin"
              style={{
                alignSelf: 'center',
                padding: 'var(--spacing-md) var(--spacing-lg)',
                borderRadius: 'var(--border-radius-lg)',
                backgroundColor: 'var(--bg-slate-900)',
                color: 'white',
                textDecoration: 'none',
                fontWeight: 'var(--font-bold)'
              }}
            >
              Quan ly tour
            </Link>
          </div>

          <div style={{ ...cardStyle, padding: 'var(--spacing-xl)', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 'var(--spacing-md)' }}>
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Tim theo ten hoac mo ta"
              style={{ padding: 'var(--spacing-md)', borderRadius: 'var(--border-radius-lg)', border: '1px solid var(--border-gray-300)' }}
            />
            <input
              value={destination}
              onChange={(event) => setDestination(event.target.value)}
              placeholder="Loc theo diem den"
              style={{ padding: 'var(--spacing-md)', borderRadius: 'var(--border-radius-lg)', border: '1px solid var(--border-gray-300)' }}
            />
            <select
              value={sortBy}
              onChange={(event) => setSortBy(event.target.value)}
              style={{ padding: 'var(--spacing-md)', borderRadius: 'var(--border-radius-lg)', border: '1px solid var(--border-gray-300)' }}
            >
              <option value="latest">Khoi hanh som nhat</option>
              <option value="price-asc">Gia tang dan</option>
              <option value="price-desc">Gia giam dan</option>
              <option value="duration">Thoi luong ngan nhat</option>
            </select>
            <button
              onClick={loadTours}
              style={{
                border: 'none',
                borderRadius: 'var(--border-radius-lg)',
                backgroundColor: 'var(--primary-color)',
                color: 'white',
                fontWeight: 'var(--font-bold)',
                cursor: 'pointer'
              }}
            >
              Lam moi
            </button>
          </div>
        </section>

        {loading && <p>Dang tai tour...</p>}
        {error && <p style={{ color: '#dc2626' }}>{error}</p>}

        {!loading && !error && (
          <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--spacing-xl)' }}>
            {visibleTours.map((tour) => (
              <article key={tour.id} style={cardStyle}>
                <div
                  style={{
                    height: '220px',
                    backgroundImage: `url(${tour.image || 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1200'})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }}
                />
                <div style={{ padding: 'var(--spacing-xl)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: 'var(--spacing-md)', marginBottom: 'var(--spacing-sm)' }}>
                    <span style={{ color: 'var(--text-gray-500)', fontSize: 'var(--text-sm)' }}>{tour.destination}</span>
                    <span style={{ color: 'var(--primary-color)', fontWeight: 'var(--font-bold)' }}>{tour.available_slots} cho trong</span>
                  </div>
                  <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 'var(--font-bold)', marginBottom: 'var(--spacing-sm)' }}>{tour.name}</h2>
                  <p style={{ color: 'var(--text-gray-600)', minHeight: '72px' }}>{tour.description}</p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', margin: 'var(--spacing-lg) 0' }}>
                    <span>{tour.duration_days} ngay</span>
                    <span style={{ fontWeight: 'var(--font-black)', color: 'var(--primary-color)' }}>${tour.price}</span>
                  </div>
                  <Link
                    to={`/tours/${tour.id}`}
                    style={{
                      display: 'inline-block',
                      width: '100%',
                      textAlign: 'center',
                      padding: 'var(--spacing-md)',
                      borderRadius: 'var(--border-radius-lg)',
                      textDecoration: 'none',
                      backgroundColor: 'var(--primary-color)',
                      color: 'white',
                      fontWeight: 'var(--font-bold)'
                    }}
                  >
                    Xem chi tiet va mua
                  </Link>
                </div>
              </article>
            ))}
          </section>
        )}
      </main>

      <Footer />
    </div>
  )
}
