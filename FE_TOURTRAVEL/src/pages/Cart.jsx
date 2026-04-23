import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createBooking } from '../api/tourService'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { formatCurrency } from '../utils/currency'

const demoTourPrices = {
  '1': 31200000,
  '2': 46800000
}

export default function Cart() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    tourId: '',
    quantity: 1
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const selectedTourPrice = demoTourPrices[formData.tourId] || 0
  const totalAmount = selectedTourPrice * formData.quantity

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      await createBooking(formData)
      setSuccess(true)
      setTimeout(() => {
        navigate('/')
      }, 2000)
    } catch (error) {
      alert('Booking failed! Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-gray-50)' }}>
        <Header />
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '70vh',
          textAlign: 'center',
          padding: 'var(--spacing-xl)'
        }}>
          <div style={{
            fontSize: '5rem',
            marginBottom: 'var(--spacing-lg)',
            color: 'var(--secondary-color)'
          }}>
            ✅
          </div>
          <h1 style={{
            fontSize: 'var(--font-size-4xl)',
            fontWeight: 'bold',
            marginBottom: 'var(--spacing-md)',
            color: 'var(--text-primary)'
          }}>
            Booking Confirmed!
          </h1>
          <p style={{
            fontSize: 'var(--font-size-lg)',
            color: 'var(--text-secondary)',
            marginBottom: 'var(--spacing-xl)',
            maxWidth: '500px'
          }}>
            Thank you for choosing TourTravel! Your booking has been confirmed and you will receive a confirmation email shortly.
          </p>
          <button
            className="btn btn-primary"
            onClick={() => navigate('/')}
            style={{
              padding: 'var(--spacing-md) var(--spacing-xl)',
              fontSize: 'var(--font-size-lg)'
            }}
          >
            Back to Home
          </button>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-gray-50)' }}>
      <Header />

      <section style={{ padding: 'var(--spacing-2xl) 0' }}>
        <div className="container">
          <div style={{ maxWidth: '600px', margin: '0 auto' }}>
            <div style={{
              background: 'var(--bg-white)',
              padding: 'var(--spacing-2xl)',
              borderRadius: 'var(--radius-xl)',
              boxShadow: 'var(--shadow-xl)'
            }}>
              <div style={{ textAlign: 'center', marginBottom: 'var(--spacing-2xl)' }}>
                <h1 style={{
                  fontSize: 'var(--font-size-4xl)',
                  fontWeight: 'bold',
                  marginBottom: 'var(--spacing-md)',
                  color: 'var(--text-primary)'
                }}>
                  Complete Your Booking
                </h1>
                <p style={{
                  fontSize: 'var(--font-size-lg)',
                  color: 'var(--text-secondary)'
                }}>
                  Fill in your details to secure your tour reservation
                </p>
              </div>

              <form onSubmit={handleSubmit} style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--spacing-lg)'
              }}>
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: 'var(--font-size-sm)',
                    fontWeight: '500',
                    color: 'var(--text-primary)',
                    marginBottom: 'var(--spacing-sm)'
                  }}>
                    Full Name *
                  </label>
                  <input
                    type="text"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required
                    style={{
                      width: '100%',
                      padding: 'var(--spacing-md)',
                      border: '2px solid var(--bg-gray-200)',
                      borderRadius: 'var(--radius-md)',
                      fontSize: 'var(--font-size-base)',
                      outline: 'none',
                      transition: 'var(--transition-fast)'
                    }}
                  />
                </div>

                <div>
                  <label style={{
                    display: 'block',
                    fontSize: 'var(--font-size-sm)',
                    fontWeight: '500',
                    color: 'var(--text-primary)',
                    marginBottom: 'var(--spacing-sm)'
                  }}>
                    Email Address *
                  </label>
                  <input
                    type="email"
                    placeholder="Enter your email address"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    required
                    style={{
                      width: '100%',
                      padding: 'var(--spacing-md)',
                      border: '2px solid var(--bg-gray-200)',
                      borderRadius: 'var(--radius-md)',
                      fontSize: 'var(--font-size-base)',
                      outline: 'none',
                      transition: 'var(--transition-fast)'
                    }}
                  />
                </div>

                <div>
                  <label style={{
                    display: 'block',
                    fontSize: 'var(--font-size-sm)',
                    fontWeight: '500',
                    color: 'var(--text-primary)',
                    marginBottom: 'var(--spacing-sm)'
                  }}>
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    placeholder="Enter your phone number"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    required
                    style={{
                      width: '100%',
                      padding: 'var(--spacing-md)',
                      border: '2px solid var(--bg-gray-200)',
                      borderRadius: 'var(--radius-md)',
                      fontSize: 'var(--font-size-base)',
                      outline: 'none',
                      transition: 'var(--transition-fast)'
                    }}
                  />
                </div>

                <div>
                  <label style={{
                    display: 'block',
                    fontSize: 'var(--font-size-sm)',
                    fontWeight: '500',
                    color: 'var(--text-primary)',
                    marginBottom: 'var(--spacing-sm)'
                  }}>
                    Tour Selection
                  </label>
                  <select
                    value={formData.tourId}
                    onChange={(e) => setFormData({...formData, tourId: e.target.value})}
                    required
                    style={{
                      width: '100%',
                      padding: 'var(--spacing-md)',
                      border: '2px solid var(--bg-gray-200)',
                      borderRadius: 'var(--radius-md)',
                      fontSize: 'var(--font-size-base)',
                      outline: 'none',
                      background: 'var(--bg-white)',
                      cursor: 'pointer'
                    }}
                  >
                    <option value="">Select a tour</option>
                    <option value="1">Paris City Tour - {formatCurrency(demoTourPrices['1'])}</option>
                    <option value="2">Tokyo Adventure - {formatCurrency(demoTourPrices['2'])}</option>
                  </select>
                </div>

                <div>
                  <label style={{
                    display: 'block',
                    fontSize: 'var(--font-size-sm)',
                    fontWeight: '500',
                    color: 'var(--text-primary)',
                    marginBottom: 'var(--spacing-sm)'
                  }}>
                    Number of Travelers
                  </label>
                  <select
                    value={formData.quantity}
                    onChange={(e) => setFormData({...formData, quantity: parseInt(e.target.value)})}
                    style={{
                      width: '100%',
                      padding: 'var(--spacing-md)',
                      border: '2px solid var(--bg-gray-200)',
                      borderRadius: 'var(--radius-md)',
                      fontSize: 'var(--font-size-base)',
                      outline: 'none',
                      background: 'var(--bg-white)',
                      cursor: 'pointer'
                    }}
                  >
                    {[1,2,3,4,5,6].map(num => (
                      <option key={num} value={num}>
                        {num} {num === 1 ? 'Traveler' : 'Travelers'}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Booking Summary */}
                <div style={{
                  background: 'var(--bg-gray-50)',
                  padding: 'var(--spacing-lg)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--bg-gray-200)'
                }}>
                  <h3 style={{
                    fontSize: 'var(--font-size-lg)',
                    fontWeight: '600',
                    marginBottom: 'var(--spacing-md)',
                    color: 'var(--text-primary)'
                  }}>
                    Booking Summary
                  </h3>

                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: 'var(--spacing-sm)',
                    fontSize: 'var(--font-size-base)',
                    color: 'var(--text-secondary)'
                  }}>
                    <span>Tour Price</span>
                    <span>{formatCurrency(selectedTourPrice)}</span>
                  </div>

                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: 'var(--spacing-sm)',
                    fontSize: 'var(--font-size-base)',
                    color: 'var(--text-secondary)'
                  }}>
                    <span>Travelers</span>
                    <span>× {formData.quantity}</span>
                  </div>

                  <hr style={{
                    border: 'none',
                    borderTop: '1px solid var(--bg-gray-200)',
                    margin: 'var(--spacing-md) 0'
                  }} />

                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: 'var(--font-size-lg)',
                    fontWeight: 'bold',
                    color: 'var(--text-primary)'
                  }}>
                    <span>Total Amount</span>
                    <span>{formatCurrency(totalAmount)}</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-primary"
                  style={{
                    padding: 'var(--spacing-lg)',
                    fontSize: 'var(--font-size-lg)',
                    fontWeight: '600',
                    opacity: loading ? 0.7 : 1,
                    cursor: loading ? 'not-allowed' : 'pointer'
                  }}
                >
                  {loading ? 'Processing...' : 'Complete Booking'}
                </button>
              </form>

              <p style={{
                textAlign: 'center',
                fontSize: 'var(--font-size-sm)',
                color: 'var(--text-light)',
                marginTop: 'var(--spacing-lg)'
              }}>
                By completing this booking, you agree to our Terms of Service and Privacy Policy.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
