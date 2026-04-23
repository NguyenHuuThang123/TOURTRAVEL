import { useMemo, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { createBooking, createVnpayPayment } from '../api/tourService'
import { useAuth } from '../context/AuthContext'
import { formatCurrency } from '../utils/currency'

const paymentMethods = [
  {
    id: 'card',
    label: 'The tin dung',
    description: 'Thanh toan nhanh bang Visa, Mastercard hoac JCB.'
  },
  {
    id: 'bank_transfer',
    label: 'Chuyen khoan ngan hang',
    description: 'Nhan thong tin tai khoan va xac nhan thanh toan thu cong.'
  },
  {
    id: 'vnpay',
    label: 'VNPAY',
    description: 'Chuyen huong den cong thanh toan VNPAY de thanh toan online.'
  }
]

export default function Payment() {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, token } = useAuth()
  const [selectedMethod, setSelectedMethod] = useState('card')
  const [paymentData, setPaymentData] = useState({
    cardName: '',
    cardNumber: '',
    expiry: '',
    cvv: '',
    bankReference: ''
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const tour = location.state?.tour
  const quantity = location.state?.quantity || 1
  const traveler = location.state?.traveler
  const pricing = location.state?.pricing

  const pricingSummary = useMemo(() => {
    if (pricing) return pricing
    if (!tour) {
      return {
        subtotal: 0,
        processingFee: 0,
        insuranceFee: 0,
        earlyBirdDiscount: 0,
        total: 0
      }
    }

    const subtotal = tour.price * quantity
    const processingFee = subtotal * 0.1
    const earlyBirdDiscount = subtotal * 0.06
    return {
      subtotal,
      processingFee,
      insuranceFee: 0,
      earlyBirdDiscount,
      total: subtotal + processingFee - earlyBirdDiscount
    }
  }, [pricing, quantity, tour])

  if (!tour || !traveler) {
    return (
      <div className="checkout-shell">
        <Header />
        <main style={{ maxWidth: '900px', margin: '0 auto', padding: '40px 20px' }}>
          <p>Thong tin thanh toan chua day du.</p>
          <Link to="/tours">Quay lai danh sach tour</Link>
        </main>
        <Footer />
      </div>
    )
  }

  const handleConfirmPayment = async (event) => {
    event.preventDefault()
    if (user?.role === 'guide') {
      setError('Huong dan vien khong the dat tour.')
      return
    }

    try {
      setLoading(true)
      setError('')
      setMessage('')

      if (selectedMethod === 'vnpay') {
        const payment = await createVnpayPayment(
          {
            tour_id: tour.id,
            user_name: `${traveler.firstName} ${traveler.lastName}`.trim(),
            user_email: traveler.email,
            user_phone: `${traveler.phoneCode} ${traveler.phone}`.trim(),
            quantity,
            insurance_selected: Boolean(traveler.insurance),
            payment_method: 'vnpay'
          },
          token
        )
        window.location.href = payment.payment_url
        return
      }

      const booking = await createBooking(
        {
          tour_id: tour.id,
          user_name: `${traveler.firstName} ${traveler.lastName}`.trim(),
          user_email: traveler.email,
          user_phone: `${traveler.phoneCode} ${traveler.phone}`.trim(),
          quantity,
          insurance_selected: Boolean(traveler.insurance),
          payment_method: selectedMethod
        },
        token
      )

      setMessage(`Thanh toan thanh cong. Ma don: ${booking.id}`)
      setTimeout(() => {
        if (user?.role === 'admin') {
          navigate('/admin')
          return
        }

        navigate(user ? '/account' : '/tours')
      }, 1400)
    } catch (err) {
      setError(err.response?.data?.detail || 'Khong the xu ly thanh toan luc nay.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="checkout-shell">
      <Header />

      <main className="container checkout-main">
        <nav className="checkout-breadcrumbs">
          <Link to="/">Home</Link>
          <span>›</span>
          <Link to="/tours">Tours</Link>
          <span>›</span>
          <Link to="/checkout" state={{ tour, quantity, traveler }}>Checkout</Link>
          <span>›</span>
          <span>Payment</span>
        </nav>

        <div className="checkout-layout">
          <section className="checkout-form-column">
            <div className="checkout-step-card">
              <div className="checkout-step-header">
                <div>
                  <p className="checkout-step-eyebrow">Bước hiện tại</p>
                  <h1>Phuong thuc thanh toan</h1>
                </div>
                <div className="checkout-step-progress">
                  <strong>Bước 2 trên 3</strong>
                  <span>67% Hoàn thành</span>
                </div>
              </div>

              <div className="checkout-step-tabs">
                <div>1 - Thông tin</div>
                <div className="active">2 - Thanh toán</div>
                <div>3 - Xác nhận</div>
              </div>
            </div>

            <form onSubmit={handleConfirmPayment} className="checkout-form-stack">
              <section className="checkout-panel">
                <div className="checkout-panel-head">
                  <h2>Chon cach thanh toan</h2>
                  <span>Thanh toan an toan</span>
                </div>

                <div className="payment-method-list">
                  {paymentMethods.map((method) => (
                    <label
                      key={method.id}
                      className={`payment-method-card ${selectedMethod === method.id ? 'active' : ''}`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={method.id}
                        checked={selectedMethod === method.id}
                        onChange={(event) => setSelectedMethod(event.target.value)}
                      />
                      <div>
                        <strong>{method.label}</strong>
                        <span>{method.description}</span>
                      </div>
                    </label>
                  ))}
                </div>
              </section>

              <section className="checkout-panel">
                <div className="checkout-panel-head">
                  <h2>Thong tin thanh toan</h2>
                  <span>{paymentMethods.find((item) => item.id === selectedMethod)?.label}</span>
                </div>

                {selectedMethod === 'card' && (
                  <div className="checkout-grid">
                    <label className="checkout-field checkout-span-2">
                      <span>Ten chu the</span>
                      <input
                        required
                        value={paymentData.cardName}
                        onChange={(event) => setPaymentData((prev) => ({ ...prev, cardName: event.target.value }))}
                        placeholder="NGUYEN VAN A"
                      />
                    </label>
                    <label className="checkout-field checkout-span-2">
                      <span>So the</span>
                      <input
                        required
                        value={paymentData.cardNumber}
                        onChange={(event) => setPaymentData((prev) => ({ ...prev, cardNumber: event.target.value }))}
                        placeholder="4111 1111 1111 1111"
                      />
                    </label>
                    <label className="checkout-field">
                      <span>Ngay het han</span>
                      <input
                        required
                        value={paymentData.expiry}
                        onChange={(event) => setPaymentData((prev) => ({ ...prev, expiry: event.target.value }))}
                        placeholder="MM/YY"
                      />
                    </label>
                    <label className="checkout-field">
                      <span>CVV</span>
                      <input
                        required
                        value={paymentData.cvv}
                        onChange={(event) => setPaymentData((prev) => ({ ...prev, cvv: event.target.value }))}
                        placeholder="123"
                      />
                    </label>
                  </div>
                )}

                {selectedMethod === 'bank_transfer' && (
                  <div className="payment-helper-box">
                    <strong>Thong tin chuyen khoan</strong>
                    <span>Ngân hàng: Vietcombank</span>
                    <span>Số tài khoản: 0123 456 789</span>
                    <span>Chủ tài khoản: TOURTRAVEL CO</span>
                    <label className="checkout-field" style={{ marginTop: '12px' }}>
                      <span>Ma giao dich / noi dung chuyen khoan</span>
                      <input
                        required
                        value={paymentData.bankReference}
                        onChange={(event) => setPaymentData((prev) => ({ ...prev, bankReference: event.target.value }))}
                        placeholder="VD: TOUR123456"
                      />
                    </label>
                  </div>
                )}

                {selectedMethod === 'vnpay' && (
                  <div className="payment-helper-box">
                    <strong>Thanh toan qua VNPAY</strong>
                    <span>Ban se duoc chuyen sang cong thanh toan VNPAY de chon ngan hang va hoan tat giao dich.</span>
                  </div>
                )}
              </section>

              <section className="checkout-panel">
                <div className="checkout-panel-head">
                  <h2>Thong tin lien he</h2>
                  <span>Da nhap o buoc truoc</span>
                </div>

                <div className="payment-traveler-card">
                  <strong>{`${traveler.firstName} ${traveler.lastName}`.trim()}</strong>
                  <span>{traveler.email}</span>
                  <span>{`${traveler.phoneCode} ${traveler.phone}`.trim()}</span>
                  {traveler.insurance && <span>Da chon bao hiem du lich</span>}
                </div>
              </section>

              {error && <div className="checkout-feedback error">{error}</div>}
              {message && <div className="checkout-feedback ok">{message}</div>}

              <div className="checkout-bottom-actions">
                <button
                  type="button"
                  className="checkout-back-link payment-back-button"
                  onClick={() => navigate('/checkout', { state: { tour, quantity, traveler } })}
                >
                  Quay lai thong tin
                </button>
                <button type="submit" disabled={loading} className="checkout-submit-btn">
                  {loading ? 'Dang xu ly...' : 'Xac nhan thanh toan'}
                </button>
              </div>
            </form>
          </section>

          <aside className="checkout-summary-column">
            <div className="checkout-summary-card">
              <h2>Tóm tắt thanh toán</h2>

              <div className="checkout-summary-tour">
                <div
                  className="checkout-summary-image"
                  style={{ backgroundImage: `url(${tour.image || 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400'})` }}
                />
                <div>
                  <strong>{tour.name}</strong>
                  <span>{new Date(tour.start_date).toLocaleDateString()} - {new Date(tour.end_date).toLocaleDateString()}</span>
                  <span>{quantity} Người lớn</span>
                </div>
              </div>

              <div className="checkout-summary-lines">
                <div><span>Người lớn (x{quantity})</span><strong>{formatCurrency(pricingSummary.subtotal)}</strong></div>
                <div><span>Phí xử lý</span><strong>{formatCurrency(pricingSummary.processingFee)}</strong></div>
                {pricingSummary.insuranceFee > 0 && (
                  <div><span>Bảo hiểm du lịch</span><strong>{formatCurrency(pricingSummary.insuranceFee)}</strong></div>
                )}
                <div className="discount"><span>Ưu đãi đặt sớm</span><strong>-{formatCurrency(pricingSummary.earlyBirdDiscount)}</strong></div>
              </div>

              <div className="checkout-summary-total">
                <span>Tổng thanh toán</span>
                <strong>{formatCurrency(pricingSummary.total)}</strong>
              </div>

              <div className="checkout-secure-box">
                <strong>Phuong thuc da chon</strong>
                <span>{paymentMethods.find((item) => item.id === selectedMethod)?.label}</span>
              </div>
            </div>
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  )
}
