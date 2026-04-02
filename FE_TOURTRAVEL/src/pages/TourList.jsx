import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { getTours } from '../api/tourService'

const durationOptions = [
  { label: '1-3 Days', key: '1-3' },
  { label: '4-7 Days', key: '4-7' },
  { label: '8-14 Days', key: '8-14' },
  { label: '15+ Days', key: '15+' }
]

const styleOptions = ['Adventure', 'Luxury', 'Cultural', 'Beach']
const FALLBACK_PRICE_MIN = 500
const FALLBACK_PRICE_MAX = 5000

const formatCurrency = (value) =>
  `$${Math.round(value).toLocaleString('en-US')}`

export default function TourList() {
  const [tours, setTours] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState('latest')
  const [selectedDuration, setSelectedDuration] = useState('')
  const [selectedDestination, setSelectedDestination] = useState('')
  const [selectedStyle, setSelectedStyle] = useState('')
  const [priceBounds, setPriceBounds] = useState({
    min: FALLBACK_PRICE_MIN,
    max: FALLBACK_PRICE_MAX
  })
  const [priceRange, setPriceRange] = useState({
    min: FALLBACK_PRICE_MIN,
    max: FALLBACK_PRICE_MAX
  })

  useEffect(() => {
    loadTours()
  }, [])

  useEffect(() => {
    if (!tours.length) return

    const prices = tours.map((tour) => Number(tour.price) || 0)
    const min = Math.floor(Math.min(...prices))
    const max = Math.ceil(Math.max(...prices))

    setPriceBounds({ min, max })
    setPriceRange({ min, max })
  }, [tours])

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

  const destinations = useMemo(() => {
    return [...new Set(tours.map((tour) => tour.destination.split(',').slice(-1)[0].trim()))]
  }, [tours])

  const visibleTours = useMemo(() => {
    const keyword = search.trim().toLowerCase()

    const filtered = tours.filter((tour) => {
      const matchesKeyword =
        !keyword ||
        tour.name.toLowerCase().includes(keyword) ||
        tour.description.toLowerCase().includes(keyword) ||
        tour.destination.toLowerCase().includes(keyword)

      const matchesDestination =
        !selectedDestination || tour.destination.toLowerCase().includes(selectedDestination.toLowerCase())

      const matchesStyle =
        !selectedStyle || (tour.travel_style || '').toLowerCase() === selectedStyle.toLowerCase()

      const matchesDuration =
        !selectedDuration ||
        (selectedDuration === '1-3' && tour.duration_days <= 3) ||
        (selectedDuration === '4-7' && tour.duration_days >= 4 && tour.duration_days <= 7) ||
        (selectedDuration === '8-14' && tour.duration_days >= 8 && tour.duration_days <= 14) ||
        (selectedDuration === '15+' && tour.duration_days >= 15)

      const matchesPrice = tour.price >= priceRange.min && tour.price <= priceRange.max

      return matchesKeyword && matchesDestination && matchesStyle && matchesDuration && matchesPrice
    })

    return filtered.sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price
      if (sortBy === 'price-desc') return b.price - a.price
      if (sortBy === 'duration') return a.duration_days - b.duration_days
      return new Date(a.start_date) - new Date(b.start_date)
    })
  }, [priceRange.max, priceRange.min, search, selectedDestination, selectedDuration, selectedStyle, sortBy, tours])

  const minPercent = ((priceRange.min - priceBounds.min) / Math.max(priceBounds.max - priceBounds.min, 1)) * 100
  const maxPercent = ((priceRange.max - priceBounds.min) / Math.max(priceBounds.max - priceBounds.min, 1)) * 100

  const handleMinPriceChange = (event) => {
    const nextMin = Number(event.target.value)
    setPriceRange((prev) => ({
      ...prev,
      min: Math.min(nextMin, prev.max - 50)
    }))
  }

  const handleMaxPriceChange = (event) => {
    const nextMax = Number(event.target.value)
    setPriceRange((prev) => ({
      ...prev,
      max: Math.max(nextMax, prev.min + 50)
    }))
  }

  return (
    <div className="tour-list-shell">
      <Header />

      <main className="container tour-list-main">
        <div className="tour-list-layout">
          <aside className="tour-filter-panel">
            <div className="tour-filter-title-block">
              <h2>Filters</h2>
              <p>Refine your perfect trip</p>
            </div>

            <section className="tour-filter-group">
              <h3>Price Range</h3>
              <div className="tour-filter-range">
                <div className="tour-filter-range-values">
                  <span>{formatCurrency(priceRange.min)}</span>
                  <span>{formatCurrency(priceRange.max)}</span>
                </div>

                <div className="tour-filter-slider-wrap">
                  <div className="tour-filter-slider">
                    <div className="tour-filter-slider-track" />
                    <div
                      className="tour-filter-slider-active"
                      style={{
                        left: `${minPercent}%`,
                        width: `${maxPercent - minPercent}%`
                      }}
                    />
                    <input
                      type="range"
                      min={priceBounds.min}
                      max={priceBounds.max}
                      value={priceRange.min}
                      onChange={handleMinPriceChange}
                      className="tour-filter-range-input"
                    />
                    <input
                      type="range"
                      min={priceBounds.min}
                      max={priceBounds.max}
                      value={priceRange.max}
                      onChange={handleMaxPriceChange}
                      className="tour-filter-range-input"
                    />
                  </div>
                </div>
              </div>
            </section>

            <section className="tour-filter-group">
              <h3>Duration</h3>
              <div className="tour-filter-chip-row">
                {durationOptions.map((option) => (
                  <button
                    key={option.key}
                    type="button"
                    className={`tour-filter-chip ${selectedDuration === option.key ? 'active' : ''}`}
                    onClick={() => setSelectedDuration(selectedDuration === option.key ? '' : option.key)}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </section>

            <section className="tour-filter-group">
              <h3>Destination</h3>
              <div className="tour-filter-checkboxes">
                {destinations.map((destination) => (
                  <label key={destination}>
                    <input
                      type="checkbox"
                      checked={selectedDestination === destination}
                      onChange={() => setSelectedDestination(selectedDestination === destination ? '' : destination)}
                    />
                    <span>{destination}</span>
                  </label>
                ))}
              </div>
            </section>

            <section className="tour-filter-group">
              <h3>Travel Style</h3>
              <div className="tour-filter-radios">
                {styleOptions.map((style) => (
                  <button
                    key={style}
                    type="button"
                    className={`tour-filter-choice ${selectedStyle === style ? 'active' : ''}`}
                    onClick={() => setSelectedStyle(selectedStyle === style ? '' : style)}
                  >
                    <span className="tour-filter-choice-dot" />
                    <span>{style}</span>
                  </button>
                ))}
              </div>
            </section>
          </aside>

          <section className="tour-list-content">
            <div className="tour-list-header">
              <div>
                <h1>Explore Our Tours</h1>
                <p>{visibleTours.length} tours found matching your criteria</p>
              </div>

              <div className="tour-list-controls">
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search tours..."
                  className="tour-list-search"
                />
                <div className="tour-list-sort">
                  <span>Sort by:</span>
                  <select value={sortBy} onChange={(event) => setSortBy(event.target.value)}>
                    <option value="latest">Most Popular</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                    <option value="duration">Duration</option>
                  </select>
                </div>
              </div>
            </div>

            {loading && <div className="tour-list-feedback">Dang tai tour...</div>}
            {error && <div className="tour-list-feedback error">{error}</div>}

            {!loading && !error && (
              <div className="tour-card-grid">
                {visibleTours.map((tour, index) => (
                  <article key={tour.id} className="tour-browser-card">
                    <div
                      className="tour-browser-image"
                      style={{ backgroundImage: `url(${tour.image || 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800'})` }}
                    >
                      <span className="tour-browser-duration">{tour.duration_days} Days</span>
                    </div>

                    <div className="tour-browser-body">
                      <span className="tour-browser-location">◉ {tour.destination.toUpperCase()}</span>
                      <h3>{tour.name}</h3>
                      <p>{tour.description}</p>

                      <div className="tour-browser-footer">
                        <div>
                          <span>From</span>
                          <strong>${tour.price}</strong>
                        </div>

                        <Link to={`/tours/${tour.id}`} className="tour-browser-button">
                          {index % 2 === 0 ? 'Book Now' : 'Details'}
                        </Link>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}

            <div className="tour-list-pagination">
              <button type="button">‹</button>
              <button type="button" className="active">1</button>
              <button type="button">2</button>
              <button type="button">3</button>
              <span>...</span>
              <button type="button">12</button>
              <button type="button">›</button>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  )
}
