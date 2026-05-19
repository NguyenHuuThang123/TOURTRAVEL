import { Link } from 'react-router-dom'

const quickLinks = [
  { label: 'Trang chủ', to: '/' },
  { label: 'Khám phá tour', to: '/tours' },
  { label: 'Đặt tour', to: '/tours' },
  { label: 'Tài khoản', to: '/account' },
]

const services = [
  'Đặt tour trực tuyến',
  'Hướng dẫn viên riêng',
  'Bảo hiểm du lịch',
  'Tour theo nhóm',
  'Gói tùy chỉnh',
]

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container site-footer-grid">
        {/* Brand */}
        <div className="site-footer-brand">
          <div className="site-footer-logo">
            <span className="site-footer-logo-icon" aria-hidden="true">✈</span>
            <strong>TourTravel</strong>
          </div>
          <p className="site-footer-tagline">
            Khám phá những điểm đến tuyệt vời và tạo nên những kỷ niệm khó quên cùng các tour du lịch được tuyển chọn kỹ lưỡng.
          </p>
          <div className="site-footer-socials" aria-label="Mạng xã hội">
            <a href="#" aria-label="Facebook" className="site-footer-social">f</a>
            <a href="#" aria-label="Instagram" className="site-footer-social">in</a>
            <a href="#" aria-label="YouTube" className="site-footer-social">▶</a>
            <a href="#" aria-label="TikTok" className="site-footer-social">♪</a>
          </div>
        </div>

        {/* Quick links */}
        <div className="site-footer-col">
          <h4 className="site-footer-col-title">Điều hướng</h4>
          <ul className="site-footer-list">
            {quickLinks.map((item) => (
              <li key={item.label}>
                <Link to={item.to} className="site-footer-link">{item.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Services */}
        <div className="site-footer-col">
          <h4 className="site-footer-col-title">Dịch vụ</h4>
          <ul className="site-footer-list">
            {services.map((s) => (
              <li key={s}>
                <span className="site-footer-link">{s}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div className="site-footer-col">
          <h4 className="site-footer-col-title">Liên hệ</h4>
          <div className="site-footer-contact">
            <div className="site-footer-contact-row">
              <span>📍</span>
              <span>123 Đường Du Lịch, TP. Hồ Chí Minh</span>
            </div>
            <div className="site-footer-contact-row">
              <span>📞</span>
              <span>+84 (028) 1234-5678</span>
            </div>
            <div className="site-footer-contact-row">
              <span>✉️</span>
              <span>hello@tourtravel.vn</span>
            </div>
            <div className="site-footer-contact-row">
              <span>🕒</span>
              <span>Thứ 2 – Thứ 7: 8:00 – 18:00</span>
            </div>
          </div>
        </div>
      </div>

      <div className="site-footer-bottom">
        <div className="container site-footer-bottom-inner">
          <p>© 2025 TourTravel. Bảo lưu mọi quyền.</p>
          <div className="site-footer-legal">
            <a href="#">Chính sách bảo mật</a>
            <a href="#">Điều khoản dịch vụ</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
