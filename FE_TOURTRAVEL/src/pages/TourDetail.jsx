import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'

export default function TourDetail() {
  const { id } = useParams()
  const [tour, setTour] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedDate, setSelectedDate] = useState('Aug 12 - Aug 19, 2024')
  const [travelers, setTravelers] = useState('2 Adults')

  useEffect(() => {
    loadTour()
  }, [id])

  const loadTour = async () => {
    try {
      const mockTour = {
        id: parseInt(id),
        name: 'Swiss Alps Adventure: 7-Day Expedition',
        location: 'Interlaken, Switzerland',
        duration: '7 Days',
        price: 3499,
        rating: 4.9,
        reviews: 128,
        description: 'Embark on a soul-stirring journey through the heart of the Swiss Alps. From the crystal-clear waters of Lake Brienz to the towering peaks of the Eiger, Mönch, and Jungfrau, this expedition offers an unparalleled blend of luxury accommodation and rugged outdoor adventure.',
        highlights: ['Most Popular', 'Eco-Certified'],
        itinerary: [
          {
            day: 1,
            title: 'Arrival in Interlaken & Welcome Dinner',
            description: 'Settle into your boutique hotel overlooking the lakes. In the evening, meet your fellow explorers for a traditional Swiss welcome dinner at a historic chalet.'
          },
          {
            day: 2,
            title: 'Lauterbrunnen: The Valley of 72 Waterfalls',
            description: 'Explore the stunning U-shaped valley. Hike behind Staubbach Falls and take the cable car to the car-free village of Mürren for spectacular panoramic views.'
          },
          {
            day: 3,
            title: 'Jungfraujoch: Top of Europe',
            description: 'Board the cogwheel train to the highest railway station in Europe (3,454m). Visit the Ice Palace and take in the breathtaking Aletsch Glacier.'
          }
        ],
        inclusions: [
          '6 Nights luxury accommodation',
          'All breakfast and 4 dinners',
          'All transport within Switzerland',
          'Professional mountain guides',
          'Jungfraujoch railway pass'
        ],
        exclusions: [
          'International flights',
          'Travel insurance (required)',
          'Personal equipment (boots/gear)',
          'Alcoholic beverages'
        ],
        images: [
          'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200',
          'https://images.unsplash.com/photo-1464822759844-d150f39ac1ac?w=1200',
          'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200',
          'https://images.unsplash.com/photo-1464822759844-d150f39ac1ac?w=1200',
          'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200',
          'https://images.unsplash.com/photo-1464822759844-d150f39ac1ac?w=1200'
        ]
      }
      setTour(mockTour)
    } catch (error) {
      console.error('Failed to load tour:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-gray-50)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ fontSize: 'var(--text-lg)', color: 'var(--text-gray-600)' }}>Loading tour details...</p>
      </div>
    )
  }

  if (!tour) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-gray-50)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ fontSize: 'var(--text-lg)', color: 'var(--text-red-600)' }}>Tour not found</p>
      </div>
    )
  }

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
              <Link to="/tours" style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-medium)', color: 'var(--text-gray-600)' }}>
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
              <button style={{
                padding: 'var(--spacing-sm)',
                borderRadius: 'var(--border-radius-lg)',
                backgroundColor: 'var(--primary-color)',
                opacity: 0.1,
                border: 'none',
                cursor: 'pointer'
              }}>
                ❤️
              </button>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: 'var(--bg-gray-300)',
                backgroundImage: 'url(https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40)',
                backgroundSize: 'cover'
              }}></div>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section style={{
        position: 'relative',
        height: '400px',
        width: '100%',
        borderRadius: 'var(--border-radius-2xl)',
        overflow: 'hidden',
        margin: 'var(--spacing-xl) var(--spacing-lg)'
      }}>
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `url(${tour.images[0]})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}>
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to top, rgba(0, 0, 0, 0.7) 0%, rgba(0, 0, 0, 0.2) 50%, transparent 100%)'
          }}></div>
        </div>
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          padding: 'var(--spacing-xl)',
          width: '100%',
          color: 'white'
        }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-sm)', marginBottom: 'var(--spacing-md)' }}>
            {tour.highlights.map(highlight => (
              <span key={highlight} style={{
                padding: 'var(--spacing-xs) var(--spacing-sm)',
                backgroundColor: 'rgba(0, 119, 182, 0.9)',
                fontSize: 'var(--text-xs)',
                fontWeight: 'var(--font-bold)',
                borderRadius: 'var(--border-radius-full)',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>
                {highlight}
              </span>
            ))}
          </div>
          <h1 style={{
            fontSize: 'var(--text-4xl)',
            fontWeight: 'var(--font-black)',
            lineHeight: 1.2,
            marginBottom: 'var(--spacing-md)'
          }}>
            {tour.name}
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-lg)', fontSize: 'var(--text-sm)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-xs)' }}>
              ⭐ <span style={{ fontWeight: 'var(--font-bold)' }}>{tour.rating}</span>
              <span>({tour.reviews} Reviews)</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-xs)' }}>
              📍 <span>{tour.location}</span>
            </div>
          </div>
        </div>
      </section>

      <div style={{ maxWidth: 'var(--container-max)', margin: '0 auto', padding: '0 var(--spacing-lg)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 'var(--spacing-2xl)' }}>

          {/* Main Content */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2xl)' }}>

            {/* Quick Info */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
              gap: 'var(--spacing-md)',
              padding: 'var(--spacing-xl)',
              backgroundColor: 'var(--bg-white)',
              borderRadius: 'var(--border-radius-xl)',
              boxShadow: 'var(--shadow-sm)'
            }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ color: 'var(--primary-color)', fontSize: '24px', marginBottom: 'var(--spacing-sm)' }}>⏰</div>
                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-gray-500)', textTransform: 'uppercase', fontWeight: 'var(--font-bold)' }}>Duration</p>
                <p style={{ fontWeight: 'var(--font-semibold)' }}>{tour.duration}</p>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ color: 'var(--primary-color)', fontSize: '24px', marginBottom: 'var(--spacing-sm)' }}>👥</div>
                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-gray-500)', textTransform: 'uppercase', fontWeight: 'var(--font-bold)' }}>Group Size</p>
                <p style={{ fontWeight: 'var(--font-semibold)' }}>Max 12</p>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ color: 'var(--primary-color)', fontSize: '24px', marginBottom: 'var(--spacing-sm)' }}>🏔️</div>
                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-gray-500)', textTransform: 'uppercase', fontWeight: 'var(--font-bold)' }}>Activity Level</p>
                <p style={{ fontWeight: 'var(--font-semibold)' }}>Moderate</p>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ color: 'var(--primary-color)', fontSize: '24px', marginBottom: 'var(--spacing-sm)' }}>🌐</div>
                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-gray-500)', textTransform: 'uppercase', fontWeight: 'var(--font-bold)' }}>Language</p>
                <p style={{ fontWeight: 'var(--font-semibold)' }}>English, German</p>
              </div>
            </div>

            {/* Overview */}
            <section>
              <h2 style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-bold)', marginBottom: 'var(--spacing-lg)' }}>
                Overview
              </h2>
              <p style={{ fontSize: 'var(--text-lg)', color: 'var(--text-gray-600)', lineHeight: 1.6 }}>
                {tour.description}
              </p>
            </section>

            {/* Itinerary */}
            <section>
              <h2 style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-bold)', marginBottom: 'var(--spacing-lg)' }}>
                Itinerary
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-lg)' }}>
                {tour.itinerary.map((day, index) => (
                  <div key={day.day} style={{ display: 'flex', gap: 'var(--spacing-lg)', position: 'relative' }}>
                    <div style={{
                      position: 'relative',
                      paddingLeft: 'var(--spacing-lg)'
                    }}>
                      <div style={{
                        position: 'absolute',
                        left: '11px',
                        top: '2px',
                        bottom: index < tour.itinerary.length - 1 ? '0' : 'auto',
                        width: '1px',
                        backgroundColor: 'var(--bg-gray-200)'
                      }}></div>
                      <div style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        backgroundColor: 'var(--primary-color)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontSize: 'var(--text-xs)',
                        fontWeight: 'var(--font-bold)'
                      }}>
                        {day.day}
                      </div>
                    </div>
                    <div style={{ flex: 1 }}>
                      <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-bold)', marginBottom: 'var(--spacing-sm)' }}>
                        {day.title}
                      </h3>
                      <p style={{ color: 'var(--text-gray-600)', lineHeight: 1.6 }}>
                        {day.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Inclusions / Exclusions */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-lg)' }}>
              <div style={{
                padding: 'var(--spacing-xl)',
                borderRadius: 'var(--border-radius-xl)',
                backgroundColor: '#f0fdf4',
                border: '1px solid #dcfce7'
              }}>
                <h3 style={{
                  fontWeight: 'var(--font-bold)',
                  color: '#166534',
                  marginBottom: 'var(--spacing-lg)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--spacing-sm)'
                }}>
                  ✅ Included
                </h3>
                <ul style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
                  {tour.inclusions.map((item, index) => (
                    <li key={index} style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--spacing-sm)', color: 'var(--text-gray-700)' }}>
                      <span>•</span>
                      <span style={{ fontSize: 'var(--text-sm)' }}>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div style={{
                padding: 'var(--spacing-xl)',
                borderRadius: 'var(--border-radius-xl)',
                backgroundColor: '#fef2f2',
                border: '1px solid #fecaca'
              }}>
                <h3 style={{
                  fontWeight: 'var(--font-bold)',
                  color: '#dc2626',
                  marginBottom: 'var(--spacing-lg)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--spacing-sm)'
                }}>
                  ❌ Not Included
                </h3>
                <ul style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
                  {tour.exclusions.map((item, index) => (
                    <li key={index} style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--spacing-sm)', color: 'var(--text-gray-700)' }}>
                      <span>•</span>
                      <span style={{ fontSize: 'var(--text-sm)' }}>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Gallery */}
            <section>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-lg)' }}>
                <h2 style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-bold)' }}>Gallery</h2>
                <button style={{
                  color: 'var(--primary-color)',
                  fontWeight: 'var(--font-bold)',
                  fontSize: 'var(--text-sm)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer'
                }}>
                  View all photos
                </button>
              </div>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: 'var(--spacing-sm)'
              }}>
                {tour.images.slice(0, 6).map((image, index) => (
                  <div key={index} style={{
                    aspectRatio: '1',
                    borderRadius: 'var(--border-radius-lg)',
                    overflow: 'hidden',
                    backgroundColor: 'var(--bg-gray-200)'
                  }}>
                    <img
                      src={image}
                      alt={`Tour image ${index + 1}`}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                      }}
                    />
                  </div>
                ))}
              </div>
            </section>

            {/* Reviews */}
            <section style={{ borderTop: '1px solid var(--border-gray-200)', paddingTop: 'var(--spacing-2xl)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-xl)' }}>
                <div>
                  <h2 style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-bold)', marginBottom: 'var(--spacing-sm)' }}>
                    Customer Reviews
                  </h2>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
                    <div style={{ display: 'flex', gap: '2px' }}>
                      {[...Array(5)].map((_, i) => (
                        <span key={i} style={{ color: '#fbbf24', fontSize: '18px' }}>⭐</span>
                      ))}
                    </div>
                    <span style={{ fontWeight: 'var(--font-bold)' }}>{tour.rating} / 5.0</span>
                  </div>
                </div>
                <button style={{
                  padding: 'var(--spacing-md) var(--spacing-xl)',
                  border: '1px solid var(--primary-color)',
                  backgroundColor: 'var(--primary-color)',
                  color: 'white',
                  borderRadius: 'var(--border-radius-lg)',
                  fontWeight: 'var(--font-bold)',
                  cursor: 'pointer'
                }}>
                  Write a Review
                </button>
              </div>

              {/* Sample Review */}
              <div style={{
                padding: 'var(--spacing-xl)',
                backgroundColor: 'var(--bg-white)',
                borderRadius: 'var(--border-radius-xl)',
                boxShadow: 'var(--shadow-sm)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--spacing-lg)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)' }}>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--bg-gray-300)',
                      backgroundImage: 'url(https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40)',
                      backgroundSize: 'cover'
                    }}></div>
                    <div>
                      <p style={{ fontWeight: 'var(--font-bold)' }}>Sarah Jenkins</p>
                      <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-gray-500)' }}>2 weeks ago • Verified Traveler</p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '2px' }}>
                    {[...Array(5)].map((_, i) => (
                      <span key={i} style={{ color: '#fbbf24', fontSize: '14px' }}>⭐</span>
                    ))}
                  </div>
                </div>
                <p style={{ color: 'var(--text-gray-600)', fontStyle: 'italic', lineHeight: 1.6 }}>
                  "Absolutely life-changing experience. Our guide Erik was incredibly knowledgeable and the views from Jungfraujoch were something I'll never forget. Everything was organized perfectly!"
                </p>
              </div>
            </section>
          </div>

          {/* Booking Widget */}
          <aside style={{ position: 'sticky', top: '100px', height: 'fit-content' }}>
            <div style={{
              backgroundColor: 'var(--bg-white)',
              borderRadius: 'var(--border-radius-2xl)',
              padding: 'var(--spacing-xl)',
              boxShadow: 'var(--shadow-xl)',
              border: '1px solid var(--border-gray-200)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-xl)' }}>
                <div>
                  <span style={{ fontSize: 'var(--text-3xl)', fontWeight: 'var(--font-black)', color: 'var(--primary-color)' }}>
                    ${tour.price}
                  </span>
                  <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-gray-500)' }}> / person</span>
                </div>
                <span style={{
                  padding: 'var(--spacing-xs) var(--spacing-sm)',
                  backgroundColor: 'var(--primary-color)',
                  opacity: 0.1,
                  color: 'var(--primary-color)',
                  fontSize: 'var(--text-xs)',
                  fontWeight: 'var(--font-bold)',
                  borderRadius: 'var(--border-radius-full)'
                }}>
                  Last 4 spots
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-lg)', marginBottom: 'var(--spacing-xl)' }}>
                <div style={{
                  padding: 'var(--spacing-md)',
                  border: '1px solid var(--border-gray-300)',
                  borderRadius: 'var(--border-radius-lg)'
                }}>
                  <p style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--font-bold)', color: 'var(--text-gray-500)', textTransform: 'uppercase', marginBottom: 'var(--spacing-xs)' }}>
                    Select Dates
                  </p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <p style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-medium)' }}>{selectedDate}</p>
                    <span style={{ color: 'var(--primary-color)', fontSize: '20px' }}>📅</span>
                  </div>
                </div>

                <div style={{
                  padding: 'var(--spacing-md)',
                  border: '1px solid var(--border-gray-300)',
                  borderRadius: 'var(--border-radius-lg)'
                }}>
                  <p style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--font-bold)', color: 'var(--text-gray-500)', textTransform: 'uppercase', marginBottom: 'var(--spacing-xs)' }}>
                    Travelers
                  </p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <p style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-medium)' }}>{travelers}</p>
                    <span style={{ color: 'var(--primary-color)', fontSize: '20px' }}>👥</span>
                  </div>
                </div>
              </div>

              <button style={{
                width: '100%',
                padding: 'var(--spacing-lg)',
                backgroundColor: 'var(--primary-color)',
                color: 'white',
                border: 'none',
                borderRadius: 'var(--border-radius-xl)',
                fontWeight: 'var(--font-bold)',
                fontSize: 'var(--text-base)',
                cursor: 'pointer',
                boxShadow: 'var(--shadow-lg)',
                marginBottom: 'var(--spacing-lg)'
              }}>
                Reserve Now
              </button>

              <p style={{ textAlign: 'center', fontSize: 'var(--text-xs)', color: 'var(--text-gray-500)', marginBottom: 'var(--spacing-xl)' }}>
                No payment required today • 100% Secure
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)', paddingTop: 'var(--spacing-xl)', borderTop: '1px solid var(--border-gray-200)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
                  <span style={{ color: 'var(--primary-color)' }}>✓</span>
                  <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-gray-600)' }}>Free cancellation up to 30 days before</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
                  <span style={{ color: 'var(--primary-color)' }}>🛡️</span>
                  <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-gray-600)' }}>Travel protection included</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
                  <span style={{ color: 'var(--primary-color)' }}>👍</span>
                  <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-gray-600)' }}>Best price guaranteed</span>
                </div>
              </div>
            </div>

            <div style={{
              marginTop: 'var(--spacing-lg)',
              padding: 'var(--spacing-xl)',
              backgroundColor: 'var(--bg-slate-900)',
              borderRadius: 'var(--border-radius-2xl)',
              color: 'white'
            }}>
              <h4 style={{ fontWeight: 'var(--font-bold)', marginBottom: 'var(--spacing-sm)', display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
                🎧 Need help?
              </h4>
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-slate-400)', marginBottom: 'var(--spacing-lg)' }}>
                Chat with our destination experts available 24/7 to help you plan your trip.
              </p>
              <button style={{
                width: '100%',
                padding: 'var(--spacing-sm) var(--spacing-md)',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                color: 'white',
                border: 'none',
                borderRadius: 'var(--border-radius-lg)',
                fontSize: 'var(--text-sm)',
                fontWeight: 'var(--font-bold)',
                cursor: 'pointer'
              }}>
                Contact Support
              </button>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
