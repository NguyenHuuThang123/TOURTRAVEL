import { useState } from 'react'
import { Link } from 'react-router-dom'

export default function Checkout() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    billingAddress: '',
    city: '',
    zipCode: '',
    country: ''
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Handle checkout submission
    console.log('Checkout data:', formData)
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

      {/* Breadcrumb */}
      <div style={{
        backgroundColor: 'var(--bg-white)',
        borderBottom: '1px solid var(--border-gray-200)',
        padding: 'var(--spacing-md) 0'
      }}>
        <div style={{ maxWidth: 'var(--container-max)', margin: '0 auto', padding: '0 var(--spacing-lg)' }}>
          <nav style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)', fontSize: 'var(--text-sm)' }}>
            <Link to="/" style={{ color: 'var(--text-gray-500)', textDecoration: 'none' }}>Home</Link>
            <span style={{ color: 'var(--text-gray-400)' }}>/</span>
            <Link to="/tours" style={{ color: 'var(--text-gray-500)', textDecoration: 'none' }}>Tours</Link>
            <span style={{ color: 'var(--text-gray-400)' }}>/</span>
            <Link to="/tours/1" style={{ color: 'var(--text-gray-500)', textDecoration: 'none' }}>Swiss Alps Adventure</Link>
            <span style={{ color: 'var(--text-gray-400)' }}>/</span>
            <span style={{ color: 'var(--text-gray-900)', fontWeight: 'var(--font-medium)' }}>Checkout</span>
          </nav>
        </div>
      </div>

      <div style={{ maxWidth: 'var(--container-max)', margin: '0 auto', padding: 'var(--spacing-2xl) var(--spacing-lg)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: 'var(--spacing-2xl)' }}>

          {/* Checkout Form */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-xl)' }}>

            {/* Contact Information */}
            <div style={{
              backgroundColor: 'var(--bg-white)',
              borderRadius: 'var(--border-radius-xl)',
              padding: 'var(--spacing-xl)',
              boxShadow: 'var(--shadow-sm)'
            }}>
              <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 'var(--font-bold)', marginBottom: 'var(--spacing-lg)' }}>
                Contact Information
              </h2>
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-lg)' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-md)' }}>
                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: 'var(--text-sm)',
                      fontWeight: 'var(--font-medium)',
                      color: 'var(--text-gray-700)',
                      marginBottom: 'var(--spacing-xs)'
                    }}>
                      First Name
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      required
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
                      Last Name
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      required
                      style={{
                        width: '100%',
                        padding: 'var(--spacing-md)',
                        border: '1px solid var(--border-gray-300)',
                        borderRadius: 'var(--border-radius-lg)',
                        fontSize: 'var(--text-base)'
                      }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{
                    display: 'block',
                    fontSize: 'var(--text-sm)',
                    fontWeight: 'var(--font-medium)',
                    color: 'var(--text-gray-700)',
                    marginBottom: 'var(--spacing-xs)'
                  }}>
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
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
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    style={{
                      width: '100%',
                      padding: 'var(--spacing-md)',
                      border: '1px solid var(--border-gray-300)',
                      borderRadius: 'var(--border-radius-lg)',
                      fontSize: 'var(--text-base)'
                    }}
                  />
                </div>
              </form>
            </div>

            {/* Payment Method */}
            <div style={{
              backgroundColor: 'var(--bg-white)',
              borderRadius: 'var(--border-radius-xl)',
              padding: 'var(--spacing-xl)',
              boxShadow: 'var(--shadow-sm)'
            }}>
              <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 'var(--font-bold)', marginBottom: 'var(--spacing-lg)' }}>
                Payment Method
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-lg)' }}>
                <div style={{
                  padding: 'var(--spacing-lg)',
                  border: '2px solid var(--primary-color)',
                  borderRadius: 'var(--border-radius-lg)',
                  backgroundColor: 'rgba(0, 119, 182, 0.05)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--spacing-md)'
                }}>
                  <div style={{
                    width: '40px',
                    height: '24px',
                    backgroundColor: '#0066cc',
                    borderRadius: 'var(--border-radius-sm)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: 'var(--text-xs)',
                    fontWeight: 'var(--font-bold)'
                  }}>
                    VISA
                  </div>
                  <div>
                    <p style={{ fontWeight: 'var(--font-medium)' }}>Credit/Debit Card</p>
                    <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-gray-500)' }}>Pay securely with your card</p>
                  </div>
                  <div style={{ marginLeft: 'auto', color: 'var(--primary-color)', fontSize: '20px' }}>✓</div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: 'var(--text-sm)',
                      fontWeight: 'var(--font-medium)',
                      color: 'var(--text-gray-700)',
                      marginBottom: 'var(--spacing-xs)'
                    }}>
                      Card Number
                    </label>
                    <input
                      type="text"
                      name="cardNumber"
                      value={formData.cardNumber}
                      onChange={handleInputChange}
                      placeholder="1234 5678 9012 3456"
                      required
                      style={{
                        width: '100%',
                        padding: 'var(--spacing-md)',
                        border: '1px solid var(--border-gray-300)',
                        borderRadius: 'var(--border-radius-lg)',
                        fontSize: 'var(--text-base)'
                      }}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-md)' }}>
                    <div>
                      <label style={{
                        display: 'block',
                        fontSize: 'var(--text-sm)',
                        fontWeight: 'var(--font-medium)',
                        color: 'var(--text-gray-700)',
                        marginBottom: 'var(--spacing-xs)'
                      }}>
                        Expiry Date
                      </label>
                      <input
                        type="text"
                        name="expiryDate"
                        value={formData.expiryDate}
                        onChange={handleInputChange}
                        placeholder="MM/YY"
                        required
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
                        CVV
                      </label>
                      <input
                        type="text"
                        name="cvv"
                        value={formData.cvv}
                        onChange={handleInputChange}
                        placeholder="123"
                        required
                        style={{
                          width: '100%',
                          padding: 'var(--spacing-md)',
                          border: '1px solid var(--border-gray-300)',
                          borderRadius: 'var(--border-radius-lg)',
                          fontSize: 'var(--text-base)'
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Billing Address */}
            <div style={{
              backgroundColor: 'var(--bg-white)',
              borderRadius: 'var(--border-radius-xl)',
              padding: 'var(--spacing-xl)',
              boxShadow: 'var(--shadow-sm)'
            }}>
              <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 'var(--font-bold)', marginBottom: 'var(--spacing-lg)' }}>
                Billing Address
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-lg)' }}>
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: 'var(--text-sm)',
                    fontWeight: 'var(--font-medium)',
                    color: 'var(--text-gray-700)',
                    marginBottom: 'var(--spacing-xs)'
                  }}>
                    Street Address
                  </label>
                  <input
                    type="text"
                    name="billingAddress"
                    value={formData.billingAddress}
                    onChange={handleInputChange}
                    required
                    style={{
                      width: '100%',
                      padding: 'var(--spacing-md)',
                      border: '1px solid var(--border-gray-300)',
                      borderRadius: 'var(--border-radius-lg)',
                      fontSize: 'var(--text-base)'
                    }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-md)' }}>
                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: 'var(--text-sm)',
                      fontWeight: 'var(--font-medium)',
                      color: 'var(--text-gray-700)',
                      marginBottom: 'var(--spacing-xs)'
                    }}>
                      City
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      required
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
                      ZIP Code
                    </label>
                    <input
                      type="text"
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleInputChange}
                      required
                      style={{
                        width: '100%',
                        padding: 'var(--spacing-md)',
                        border: '1px solid var(--border-gray-300)',
                        borderRadius: 'var(--border-radius-lg)',
                        fontSize: 'var(--text-base)'
                      }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{
                    display: 'block',
                    fontSize: 'var(--text-sm)',
                    fontWeight: 'var(--font-medium)',
                    color: 'var(--text-gray-700)',
                    marginBottom: 'var(--spacing-xs)'
                  }}>
                    Country
                  </label>
                  <select
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    required
                    style={{
                      width: '100%',
                      padding: 'var(--spacing-md)',
                      border: '1px solid var(--border-gray-300)',
                      borderRadius: 'var(--border-radius-lg)',
                      fontSize: 'var(--text-base)',
                      backgroundColor: 'var(--bg-white)'
                    }}
                  >
                    <option value="">Select Country</option>
                    <option value="US">United States</option>
                    <option value="CA">Canada</option>
                    <option value="UK">United Kingdom</option>
                    <option value="DE">Germany</option>
                    <option value="FR">France</option>
                    <option value="CH">Switzerland</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <aside style={{ position: 'sticky', top: '100px', height: 'fit-content' }}>
            <div style={{
              backgroundColor: 'var(--bg-white)',
              borderRadius: 'var(--border-radius-2xl)',
              padding: 'var(--spacing-xl)',
              boxShadow: 'var(--shadow-xl)',
              border: '1px solid var(--border-gray-200)'
            }}>
              <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-bold)', marginBottom: 'var(--spacing-xl)' }}>
                Order Summary
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-lg)' }}>
                <div style={{ display: 'flex', gap: 'var(--spacing-md)' }}>
                  <div style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: 'var(--border-radius-lg)',
                    backgroundColor: 'var(--bg-gray-200)',
                    backgroundImage: 'url(https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=60)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }}></div>
                  <div style={{ flex: 1 }}>
                    <h4 style={{ fontWeight: 'var(--font-bold)', fontSize: 'var(--text-sm)', marginBottom: 'var(--spacing-xs)' }}>
                      Swiss Alps Adventure
                    </h4>
                    <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-gray-500)', marginBottom: 'var(--spacing-xs)' }}>
                      Aug 12 - Aug 19, 2024
                    </p>
                    <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-gray-500)' }}>
                      2 Adults
                    </p>
                  </div>
                </div>

                <div style={{ borderTop: '1px solid var(--border-gray-200)', paddingTop: 'var(--spacing-lg)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--spacing-sm)' }}>
                    <span style={{ color: 'var(--text-gray-600)' }}>Subtotal</span>
                    <span style={{ fontWeight: 'var(--font-medium)' }}>$6,998</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--spacing-sm)' }}>
                    <span style={{ color: 'var(--text-gray-600)' }}>Service Fee</span>
                    <span style={{ fontWeight: 'var(--font-medium)' }}>$150</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--spacing-sm)' }}>
                    <span style={{ color: 'var(--text-gray-600)' }}>Taxes</span>
                    <span style={{ fontWeight: 'var(--font-medium)' }}>$699</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--text-lg)', fontWeight: 'var(--font-bold)', marginTop: 'var(--spacing-md)', paddingTop: 'var(--spacing-md)', borderTop: '1px solid var(--border-gray-200)' }}>
                    <span>Total</span>
                    <span>$7,847</span>
                  </div>
                </div>

                <button
                  type="submit"
                  onClick={handleSubmit}
                  style={{
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
                    marginTop: 'var(--spacing-lg)'
                  }}
                >
                  Complete Booking
                </button>

                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)', fontSize: 'var(--text-xs)', color: 'var(--text-gray-500)' }}>
                  <span>🔒</span>
                  <span>Secure payment powered by Stripe</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)', paddingTop: 'var(--spacing-lg)', borderTop: '1px solid var(--border-gray-200)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
                    <span style={{ color: 'var(--primary-color)' }}>✓</span>
                    <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-gray-600)' }}>Free cancellation up to 30 days</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
                    <span style={{ color: 'var(--primary-color)' }}>🛡️</span>
                    <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-gray-600)' }}>Travel protection included</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
                    <span style={{ color: 'var(--primary-color)' }}>📧</span>
                    <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-gray-600)' }}>Confirmation sent instantly</span>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}