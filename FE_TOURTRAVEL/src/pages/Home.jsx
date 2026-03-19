import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getTours } from '../api/tourService'

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
        height: '600px',
        width: '100%',
        backgroundImage: 'url(https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1200)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        alignItems: 'center'
      }}>
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to right, rgba(0, 0, 0, 0.7) 0%, rgba(0, 0, 0, 0.3) 100%)'
        }}></div>
        <div style={{ maxWidth: 'var(--container-max)', margin: '0 auto', padding: '0 var(--spacing-lg)', position: 'relative', zIndex: 10 }}>
          <div style={{ maxWidth: '600px' }}>
            <h1 style={{
              fontSize: 'var(--text-5xl)',
              fontWeight: 'var(--font-black)',
              color: 'white',
              lineHeight: 1.2,
              marginBottom: 'var(--spacing-lg)'
            }}>
              Discover Your Next Adventure
            </h1>
            <p style={{
              fontSize: 'var(--text-xl)',
              color: 'rgba(255, 255, 255, 0.9)',
              marginBottom: 'var(--spacing-2xl)',
              lineHeight: 1.6
            }}>
              Explore breathtaking destinations around the world with expertly curated tours and unforgettable experiences.
            </p>

            {/* Search Form */}
            <form onSubmit={handleSearch} style={{
              backgroundColor: 'var(--bg-white)',
              borderRadius: 'var(--border-radius-2xl)',
              padding: 'var(--spacing-xl)',
              boxShadow: 'var(--shadow-2xl)',
              display: 'grid',
              gridTemplateColumns: '1fr 1fr 1fr auto',
              gap: 'var(--spacing-md)',
              alignItems: 'end'
            }}>
              <div>
                <label style={{
                  display: 'block',
                  fontSize: 'var(--text-sm)',
                  fontWeight: 'var(--font-medium)',
                  color: 'var(--text-gray-700)',
                  marginBottom: 'var(--spacing-xs)'
                }}>
                  Destination
                </label>
                <input
                  type="text"
                  placeholder="Where to?"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  style={{
                    width: '100%',
                    padding: 'var(--spacing-md)',
                    border: '1px solid var(--border-gray-300)',
                    borderRadius: 'var(--border-radius-lg)',
                    fontSize: 'var(--text-base)'
                  }}
                />
              </div>

              <div>
                <label style={{
                  display: 'block',
                  fontSize: 'var(--text-sm)',
                  fontWeight: 'var(--font-medium)',
                  color: 'var(--text-gray-700)',
                  marginBottom: 'var(--spacing-xs)'
                }}>
                  Duration
                </label>
                <select
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  style={{
                    width: '100%',
                    padding: 'var(--spacing-md)',
                    border: '1px solid var(--border-gray-300)',
                    borderRadius: 'var(--border-radius-lg)',
                    fontSize: 'var(--text-base)',
                    backgroundColor: 'var(--bg-white)'
                  }}
                >
                  <option value="">Any duration</option>
                  <option value="1-3">1-3 days</option>
                  <option value="4-7">4-7 days</option>
                  <option value="8-14">1-2 weeks</option>
                  <option value="15+">2+ weeks</option>
                </select>
              </div>

              <div>
                <label style={{
                  display: 'block',
                  fontSize: 'var(--text-sm)',
                  fontWeight: 'var(--font-medium)',
                  color: 'var(--text-gray-700)',
                  marginBottom: 'var(--spacing-xs)'
                }}>
                  Search tours
                </label>
                <input
                  type="text"
                  placeholder="Tour name or keyword"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{
                    width: '100%',
                    padding: 'var(--spacing-md)',
                    border: '1px solid var(--border-gray-300)',
                    borderRadius: 'var(--border-radius-lg)',
                    fontSize: 'var(--text-base)'
                  }}
                />
              </div>

              <button
                type="submit"
                style={{
                  padding: 'var(--spacing-md) var(--spacing-xl)',
                  backgroundColor: 'var(--primary-color)',
                  color: 'white',
                  border: 'none',
                  borderRadius: 'var(--border-radius-lg)',
                  fontWeight: 'var(--font-bold)',
                  cursor: 'pointer',
                  boxShadow: 'var(--shadow-lg)'
                }}
              >
                Search
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Featured Tours */}
      <section style={{ padding: 'var(--spacing-3xl) 0', backgroundColor: 'var(--bg-white)' }}>
        <div style={{ maxWidth: 'var(--container-max)', margin: '0 auto', padding: '0 var(--spacing-lg)' }}>
          <div style={{ textAlign: 'center', marginBottom: 'var(--spacing-2xl)' }}>
            <h2 style={{
              fontSize: 'var(--text-4xl)',
              fontWeight: 'var(--font-black)',
              color: 'var(--text-gray-900)',
              marginBottom: 'var(--spacing-lg)'
            }}>
              Featured Tours
            </h2>
            <p style={{
              fontSize: 'var(--text-lg)',
              color: 'var(--text-gray-600)',
              maxWidth: '600px',
              margin: '0 auto'
            }}>
              Handpicked destinations that offer unforgettable experiences and memories that last a lifetime.
            </p>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: 'var(--spacing-2xl)' }}>
              <p style={{ fontSize: 'var(--text-lg)', color: 'var(--text-gray-600)' }}>Loading tours...</p>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
              gap: 'var(--spacing-xl)'
            }}>
              {tours.map(tour => (
                <Link key={tour.id} to={`/tours/${tour.id}`} style={{ textDecoration: 'none' }}>
                  <div style={{
                    backgroundColor: 'var(--bg-white)',
                    borderRadius: 'var(--border-radius-2xl)',
                    overflow: 'hidden',
                    boxShadow: 'var(--shadow-lg)',
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)'
                    e.currentTarget.style.boxShadow = 'var(--shadow-2xl)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)'
                    e.currentTarget.style.boxShadow = 'var(--shadow-lg)'
                  }}
                  >
                    <div style={{
                      height: '240px',
                      backgroundColor: 'var(--bg-gray-200)',
                      backgroundImage: `url(${tour.image || 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400'})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      position: 'relative'
                    }}>
                      <div style={{
                        position: 'absolute',
                        top: 'var(--spacing-md)',
                        left: 'var(--spacing-md)',
                        padding: 'var(--spacing-xs) var(--spacing-sm)',
                        backgroundColor: 'rgba(0, 119, 182, 0.9)',
                        color: 'white',
                        fontSize: 'var(--text-xs)',
                        fontWeight: 'var(--font-bold)',
                        borderRadius: 'var(--border-radius-full)',
                        textTransform: 'uppercase'
                      }}>
                        Featured
                      </div>
                    </div>
                    <div style={{ padding: 'var(--spacing-xl)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)', marginBottom: 'var(--spacing-sm)' }}>
                        <div style={{ display: 'flex', gap: '2px' }}>
                          {[...Array(5)].map((_, i) => (
                            <span key={i} style={{ color: '#fbbf24', fontSize: '14px' }}>⭐</span>
                          ))}
                        </div>
                        <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-gray-500)' }}>
                          ({tour.reviews || 0} reviews)
                        </span>
                      </div>
                      <h3 style={{
                        fontSize: 'var(--text-xl)',
                        fontWeight: 'var(--font-bold)',
                        color: 'var(--text-gray-900)',
                        marginBottom: 'var(--spacing-sm)'
                      }}>
                        {tour.name}
                      </h3>
                      <p style={{
                        fontSize: 'var(--text-sm)',
                        color: 'var(--text-gray-600)',
                        marginBottom: 'var(--spacing-lg)',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                      }}>
                        {tour.description}
                      </p>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div>
                          <span style={{
                            fontSize: 'var(--text-2xl)',
                            fontWeight: 'var(--font-black)',
                            color: 'var(--primary-color)'
                          }}>
                            ${tour.price}
                          </span>
                          <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-gray-500)' }}> / person</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-xs)' }}>
                          <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-gray-500)' }}>📍</span>
                          <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-gray-600)' }}>{tour.destination}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          <div style={{ textAlign: 'center', marginTop: 'var(--spacing-2xl)' }}>
            <Link to="/tours" style={{
              display: 'inline-block',
              padding: 'var(--spacing-lg) var(--spacing-2xl)',
              backgroundColor: 'var(--primary-color)',
              color: 'white',
              textDecoration: 'none',
              borderRadius: 'var(--border-radius-xl)',
              fontWeight: 'var(--font-bold)',
              fontSize: 'var(--text-base)',
              boxShadow: 'var(--shadow-lg)',
              transition: 'background-color 0.3s ease'
            }}>
              View All Tours
            </Link>
          </div>
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