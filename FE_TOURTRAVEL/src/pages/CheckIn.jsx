import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { getPublicBookingById } from '../api/tourService'
import { formatCurrency } from '../utils/currency'
import { formatVietnamDate } from '../utils/datetime'

const statusLabel = {
  pending: 'Dang xu ly',
  confirmed: 'Da xac nhan',
  cancelled: 'Da huy'
}

export default function CheckIn() {
  const location = useLocation()
  const search = new URLSearchParams(location.search)
  const bookingId = search.get('booking_id') || ''
  const [booking, setBooking] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true

    const loadBooking = async () => {
      if (!bookingId) {
        setError('Khong tim thay ma booking trong link check-in.')
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        setError('')
        const data = await getPublicBookingById(bookingId)
        if (active) {
          setBooking(data)
        }
      } catch (err) {
        if (active) {
          setError(err.response?.data?.detail || 'Khong tai duoc thong tin booking cho trang check-in.')
        }
      } finally {
        if (active) {
          setLoading(false)
        }
      }
    }

    loadBooking()
    return () => {
      active = false
    }
  }, [bookingId])

  return (
    <div className="checkout-shell">
      <Header />

      <main className="container checkout-main">
        <section
          className="payment-result-card"
          style={{ maxWidth: '760px', textAlign: 'left', margin: '0 auto' }}
        >
          <span className="payment-result-badge success">Check-in</span>
          <h1>Trang check-in booking</h1>
          <p>
            Link nay duoc tao tu email xac nhan de ban hoac nhan vien co the doi chieu booking khi tinh nang
            check-in duoc kich hoat.
          </p>

          {loading && <p>Dang tai thong tin booking...</p>}
          {error && <p style={{ color: '#dc2626' }}>{error}</p>}

          {!loading && !error && booking && (
            <div
              style={{
                display: 'grid',
                gap: '12px',
                marginTop: '20px',
                padding: '20px',
                border: '1px solid #e5e7eb',
                borderRadius: '20px',
                background: '#fff'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap' }}>
                <div>
                  <p style={{ margin: 0, color: '#64748b', fontSize: '14px' }}>Ma booking</p>
                  <strong>{booking.id}</strong>
                </div>
                <div>
                  <p style={{ margin: 0, color: '#64748b', fontSize: '14px' }}>Trang thai</p>
                  <strong>{statusLabel[booking.status] || booking.status}</strong>
                </div>
              </div>

              <div>
                <p style={{ margin: 0, color: '#64748b', fontSize: '14px' }}>Tour</p>
                <strong>{booking.tour_name || 'Dang cap nhat'}</strong>
              </div>

              <div>
                <p style={{ margin: 0, color: '#64748b', fontSize: '14px' }}>Diem den</p>
                <strong>{booking.tour_destination || 'Dang cap nhat'}</strong>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
                <div>
                  <p style={{ margin: 0, color: '#64748b', fontSize: '14px' }}>Ngay khoi hanh</p>
                  <strong>{booking.start_date ? formatVietnamDate(booking.start_date) : 'Dang cap nhat'}</strong>
                </div>
                <div>
                  <p style={{ margin: 0, color: '#64748b', fontSize: '14px' }}>So luong khach</p>
                  <strong>{booking.quantity || 0}</strong>
                </div>
                <div>
                  <p style={{ margin: 0, color: '#64748b', fontSize: '14px' }}>Tong thanh toan</p>
                  <strong>{formatCurrency(booking.total_price || 0)}</strong>
                </div>
              </div>

              <div>
                <p style={{ margin: 0, color: '#64748b', fontSize: '14px' }}>Huong dan vien</p>
                <strong>{booking.guide_name || 'Se cap nhat sau'}</strong>
              </div>

              <div
                style={{
                  marginTop: '8px',
                  padding: '14px 16px',
                  borderRadius: '16px',
                  background: '#f8fafc',
                  color: '#475569'
                }}
              >
                Tinh nang quet QR check-in se duoc noi vao trang nay. Hien tai link da hoat dong va hien thi dung
                booking de ban kiem tra.
              </div>
            </div>
          )}

          <div className="payment-result-actions" style={{ marginTop: '24px' }}>
            <Link to="/tours" className="checkout-submit-btn">
              Quay lai danh sach tour
            </Link>
            {bookingId && <span className="payment-result-reference">Ma booking: {bookingId}</span>}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
