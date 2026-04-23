import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { getTours } from '../api/tourService'
import { formatCurrency } from '../utils/currency'

const fallbackImage = 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1200'

const featureItems = [
  {
    title: 'Curated itineraries',
    description: 'Trips are planned around real pacing, local highlights, and easy logistics.'
  },
  {
    title: 'Flexible booking',
    description: 'Reserve quickly, review the details, and manage your plan from your account.'
  },
  {
    title: 'Trusted support',
    description: 'From first search to departure day, the experience stays clear and guided.'
  }
]

const testimonials = [
  {
    name: 'Linh Tran',
    location: 'Da Nang',
    quote: 'The booking flow was simple and the tour matched exactly what we expected.'
  },
  {
    name: 'Minh Hoang',
    location: 'Ho Chi Minh City',
    quote: 'I found a trip fast, compared options easily, and had everything confirmed quickly.'
  },
  {
    name: 'Anna Pham',
    location: 'Ha Noi',
    quote: 'The homepage made it easy to discover destinations that actually fit our schedule.'
  }
]

export default function Home() {
  const navigate = useNavigate()
  const [tours, setTours] = useState([])
  const [loading, setLoading] = useState(true)
  const [heroSearch, setHeroSearch] = useState({
    search: '',
    destination: '',
    duration: ''
  })

  useEffect(() => {
    const loadFeaturedTours = async () => {
      try {
        const data = await getTours()
        setTours(Array.isArray(data) ? data.slice(0, 3) : [])
      } catch {
        setTours([])
      } finally {
        setLoading(false)
      }
    }

    loadFeaturedTours()
  }, [])

  const destinations = useMemo(() => {
    return [...new Set(tours.map((tour) => tour.destination).filter(Boolean))].slice(0, 8)
  }, [tours])

  const heroHighlights = useMemo(() => {
    return tours.slice(0, 3).map((tour) => ({
      id: tour.id,
      name: tour.name,
      destination: tour.destination,
      price: formatCurrency(tour.price)
    }))
  }, [tours])

  const handleHeroSearch = (event) => {
    event.preventDefault()
    const params = new URLSearchParams()

    if (heroSearch.search.trim()) params.set('search', heroSearch.search.trim())
    if (heroSearch.destination) params.set('destination', heroSearch.destination)
    if (heroSearch.duration) params.set('duration', heroSearch.duration)

    navigate(`/tours${params.toString() ? `?${params.toString()}` : ''}`)
  }

  return (
    <div>
      <Header />

      <section className="hero-shell">
        <div className="hero-backdrop" />
        <div className="hero-orb hero-orb-left" />
        <div className="hero-orb hero-orb-right" />

        <div className="container hero-grid">
          <div className="hero-copy">
            <div className="hero-badge">TourTravel booking platform</div>
            <h1 className="hero-title">
              Plan smoother trips with
              <span className="hero-title-accent">clear choices and fast booking</span>
            </h1>
            <p className="hero-description">
              Browse destination-led tours, compare durations and pricing, then move from discovery
              to checkout in a few focused steps.
            </p>

            <div className="hero-stat-row">
              <div className="hero-stat-card">
                <strong>500+</strong>
                <span>Destinations to explore</span>
              </div>
              <div className="hero-stat-card">
                <strong>10K+</strong>
                <span>Travelers served</span>
              </div>
              <div className="hero-stat-card">
                <strong>24/7</strong>
                <span>Support availability</span>
              </div>
            </div>

            <Link to="/tours" className="btn btn-primary">
              Explore tours
            </Link>
          </div>

          <div className="hero-visual">
            <form className="hero-search-card" onSubmit={handleHeroSearch}>
              <div className="hero-search-header">
                <div>
                  <p className="hero-search-eyebrow">Search tours</p>
                  <h3 className="hero-search-title">Tìm tour phù hợp trong vài giây</h3>
                </div>
                <span className="hero-search-pill">Tim kiem nhanh</span>
              </div>

              <div className="hero-search-grid">
                <label className="hero-field">
                  <span>Tu khoa</span>
                  <input
                    value={heroSearch.search}
                    onChange={(event) => setHeroSearch((prev) => ({ ...prev, search: event.target.value }))}
                    placeholder="VD: Ha Long, bien, luxury..."
                  />
                </label>

                <label className="hero-field">
                  <span>Diem den</span>
                  <select
                    value={heroSearch.destination}
                    onChange={(event) => setHeroSearch((prev) => ({ ...prev, destination: event.target.value }))}
                  >
                    <option value="">Tat ca diem den</option>
                    {destinations.map((destination) => (
                      <option key={destination} value={destination}>{destination}</option>
                    ))}
                  </select>
                </label>

                <label className="hero-field">
                  <span>Thoi luong</span>
                  <select
                    value={heroSearch.duration}
                    onChange={(event) => setHeroSearch((prev) => ({ ...prev, duration: event.target.value }))}
                  >
                    <option value="">Bat ky</option>
                    <option value="1-3">1-3 ngay</option>
                    <option value="4-7">4-7 ngay</option>
                    <option value="8-14">8-14 ngay</option>
                    <option value="15+">15+ ngay</option>
                  </select>
                </label>

                <button type="submit" className="hero-search-button">
                  Tim tour
                </button>
              </div>

              <div className="hero-search-suggestions">
                <strong>Tuyen noi bat</strong>
                <div className="hero-search-chips">
                  {destinations.slice(0, 4).map((destination) => (
                    <button
                      key={destination}
                      type="button"
                      className="hero-search-chip"
                      onClick={() => setHeroSearch((prev) => ({ ...prev, destination }))}
                    >
                      {destination}
                    </button>
                  ))}
                </div>
              </div>

              <div className="hero-search-results">
                {heroHighlights.map((tour) => (
                  <button
                    key={tour.id}
                    type="button"
                    className="hero-search-result-card"
                    onClick={() => navigate(`/tours/${tour.id}`)}
                  >
                    <strong>{tour.name}</strong>
                    <span>{tour.destination}</span>
                    <em>Tu {tour.price}</em>
                  </button>
                ))}
              </div>
            </form>
          </div>
        </div>
      </section>

      <section className="featured-showcase">
        <div className="container">
          <div className="featured-showcase-head">
            <div>
              <h2>Featured tours</h2>
              <p>Popular options surfaced from the same tour catalog used across the app.</p>
            </div>
            <Link to="/tours" className="featured-view-link">
              View all tours
            </Link>
          </div>

          {loading ? (
            <div className="featured-loading">Loading featured tours...</div>
          ) : (
            <div className="featured-card-grid">
              {tours.map((tour) => (
                <Link key={tour.id} to={`/tours/${tour.id}`} className="featured-tour-card">
                  <div
                    className="featured-tour-image"
                    style={{ backgroundImage: `url(${tour.image || fallbackImage})` }}
                  >
                    <span className="featured-tour-badge">{tour.duration_days} days</span>
                    <span className="featured-tour-rating">4.8 rating</span>
                  </div>

                  <div className="featured-tour-body">
                    <h3>{tour.name}</h3>
                    <p>{tour.description}</p>

                    <div className="featured-tour-footer">
                      <div>
                        <span>From</span>
                        <strong>{formatCurrency(tour.price)}</strong>
                      </div>
                      <span className="featured-tour-action">See details</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="features-section">
        <div className="container">
          <div className="features-header">
            <h2 className="features-title">Why travelers keep using TourTravel</h2>
            <p className="features-subtitle">
              The experience is built to keep discovery simple while still giving enough detail to
              book confidently.
            </p>
          </div>

          <div className="features-grid">
            {featureItems.map((item) => (
              <article key={item.title} className="feature-card">
                <div className="feature-icon-wrapper">TT</div>
                <h3 className="feature-card-title">{item.title}</h3>
                <p className="feature-card-desc">{item.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="testimonials-section">
        <div className="container">
          <div className="features-header">
            <h2 className="features-title">Traveler feedback</h2>
            <p className="features-subtitle">A few short impressions from the kind of journeys this app supports.</p>
          </div>

          <div className="testimonials-grid">
            {testimonials.map((item) => (
              <article key={item.name} className="testimonial-card">
                <div className="testimonial-stars">★★★★★</div>
                <p className="testimonial-text">"{item.quote}"</p>
                <div className="testimonial-author-row">
                  <div className="testimonial-avatar" />
                  <div>
                    <div className="testimonial-author-name">{item.name}</div>
                    <div className="testimonial-author-loc">{item.location}</div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="newsletter-section">
        <div className="container">
          <h2 className="newsletter-title">Start with the full tour catalog</h2>
          <p className="newsletter-subtitle">
            Jump into the tours page to compare destinations, narrow your options, and continue to
            checkout when you are ready.
          </p>
          <div className="newsletter-form">
            <Link to="/tours" className="newsletter-button" style={{ textDecoration: 'none' }}>
              Browse tours now
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
