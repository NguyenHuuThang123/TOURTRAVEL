import { useState } from 'react'
import { Link } from 'react-router-dom'

export default function TourList() {
  const [filters, setFilters] = useState({
    priceRange: [500, 5000],
    duration: '',
    destination: '',
    travelStyle: ''
  })

  const [sortBy, setSortBy] = useState('Most Popular')

  // Mock data - sẽ thay bằng API call
  const tours = [
    {
      id: 1,
      name: "Parisian Dreams: Art & Culture",
      location: "Paris, France",
      duration: "5 Days",
      price: 1299,
      rating: 4.8,
      image: "https://images.unsplash.com/photo-1502602898536-47ad22581b52?w=400"
    },
    {
      id: 2,
      name: "Emerald Waters of Vietnam",
      location: "Ha Long Bay, Vietnam",
      duration: "10 Days",
      price: 850,
      rating: 4.7,
      image: "https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=400"
    },
    {
      id: 3,
      name: "Sahara Desert Expedition",
      location: "Sahara, Morocco",
      duration: "7 Days",
      price: 1100,
      rating: 4.9,
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400"
    },
    {
      id: 4,
      name: "Italian Coastal Romance",
      location: "Amalfi Coast, Italy",
      duration: "8 Days",
      price: 2450,
      rating: 4.6,
      image: "https://images.unsplash.com/photo-1531572753322-ad063cecc140?w=400"
    },
    {
      id: 5,
      name: "Neon Lights & Zen Temples",
      location: "Tokyo, Japan",
      duration: "12 Days",
      price: 3200,
      rating: 4.8,
      image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400"
    },
    {
      id: 6,
      name: "Private Island Sanctuary",
      location: "Male, Maldives",
      duration: "6 Days",
      price: 4500,
      rating: 4.9,
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400"
    }
  ]

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-gray-50)' }}>
      {/* Header */}
      <header style={{
        backgroundColor: 'var(--bg-white)',
        borderBottom: '1px solid var(--border-gray-200)',
        padding: 'var(--spacing-lg) 0',
        position: 'sticky',
        top: 0,
        zIndex: 50
      }}>
        <div style={{ maxWidth: 'var(--container-max)', margin: '0 auto', padding: '0 var(--spacing-lg)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
              <div style={{ color: 'var(--primary-color)' }}>
                <svg width="32" height="32" viewBox="0 0 48 48" fill="currentColor">
                  <path d="M24 45.8096C19.6865 45.8096 15.4698 44.5305 11.8832 42.134C8.29667 39.7376 5.50128 36.3314 3.85056 32.3462C2.19985 28.361 1.76794 23.9758 2.60947 19.7452C3.451 15.5145 5.52816 11.6284 8.57829 8.5783C11.6284 5.52817 15.5145 3.45101 19.7452 2.60948C23.9758 1.76795 28.361 2.19986 32.3462 3.85057C36.3314 5.50129 39.7376 8.29668 42.134 11.8833C44.5305 15.4698 45.8096 19.6865 45.8096 24L24 24L24 45.8096Z"/>
                </svg>
              </div>
              <h1 style={{ fontSize: 'var(--text-xl)', fontWeight: 'var(--font-black)', color: 'var(--text-gray-900)' }}>
                TOURTRAVEL
              </h1>
            </Link>

            <nav style={{ display: 'none', gap: 'var(--spacing-xl)', alignItems: 'center' }} className="md:flex">
              <Link to="/tours" style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-medium)', color: 'var(--primary-color)' }}>
                Tours
              </Link>
              <Link to="/destinations" style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-medium)', color: 'var(--text-gray-600)' }}>
                Destinations
              </Link>
              <Link to="/about" style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-medium)', color: 'var(--text-gray-600)' }}>
                About
              </Link>
            </nav>

            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)' }}>
              <div style={{ position: 'relative', display: 'none' }} className="sm:block">
                <input
                  type="text"
                  placeholder="Search tours..."
                  style={{
                    height: '40px',
                    width: '256px',
                    borderRadius: 'var(--border-radius-lg)',
                    border: 'none',
                    backgroundColor: 'var(--bg-gray-100)',
                    padding: '0 var(--spacing-lg)',
                    paddingLeft: '40px',
                    fontSize: 'var(--text-sm)'
                  }}
                />
              </div>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                backgroundColor: 'var(--primary-color)',
                opacity: 0.1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <span style={{ color: 'var(--primary-color)', fontSize: '20px' }}>👤</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main style={{ maxWidth: 'var(--container-max)', margin: '0 auto', padding: 'var(--spacing-xl) var(--spacing-lg)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '256px 1fr', gap: 'var(--spacing-xl)' }}>

          {/* Sidebar Filters */}
          <aside>
            <div style={{ position: 'sticky', top: '100px' }}>
              <div style={{ marginBottom: 'var(--spacing-xl)' }}>
                <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-bold)', marginBottom: 'var(--spacing-md)' }}>
                  Filters
                </h3>
                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-gray-500)' }}>
                  Refine your perfect trip
                </p>
              </div>

              {/* Price Range */}
              <div style={{ marginBottom: 'var(--spacing-lg)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)', marginBottom: 'var(--spacing-md)' }}>
                  <span style={{ color: 'var(--primary-color)' }}>💰</span>
                  <span style={{ fontWeight: 'var(--font-semibold)' }}>Price Range</span>
                </div>
                <div style={{ padding: '0 var(--spacing-sm)' }}>
                  <div style={{
                    height: '2px',
                    width: '100%',
                    borderRadius: 'var(--border-radius-full)',
                    backgroundColor: 'var(--bg-gray-200)',
                    position: 'relative'
                  }}>
                    <div style={{
                      position: 'absolute',
                      inset: 0,
                      left: '20%',
                      right: '30%',
                      backgroundColor: 'var(--primary-color)',
                      borderRadius: 'var(--border-radius-full)'
                    }}></div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 'var(--spacing-md)' }}>
                    <span style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--font-medium)', color: 'var(--text-gray-600)' }}>
                      $500
                    </span>
                    <span style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--font-medium)', color: 'var(--text-gray-600)' }}>
                      $5,000+
                    </span>
                  </div>
                </div>
              </div>

              {/* Duration */}
              <div style={{ marginBottom: 'var(--spacing-lg)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)', marginBottom: 'var(--spacing-md)' }}>
                  <span style={{ color: 'var(--primary-color)' }}>⏰</span>
                  <span style={{ fontWeight: 'var(--font-semibold)' }}>Duration</span>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-sm)' }}>
                  {['1-3 Days', '4-7 Days', '8-14 Days', '15+ Days'].map(duration => (
                    <button
                      key={duration}
                      style={{
                        padding: 'var(--spacing-xs) var(--spacing-sm)',
                        borderRadius: 'var(--border-radius-lg)',
                        border: 'none',
                        backgroundColor: filters.duration === duration ? 'var(--primary-color)' : 'var(--bg-gray-100)',
                        color: filters.duration === duration ? 'white' : 'var(--text-gray-700)',
                        fontSize: 'var(--text-xs)',
                        fontWeight: 'var(--font-medium)',
                        cursor: 'pointer'
                      }}
                      onClick={() => setFilters({...filters, duration: duration === filters.duration ? '' : duration})}
                    >
                      {duration}
                    </button>
                  ))}
                </div>
              </div>

              {/* Destination */}
              <div style={{ marginBottom: 'var(--spacing-lg)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)', marginBottom: 'var(--spacing-md)' }}>
                  <span style={{ color: 'var(--primary-color)' }}>📍</span>
                  <span style={{ fontWeight: 'var(--font-semibold)' }}>Destination</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
                  {['Europe', 'Asia', 'South America', 'Africa'].map(dest => (
                    <label key={dest} style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={filters.destination === dest}
                        onChange={() => setFilters({...filters, destination: dest === filters.destination ? '' : dest})}
                        style={{ borderRadius: 'var(--border-radius-sm)', border: '1px solid var(--border-gray-300)' }}
                      />
                      <span style={{ fontSize: 'var(--text-sm)' }}>{dest}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Travel Style */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)', marginBottom: 'var(--spacing-md)' }}>
                  <span style={{ color: 'var(--primary-color)' }}>🏔️</span>
                  <span style={{ fontWeight: 'var(--font-semibold)' }}>Travel Style</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
                  {['Adventure', 'Luxury', 'Cultural'].map(style => (
                    <label key={style} style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)', cursor: 'pointer' }}>
                      <input
                        type="radio"
                        name="style"
                        checked={filters.travelStyle === style}
                        onChange={() => setFilters({...filters, travelStyle: style})}
                        style={{ border: '1px solid var(--border-gray-300)' }}
                      />
                      <span style={{ fontSize: 'var(--text-sm)' }}>{style}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <section>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 'var(--spacing-xl)' }}>
              <div>
                <h1 style={{ fontSize: 'var(--text-3xl)', fontWeight: 'var(--font-black)', marginBottom: 'var(--spacing-sm)' }}>
                  Explore Our Tours
                </h1>
                <p style={{ color: 'var(--text-gray-500)' }}>
                  {tours.length} tours found matching your criteria
                </p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
                <span style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-medium)' }}>Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  style={{
                    borderRadius: 'var(--border-radius-lg)',
                    border: 'none',
                    backgroundColor: 'var(--bg-gray-100)',
                    padding: 'var(--spacing-sm) var(--spacing-md)',
                    fontSize: 'var(--text-sm)'
                  }}
                >
                  <option>Most Popular</option>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                  <option>Duration</option>
                </select>
              </div>
            </div>

            {/* Tours Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: 'var(--spacing-xl)'
            }}>
              {tours.map(tour => (
                <Link key={tour.id} to={`/tour/${tour.id}`} style={{ textDecoration: 'none' }}>
                  <div style={{
                    backgroundColor: 'var(--bg-white)',
                    borderRadius: 'var(--border-radius-xl)',
                    overflow: 'hidden',
                    boxShadow: 'var(--shadow-sm)',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                  >
                    <div style={{ position: 'relative', height: '200px', overflow: 'hidden' }}>
                      <img
                        src={tour.image}
                        alt={tour.name}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          transition: 'transform 0.5s ease'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                      />
                      <div style={{
                        position: 'absolute',
                        top: 'var(--spacing-md)',
                        right: 'var(--spacing-md)',
                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                        padding: 'var(--spacing-xs) var(--spacing-sm)',
                        borderRadius: 'var(--border-radius-full)',
                        fontSize: 'var(--text-xs)',
                        fontWeight: 'var(--font-bold)',
                        color: 'var(--primary-color)',
                        backdropFilter: 'blur(4px)'
                      }}>
                        {tour.duration}
                      </div>
                    </div>
                    <div style={{ padding: 'var(--spacing-lg)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-xs)', marginBottom: 'var(--spacing-sm)' }}>
                        <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-gray-400)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                          📍 {tour.location}
                        </span>
                      </div>
                      <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-bold)', marginBottom: 'var(--spacing-sm)', lineHeight: 1.3 }}>
                        {tour.name}
                      </h3>
                      <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-gray-500)', marginBottom: 'var(--spacing-lg)', lineHeight: 1.5 }}>
                        Discover breathtaking destinations and create unforgettable memories.
                      </p>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div>
                          <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-gray-400)' }}>From</span>
                          <div style={{ fontSize: 'var(--text-xl)', fontWeight: 'var(--font-black)', color: 'var(--primary-color)' }}>
                            ${tour.price}
                          </div>
                        </div>
                        <button style={{
                          padding: 'var(--spacing-sm) var(--spacing-md)',
                          backgroundColor: 'var(--primary-color)',
                          color: 'white',
                          border: 'none',
                          borderRadius: 'var(--border-radius-lg)',
                          fontSize: 'var(--text-sm)',
                          fontWeight: 'var(--font-bold)',
                          cursor: 'pointer',
                          transition: 'background-color 0.3s ease'
                        }}>
                          Book Now
                        </button>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Pagination */}
            <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'var(--spacing-sm)', marginTop: 'var(--spacing-2xl)' }}>
              <button style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '40px',
                height: '40px',
                borderRadius: 'var(--border-radius-lg)',
                backgroundColor: 'var(--bg-gray-100)',
                border: 'none',
                cursor: 'pointer'
              }}>
                ‹
              </button>
              {[1, 2, 3, 4, 5].map(page => (
                <button
                  key={page}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '40px',
                    height: '40px',
                    borderRadius: 'var(--border-radius-lg)',
                    backgroundColor: page === 1 ? 'var(--primary-color)' : 'var(--bg-gray-100)',
                    color: page === 1 ? 'white' : 'var(--text-gray-700)',
                    border: 'none',
                    fontWeight: 'var(--font-bold)',
                    cursor: 'pointer'
                  }}
                >
                  {page}
                </button>
              ))}
              <span style={{ padding: '0 var(--spacing-sm)', color: 'var(--text-gray-400)' }}>...</span>
              <button style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '40px',
                height: '40px',
                borderRadius: 'var(--border-radius-lg)',
                backgroundColor: 'var(--bg-gray-100)',
                border: 'none',
                cursor: 'pointer'
              }}>
                ›
              </button>
            </nav>
          </section>
        </div>
      </main>
    </div>
  )
}