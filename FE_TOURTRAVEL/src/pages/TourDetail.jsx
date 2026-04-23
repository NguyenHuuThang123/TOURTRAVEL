import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { getTourById } from '../api/tourService'
import { useAuth } from '../context/AuthContext'
import { formatCurrency } from '../utils/currency'

export default function TourDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
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
  const guide = tour.guide_name
    ? {
        name: tour.guide_name,
        title: tour.guide_title || 'Verified Guide',
        experience: tour.guide_experience_years ? `${tour.guide_experience_years} years experience` : 'Guide team',
        avatar: tour.guide_avatar || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120',
        bio: tour.guide_bio || 'Your assigned guide will support the group before and during the trip.'
      }
    : null
  const quickInfo = [
    { label: 'Duration', value: `${tour.duration_days} Days`, icon: '◔' },
    { label: 'Group Size', value: `Max ${tour.max_participants}`, icon: '⌘' },
    { label: 'Activity Level', value: 'Moderate', icon: '↟' },
    { label: 'Language', value: 'English, German', icon: '◎' }
  ]

  const handleMessageGuide = () => {
    window.dispatchEvent(
      new CustomEvent('tourtravel:open-guide-chat', {
        detail: {
          tourId: tour.id,
          guideName: tour.guide_name
        }
      })
    )
  }

  return (
    <div className="tour-detail-shell">
      <Header />

      <main className="container tour-detail-main">
        <section className="tour-detail-hero">
          <div
            className="tour-detail-hero-image"
            style={{ backgroundImage: `url(${tour.image || 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1400'})` }}
          >
            <div className="tour-detail-overlay" />
            <div className="tour-detail-hero-content">
              <div className="tour-detail-tags">
                <span>Most Popular</span>
                <span>Eco-Certified</span>
              </div>
              <h1>{tour.name}</h1>
              <div className="tour-detail-rating">
                <span>★ 4.9 (128 Reviews)</span>
                <span>◉ {tour.destination}</span>
              </div>
            </div>
          </div>
        </section>

        <div className="tour-detail-layout">
          <section className="tour-detail-content">
            <div className="tour-quick-grid">
              {quickInfo.map((item) => (
                <article key={item.label} className="tour-quick-card">
                  <span className="tour-quick-icon">{item.icon}</span>
                  <p>{item.label}</p>
                  <strong>{item.value}</strong>
                </article>
              ))}
            </div>

            {guide && (
              <section className="tour-guide-section">
                <h2>Meet your guide</h2>
                <div className="tour-guide-card">
                  <div className="tour-guide-profile">
                    <img src={guide.avatar} alt={guide.name} />
                    <div>
                      <strong>{guide.name}</strong>
                      <p>{guide.title} • {guide.experience}</p>
                      <div className="tour-guide-links">
                        <button type="button" onClick={handleMessageGuide}>Message Guide</button>
                        <span>Verified Guide</span>
                      </div>
                      <p>{guide.bio}</p>
                    </div>
                  </div>
                </div>
              </section>
            )}

            <section className="tour-overview-section">
              <h2>Overview</h2>
              <p>{tour.description}</p>
            </section>
          </section>

          <aside className="tour-booking-column">
            <div className="tour-booking-card">
              <div className="tour-booking-price">
                <div>
                  <strong>{formatCurrency(tour.price)}</strong>
                  <span>/ nguoi</span>
                </div>
                <span className="tour-booking-spots">{tour.available_slots} spots left</span>
              </div>

              <div className="tour-booking-field">
                <span>Select dates</span>
                <strong>{new Date(tour.start_date).toLocaleDateString()} - {new Date(tour.end_date).toLocaleDateString()}</strong>
              </div>

              <div className="tour-booking-field">
                <span>Travelers</span>
                <div className="tour-booking-travelers">
                  <input
                    type="number"
                    min="1"
                    max={tour.available_slots || 1}
                    value={quantity}
                    onChange={(event) => setQuantity(Math.max(1, Number(event.target.value) || 1))}
                  />
                  <strong>{quantity} Adults</strong>
                </div>
              </div>

              <button
                onClick={() => navigate('/checkout', { state: { tour, quantity } })}
                disabled={tour.available_slots < 1 || user?.role === 'guide'}
                className="tour-booking-button"
              >
                {user?.role === 'guide' ? 'Guide cannot book' : tour.available_slots < 1 ? 'Sold Out' : 'Reserve Now'}
              </button>

              <p className="tour-booking-note">No payment required today • 100% Secure</p>

              <div className="tour-booking-benefits">
                <span>Free cancellation up to 30 days before</span>
                <span>Travel protection included</span>
                <span>Best price guaranteed</span>
              </div>

              <div className="tour-booking-total">
                <span>Total amount</span>
                <strong>{formatCurrency(total)}</strong>
              </div>
            </div>
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  )
}
