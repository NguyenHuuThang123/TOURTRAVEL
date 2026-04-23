import { Link, useLocation } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { useAuth } from '../context/AuthContext'

export default function VnpayReturn() {
  const { user } = useAuth()
  const location = useLocation()
  const search = new URLSearchParams(location.search)
  const status = search.get('status') || 'failed'
  const message = search.get('message') || 'Khong xac dinh duoc ket qua thanh toan.'
  const bookingId = search.get('booking_id')

  return (
    <div className="checkout-shell">
      <Header />

      <main className="container checkout-main">
        <section className="payment-result-card">
          <span className={`payment-result-badge ${status}`}>{status === 'success' ? 'Thanh cong' : 'That bai'}</span>
          <h1>{status === 'success' ? 'Giao dich VNPAY da hoan tat' : 'Thanh toan chua thanh cong'}</h1>
          <p>{message}</p>

          <div className="payment-result-actions">
            {status === 'success' ? (
              <Link to={user ? '/account' : '/tours'} className="checkout-submit-btn">
                {user ? 'Xem booking cua toi' : 'Quay lai danh sach tour'}
              </Link>
            ) : (
              <Link to="/tours" className="checkout-submit-btn">
                Quay lai danh sach tour
              </Link>
            )}
            {bookingId && <span className="payment-result-reference">Ma booking: {bookingId}</span>}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
