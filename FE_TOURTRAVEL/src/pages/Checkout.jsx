import { useEffect, useMemo, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { createBooking } from '../api/tourService'
import { useAuth } from '../context/AuthContext'
import { formatCurrency } from '../utils/currency'

export default function Checkout() {
  const insuranceFee = 45000
  const location = useLocation()
  const navigate = useNavigate()
  const { user, token } = useAuth()
  const [formData, setFormData] = useState({
    firstName: user?.name?.split(' ').slice(0, -1).join(' ') || user?.name || '',
    lastName: user?.name?.split(' ').slice(-1).join(' ') || '',
    email: user?.email || '',
    phoneCode: '+1',
    phone: user?.phone || '',
    dateOfBirth: '',
    insurance: false,
    vegetarian: false
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const tour = location.state?.tour
  const quantity = location.state?.quantity || 1
  const subtotal = useMemo(() => (tour ? tour.price * quantity : 0), [quantity, tour])
  const processingFee = useMemo(() => subtotal * 0.1, [subtotal])
  const earlyBirdDiscount = useMemo(() => subtotal * 0.06, [subtotal])
  const selectedInsuranceFee = useMemo(
    () => (formData.insurance ? insuranceFee : 0),
    [formData.insurance]
  )
  const total = useMemo(
    () => subtotal + processingFee + selectedInsuranceFee - earlyBirdDiscount,
    [earlyBirdDiscount, processingFee, selectedInsuranceFee, subtotal]
  )

  useEffect(() => {
    if (!user) return

    const nameParts = (user.name || '').trim().split(/\s+/)
    setFormData((prev) => ({
      ...prev,
      firstName: nameParts.slice(0, -1).join(' ') || user.name || '',
      lastName: nameParts.slice(-1).join(' ') || '',
      email: user.email || '',
      phone: user.phone || prev.phone
    }))
  }, [user])

  useEffect(() => {
    if (user?.role === 'guide') {
      navigate('/guide', { replace: true })
    }
  }, [navigate, user])

  if (!tour) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-gray-50)' }}>
        <Header />
        <main style={{ maxWidth: '900px', margin: '0 auto', padding: '40px 20px' }}>
          <p>Chua co tour nao duoc chon.</p>
          <Link to="/tours">Quay lai danh sach tour</Link>
        </main>
        <Footer />
      </div>
    )
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (user?.role === 'guide') {
      setError('Huong dan vien khong the dat tour.')
      return
    }
    try {
      setLoading(true)
      setError('')
      const booking = await createBooking({
        tour_id: tour.id,
        user_name: `${formData.firstName} ${formData.lastName}`.trim(),
        user_email: formData.email,
        user_phone: `${formData.phoneCode} ${formData.phone}`.trim(),
        quantity,
        insurance_selected: formData.insurance
      }, token)
      setMessage(`Dat tour thanh cong. Ma don: ${booking.id}`)
      setTimeout(() => {
        if (user?.role === 'admin') {
          navigate('/admin')
          return
        }

        navigate(user ? '/account' : '/tours')
      }, 1400)
    } catch (err) {
      setError(err.response?.data?.detail || 'Dat tour that bai.')
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
          <span>Checkout</span>
        </nav>

        <div className="checkout-layout">
          <section className="checkout-form-column">
            <div className="checkout-step-card">
              <div className="checkout-step-header">
                <div>
                  <p className="checkout-step-eyebrow">Bước hiện tại</p>
                  <h1>Thông tin du khách</h1>
                </div>
                <div className="checkout-step-progress">
                  <strong>Bước 1 trên 3</strong>
                  <span>33% Hoàn thành</span>
                </div>
              </div>

              <div className="checkout-step-tabs">
                <div className="active">1 - Thông tin</div>
                <div>2 - Thanh toán</div>
                <div>3 - Xác nhận</div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="checkout-form-stack">
              <section className="checkout-panel">
                <div className="checkout-panel-head">
                  <h2>Thông tin chi tiết du khách</h2>
                  <span>Liên hệ chính</span>
                </div>

                <div className="checkout-grid">
                  <label className="checkout-field">
                    <span>Tên khách hàng</span>
                    <input required value={formData.firstName} onChange={(event) => setFormData((prev) => ({ ...prev, firstName: event.target.value }))} placeholder="John" />
                  </label>
                  <label className="checkout-field">
                    <span>Họ</span>
                    <input required value={formData.lastName} onChange={(event) => setFormData((prev) => ({ ...prev, lastName: event.target.value }))} placeholder="Doe" />
                  </label>
                  <label className="checkout-field checkout-span-2">
                    <span>Email Address</span>
                    <input required type="email" value={formData.email} onChange={(event) => setFormData((prev) => ({ ...prev, email: event.target.value }))} placeholder="john.doe@example.com" />
                  </label>
                  <label className="checkout-field">
                    <span>Số điện thoại</span>
                    <div className="checkout-phone-row">
                      <select value={formData.phoneCode} onChange={(event) => setFormData((prev) => ({ ...prev, phoneCode: event.target.value }))}>
                        <option value="+1">+1</option>
                        <option value="+84">+84</option>
                        <option value="+44">+44</option>
                      </select>
                      <input required value={formData.phone} onChange={(event) => setFormData((prev) => ({ ...prev, phone: event.target.value }))} placeholder="123 456 7890" />
                    </div>
                  </label>
                  <label className="checkout-field">
                    <span>Ngày sinh</span>
                    <input value={formData.dateOfBirth} onChange={(event) => setFormData((prev) => ({ ...prev, dateOfBirth: event.target.value }))} placeholder="mm/dd/yyyy" />
                  </label>
                </div>
              </section>

              <section className="checkout-panel">
                <div className="checkout-panel-head">
                  <h2>Thông tin bổ sung</h2>
                </div>

                <label className="checkout-option-row">
                  <input type="checkbox" checked={formData.insurance} onChange={(event) => setFormData((prev) => ({ ...prev, insurance: event.target.checked }))} />
                  <div>
                    <strong>Thêm bảo hiểm du lịch (+45.000 VNĐ)</strong>
                    <span>Hãy bảo vệ chuyến đi của bạn khỏi những trường hợp hủy chuyến đột xuất và cấp cứu y tế.</span>
                  </div>
                </label>

                {/* <label className="checkout-option-row">
                  <input type="checkbox" checked={formData.vegetarian} onChange={(event) => setFormData((prev) => ({ ...prev, vegetarian: event.target.checked }))} />
                  <div>
                    <strong>Vegetarian Meal Preference</strong>
                    <span>Request special dietary requirements for your tour meals.</span>
                  </div>
                </label> */}
              </section>

              {error && <div className="checkout-feedback error">{error}</div>}
              {message && <div className="checkout-feedback ok">{message}</div>}

              <div className="checkout-bottom-actions">
                <Link to={`/tours/${tour.id}`} className="checkout-back-link">Quay lại</Link>
                <button type="submit" disabled={loading} className="checkout-submit-btn">
                  {loading ? 'Processing...' : 'Continue to Payment'}
                </button>
              </div>
            </form>
          </section>

          <aside className="checkout-summary-column">
            <div className="checkout-summary-card">
              <h2>Tóm tắt đơn hàng</h2>

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
                <div><span>Người lớn (x{quantity})</span><strong>{formatCurrency(subtotal)}</strong></div>
                <div><span>Phí xử lý</span><strong>{formatCurrency(processingFee)}</strong></div>
                {formData.insurance && (
                  <div><span>Bảo hiểm du lịch</span><strong>{formatCurrency(selectedInsuranceFee)}</strong></div>
                )}
                <div className="discount"><span>Ưu đãi đặt sớm</span><strong>-{formatCurrency(earlyBirdDiscount)}</strong></div>
              </div>

              <div className="checkout-summary-total">
                <span>Tổng thanh toán</span>
                <strong>{formatCurrency(total)}</strong>
              </div>

              <div className="checkout-promo-row">
                <input placeholder="Mã giảm giá" />
                <button type="button">Áp dụng</button>
              </div>

              <div className="checkout-secure-box">
                <strong>Thanh toán an toàn</strong>
                <span>Dữ liệu của bạn được bảo vệ bởi mã hóa SSL 256-bit.</span>
              </div>

              <div className="checkout-summary-note">
                Hủy chuyến miễn phí và 48 giờ trước khi đi. Điều khoản và điều kiện áp dụng.
              </div>
            </div>
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  )
}
