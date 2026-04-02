import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getTours } from '../api/tourService'
import Header from '../components/Header'

export default function Home() {
  const [tours, setTours] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [destination, setDestination] = useState('')
  const [duration, setDuration] = useState('')
  const [email, setEmail] = useState('')

  useEffect(() => {
    loadTours()
  }, [])

  const loadTours = async () => {
    try {
      const data = await getTours()
      setTours(data.slice(0, 6)) // Show only first 6 tours
    } catch (error) {
      console.error('Failed to load tours:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    // Handle search logic
    console.log('Search:', { searchTerm, destination, duration })
  }

  const handleNewsletterSubmit = (e) => {
    e.preventDefault()
    // Handle newsletter signup
    console.log('Newsletter signup:', email)
    setEmail('')
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-gray-50)' }}>
      <Header />

      {/* Hero Section */}
      <section className="hero-shell">
        <div className="hero-backdrop"></div>
        <div className="hero-orb hero-orb-left"></div>
        <div className="hero-orb hero-orb-right"></div>
        <div className="container hero-grid">
          <div className="hero-copy">
            <div className="hero-badge">Curated journeys across mountains, seas and cities</div>
            <h1 className="hero-title">
              Travel Beyond
              <span className="hero-title-accent"> the ordinary</span>
            </h1>
            <p className="hero-description">
              Build your next escape with premium itineraries, handpicked local experiences and flexible departures for every kind of explorer.
            </p>

            <div className="hero-stat-row">
              <div className="hero-stat-card">
                <strong>120+</strong>
                <span>premium tours</span>
              </div>
              <div className="hero-stat-card">
                <strong>4.9/5</strong>
                <span>traveler rating</span>
              </div>
              <div className="hero-stat-card">
                <strong>24/7</strong>
                <span>support team</span>
              </div>
            </div>

            <form onSubmit={handleSearch} className="hero-search-card">
              <div className="hero-search-header">
                <div>
                  <p className="hero-search-eyebrow">Start planning</p>
                  <h2 className="hero-search-title">Find a trip that fits your pace</h2>
                </div>
                <div className="hero-search-pill">No booking fees</div>
              </div>

              <div className="hero-search-grid">
                <label className="hero-field">
                  <span>Destination</span>
                  <input
                    type="text"
                    placeholder="Bali, Kyoto, Da Nang..."
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                  />
                </label>

                <label className="hero-field">
                  <span>Duration</span>
                  <select
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                  >
                    <option value="">Any duration</option>
                    <option value="1-3">1-3 days</option>
                    <option value="4-7">4-7 days</option>
                    <option value="8-14">1-2 weeks</option>
                    <option value="15+">2+ weeks</option>
                  </select>
                </label>

                <label className="hero-field">
                  <span>Tour style</span>
                  <input
                    type="text"
                    placeholder="Luxury, culture, nature..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </label>

                <button type="submit" className="hero-search-button">
                  Explore Tours
                </button>
              </div>
            </form>
          </div>

          <div className="hero-visual">
            <div className="hero-feature-card hero-feature-main">
              <p className="hero-feature-label">Trending escape</p>
              <h3>Alpine Sunrise Route</h3>
              <p>7 days of panoramic train rides, ridge hikes and boutique stays above the clouds.</p>
              <div className="hero-feature-meta">
                <span>From $1,280</span>
                <span>12 seats left</span>
              </div>
            </div>

            <div className="hero-feature-card hero-feature-floating">
              <p className="hero-feature-label">This week</p>
              <h3>Japan city-light edit</h3>
              <p>Tokyo, Kyoto and Osaka packed into a sleek, culture-first itinerary.</p>
            </div>

            <div className="hero-feature-chip hero-chip-top">Flexible departure dates</div>
            <div className="hero-feature-chip hero-chip-bottom">Tailored for couples, groups and solo travelers</div>
          </div>
        </div>
      </section>

      {/* Featured Tours */}
      <section className="featured-showcase">
        <div className="container">
          <div className="featured-showcase-head">
            <div>
              <h2>Featured Tours</h2>
              <p>Most popular adventures chosen by our community</p>
            </div>
            <Link to="/tours" className="featured-view-link">View all</Link>
          </div>

          {loading ? (
            <div className="featured-loading">Loading tours...</div>
          ) : (
            <div className="featured-card-grid">
              {tours.slice(0, 3).map((tour, index) => (
                <Link key={tour.id} to={`/tours/${tour.id}`} className="featured-tour-card">
                  <div
                    className="featured-tour-image"
                    style={{ backgroundImage: `url(${tour.image || 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800'})` }}
                  >
                    {index === 0 && <span className="featured-tour-badge">New</span>}
                    <span className="featured-tour-rating">★ 4.{9 - index}</span>
                  </div>

                  <div className="featured-tour-body">
                    <h3>{tour.name}</h3>
                    <p>{tour.description}</p>

                    <div className="featured-tour-footer">
                      <div>
                        <strong>${tour.price}</strong>
                        <span>/ person</span>
                      </div>
                      <span className="featured-tour-action">Details</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Why Choose Us */}
      <section style={{ padding: 'var(--spacing-3xl) 0', backgroundColor: 'var(--bg-gray-50)' }}>
        <div style={{ maxWidth: 'var(--container-max)', margin: '0 auto', padding: '0 var(--spacing-lg)' }}>
          <div style={{ textAlign: 'center', marginBottom: 'var(--spacing-2xl)' }}>
            <h2 style={{
              fontSize: 'var(--text-4xl)',
              fontWeight: 'var(--font-black)',
              color: 'var(--text-gray-900)',
              marginBottom: 'var(--spacing-lg)'
            }}>
              Why Choose TOURTRAVEL?
            </h2>
            <p style={{
              fontSize: 'var(--text-lg)',
              color: 'var(--text-gray-600)',
              maxWidth: '600px',
              margin: '0 auto'
            }}>
              We're committed to providing exceptional travel experiences with personalized service and attention to detail.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: 'var(--spacing-xl)'
          }}>
            <div style={{
              backgroundColor: 'var(--bg-white)',
              padding: 'var(--spacing-xl)',
              borderRadius: 'var(--border-radius-xl)',
              textAlign: 'center',
              boxShadow: 'var(--shadow-sm)'
            }}>
              <div style={{
                width: '64px',
                height: '64px',
                backgroundColor: 'rgba(0, 119, 182, 0.1)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto var(--spacing-lg)',
                fontSize: '32px'
              }}>
                🏆
              </div>
              <h3 style={{
                fontSize: 'var(--text-xl)',
                fontWeight: 'var(--font-bold)',
                color: 'var(--text-gray-900)',
                marginBottom: 'var(--spacing-md)'
              }}>
                Expert Guides
              </h3>
              <p style={{ color: 'var(--text-gray-600)', lineHeight: 1.6 }}>
                Our certified local guides provide authentic experiences and deep insights into each destination.
              </p>
            </div>

            <div style={{
              backgroundColor: 'var(--bg-white)',
              padding: 'var(--spacing-xl)',
              borderRadius: 'var(--border-radius-xl)',
              textAlign: 'center',
              boxShadow: 'var(--shadow-sm)'
            }}>
              <div style={{
                width: '64px',
                height: '64px',
                backgroundColor: 'rgba(0, 119, 182, 0.1)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto var(--spacing-lg)',
                fontSize: '32px'
              }}>
                🛡️
              </div>
              <h3 style={{
                fontSize: 'var(--text-xl)',
                fontWeight: 'var(--font-bold)',
                color: 'var(--text-gray-900)',
                marginBottom: 'var(--spacing-md)'
              }}>
                Safe & Secure
              </h3>
              <p style={{ color: 'var(--text-gray-600)', lineHeight: 1.6 }}>
                Your safety is our priority with comprehensive travel insurance and 24/7 support throughout your journey.
              </p>
            </div>

            <div style={{
              backgroundColor: 'var(--bg-white)',
              padding: 'var(--spacing-xl)',
              borderRadius: 'var(--border-radius-xl)',
              textAlign: 'center',
              boxShadow: 'var(--shadow-sm)'
            }}>
              <div style={{
                width: '64px',
                height: '64px',
                backgroundColor: 'rgba(0, 119, 182, 0.1)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto var(--spacing-lg)',
                fontSize: '32px'
              }}>
                💰
              </div>
              <h3 style={{
                fontSize: 'var(--text-xl)',
                fontWeight: 'var(--font-bold)',
                color: 'var(--text-gray-900)',
                marginBottom: 'var(--spacing-md)'
              }}>
                Best Price Guarantee
              </h3>
              <p style={{ color: 'var(--text-gray-600)', lineHeight: 1.6 }}>
                We offer competitive pricing and match or beat any comparable tour package you find elsewhere.
              </p>
            </div>

            <div style={{
              backgroundColor: 'var(--bg-white)',
              padding: 'var(--spacing-xl)',
              borderRadius: 'var(--border-radius-xl)',
              textAlign: 'center',
              boxShadow: 'var(--shadow-sm)'
            }}>
              <div style={{
                width: '64px',
                height: '64px',
                backgroundColor: 'rgba(0, 119, 182, 0.1)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto var(--spacing-lg)',
                fontSize: '32px'
              }}>
                🌍
              </div>
              <h3 style={{
                fontSize: 'var(--text-xl)',
                fontWeight: 'var(--font-bold)',
                color: 'var(--text-gray-900)',
                marginBottom: 'var(--spacing-md)'
              }}>
                Sustainable Travel
              </h3>
              <p style={{ color: 'var(--text-gray-600)', lineHeight: 1.6 }}>
                We partner with eco-friendly accommodations and support local conservation initiatives.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section style={{ padding: 'var(--spacing-3xl) 0', backgroundColor: 'var(--bg-white)' }}>
        <div style={{ maxWidth: 'var(--container-max)', margin: '0 auto', padding: '0 var(--spacing-lg)' }}>
          <div style={{ textAlign: 'center', marginBottom: 'var(--spacing-2xl)' }}>
            <h2 style={{
              fontSize: 'var(--text-4xl)',
              fontWeight: 'var(--font-black)',
              color: 'var(--text-gray-900)',
              marginBottom: 'var(--spacing-lg)'
            }}>
              What Our Travelers Say
            </h2>
            <p style={{
              fontSize: 'var(--text-lg)',
              color: 'var(--text-gray-600)',
              maxWidth: '600px',
              margin: '0 auto'
            }}>
              Don't just take our word for it. Here's what our satisfied customers have to say about their experiences.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: 'var(--spacing-xl)'
          }}>
            <div style={{
              backgroundColor: 'var(--bg-gray-50)',
              padding: 'var(--spacing-xl)',
              borderRadius: 'var(--border-radius-xl)',
              boxShadow: 'var(--shadow-sm)'
            }}>
              <div style={{ display: 'flex', gap: '2px', marginBottom: 'var(--spacing-md)' }}>
                {[...Array(5)].map((_, i) => (
                  <span key={i} style={{ color: '#fbbf24', fontSize: '18px' }}>⭐</span>
                ))}
              </div>
              <p style={{
                fontSize: 'var(--text-base)',
                color: 'var(--text-gray-700)',
                lineHeight: 1.6,
                marginBottom: 'var(--spacing-lg)',
                fontStyle: 'italic'
              }}>
                "The Swiss Alps tour exceeded all our expectations. The scenery was breathtaking, and our guide was incredibly knowledgeable. Every detail was perfectly organized!"
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)' }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--bg-gray-300)',
                  backgroundImage: 'url(https://images.unsplash.com/photo-1494790108755-2616b612b786?w=48)',
                  backgroundSize: 'cover'
                }}></div>
                <div>
                  <p style={{ fontWeight: 'var(--font-bold)', color: 'var(--text-gray-900)' }}>Sarah Johnson</p>
                  <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-gray-500)' }}>New York, USA</p>
                </div>
              </div>
            </div>

            <div style={{
              backgroundColor: 'var(--bg-gray-50)',
              padding: 'var(--spacing-xl)',
              borderRadius: 'var(--border-radius-xl)',
              boxShadow: 'var(--shadow-sm)'
            }}>
              <div style={{ display: 'flex', gap: '2px', marginBottom: 'var(--spacing-md)' }}>
                {[...Array(5)].map((_, i) => (
                  <span key={i} style={{ color: '#fbbf24', fontSize: '18px' }}>⭐</span>
                ))}
              </div>
              <p style={{
                fontSize: 'var(--text-base)',
                color: 'var(--text-gray-700)',
                lineHeight: 1.6,
                marginBottom: 'var(--spacing-lg)',
                fontStyle: 'italic'
              }}>
                "From start to finish, this was an incredible experience. The accommodations were luxurious, the food was amazing, and the activities were perfectly paced."
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)' }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--bg-gray-300)',
                  backgroundImage: 'url(https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=48)',
                  backgroundSize: 'cover'
                }}></div>
                <div>
                  <p style={{ fontWeight: 'var(--font-bold)', color: 'var(--text-gray-900)' }}>Michael Chen</p>
                  <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-gray-500)' }}>Toronto, Canada</p>
                </div>
              </div>
            </div>

            <div style={{
              backgroundColor: 'var(--bg-gray-50)',
              padding: 'var(--spacing-xl)',
              borderRadius: 'var(--border-radius-xl)',
              boxShadow: 'var(--shadow-sm)'
            }}>
              <div style={{ display: 'flex', gap: '2px', marginBottom: 'var(--spacing-md)' }}>
                {[...Array(5)].map((_, i) => (
                  <span key={i} style={{ color: '#fbbf24', fontSize: '18px' }}>⭐</span>
                ))}
              </div>
              <p style={{
                fontSize: 'var(--text-base)',
                color: 'var(--text-gray-700)',
                lineHeight: 1.6,
                marginBottom: 'var(--spacing-lg)',
                fontStyle: 'italic'
              }}>
                "TOURTRAVEL made our honeymoon absolutely perfect. The attention to detail and personalized service made us feel special throughout our entire trip."
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)' }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--bg-gray-300)',
                  backgroundImage: 'url(https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=48)',
                  backgroundSize: 'cover'
                }}></div>
                <div>
                  <p style={{ fontWeight: 'var(--font-bold)', color: 'var(--text-gray-900)' }}>Emma Rodriguez</p>
                  <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-gray-500)' }}>Barcelona, Spain</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section style={{
        backgroundColor: 'var(--primary-color)',
        padding: 'var(--spacing-3xl) 0',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: 'var(--container-max)', margin: '0 auto', padding: '0 var(--spacing-lg)' }}>
          <h2 style={{
            fontSize: 'var(--text-4xl)',
            fontWeight: 'var(--font-black)',
            color: 'white',
            marginBottom: 'var(--spacing-lg)'
          }}>
            Stay Updated
          </h2>
          <p style={{
            fontSize: 'var(--text-lg)',
            color: 'rgba(255, 255, 255, 0.9)',
            marginBottom: 'var(--spacing-2xl)',
            maxWidth: '600px',
            margin: '0 auto var(--spacing-2xl)'
          }}>
            Subscribe to our newsletter and be the first to know about exclusive deals, new destinations, and travel tips.
          </p>

          <form onSubmit={handleNewsletterSubmit} style={{
            maxWidth: '500px',
            margin: '0 auto',
            display: 'flex',
            gap: 'var(--spacing-md)'
          }}>
            <input
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                flex: 1,
                padding: 'var(--spacing-lg)',
                border: 'none',
                borderRadius: 'var(--border-radius-lg)',
                fontSize: 'var(--text-base)'
              }}
            />
            <button
              type="submit"
              style={{
                padding: 'var(--spacing-lg) var(--spacing-xl)',
                backgroundColor: 'var(--bg-gray-900)',
                color: 'white',
                border: 'none',
                borderRadius: 'var(--border-radius-lg)',
                fontWeight: 'var(--font-bold)',
                cursor: 'pointer',
                boxShadow: 'var(--shadow-lg)'
              }}
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </div>
  )
}
