import { Link } from 'react-router-dom'

const quickLinks = [
  { label: 'Trang chủ', to: '/' },
  { label: 'Khám phá tour', to: '/tours' },
  { label: 'Đặt tour', to: '/tours' },
  { label: 'Tài khoản', to: '/account' }
]

const services = [
  'Đặt tour trực tuyến',
  'Hướng dẫn viên riêng',
  'Bảo hiểm du lịch',
  'Tour theo nhóm',
  'Gói tùy chỉnh'
]

const socials = [
  { label: 'Facebook', icon: 'f', href: '#' },
  { label: 'Instagram', icon: 'in', href: '#' },
  { label: 'YouTube', icon: '▶', href: '#' },
  { label: 'TikTok', icon: '♪', href: '#' }
]

const S = {
  footer: {
    background: '#0d1f16',
    color: '#c8d8ce',
    fontFamily: "'Be Vietnam Pro', sans-serif",
    borderTop: '1px solid rgba(231,201,160,0.12)'
  },
  grid: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '64px 32px 48px',
    display: 'grid',
    gridTemplateColumns: '1.5fr 1fr 1fr 1.2fr',
    gap: '48px'
  },
  /* Brand col */
  brandLogo: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '16px',
    textDecoration: 'none'
  },
  brandLogoIcon: {
    width: '40px',
    height: '40px',
    borderRadius: '8px',
    background: 'rgba(231,201,160,0.12)',
    border: '1px solid rgba(231,201,160,0.25)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '16px',
    flexShrink: 0
  },
  brandLogoText: {
    fontFamily: "'Playfair Display', serif",
    fontSize: '20px',
    fontWeight: 700,
    color: '#fff'
  },
  brandTagline: {
    fontSize: '0.88rem',
    color: 'rgba(200,216,206,0.65)',
    lineHeight: 1.75,
    maxWidth: '260px',
    marginBottom: '24px'
  },
  socials: {
    display: 'flex',
    gap: '8px'
  },
  socialBtn: {
    width: '36px',
    height: '36px',
    borderRadius: '6px',
    border: '1px solid rgba(231,201,160,0.2)',
    background: 'rgba(231,201,160,0.06)',
    color: '#e7c9a0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    textDecoration: 'none',
    fontSize: '13px',
    transition: 'background .2s, border-color .2s'
  },
  /* Columns */
  colTitle: {
    fontSize: '10px',
    letterSpacing: '2.5px',
    textTransform: 'uppercase',
    color: '#e7c9a0',
    marginBottom: '20px',
    fontWeight: 600
  },
  list: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: '11px'
  },
  link: {
    color: 'rgba(200,216,206,0.7)',
    textDecoration: 'none',
    fontSize: '0.88rem',
    transition: 'color .2s',
    lineHeight: 1.4
  },
  /* Contact */
  contactGrid: {
    display: 'flex',
    flexDirection: 'column',
    gap: '13px'
  },
  contactRow: {
    display: 'flex',
    gap: '12px',
    alignItems: 'flex-start',
    fontSize: '0.88rem',
    color: 'rgba(200,216,206,0.7)',
    lineHeight: 1.5
  },
  contactIcon: {
    width: '20px',
    textAlign: 'center',
    flexShrink: 0,
    marginTop: '1px',
    fontSize: '14px'
  },
  /* Bottom bar */
  bottomBar: {
    borderTop: '1px solid rgba(255,255,255,0.07)'
  },
  bottomInner: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '18px 32px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '12px'
  },
  bottomText: {
    color: 'rgba(200,216,206,0.4)',
    fontSize: '0.82rem',
    margin: 0
  },
  legalLinks: {
    display: 'flex',
    gap: '20px'
  },
  legalLink: {
    color: 'rgba(200,216,206,0.4)',
    fontSize: '0.82rem',
    textDecoration: 'none',
    transition: 'color .2s'
  }
}

export default function Footer() {
  return (
    <footer style={S.footer}>
      <div style={S.grid}>
        {/* Brand */}
        <div>
          <Link to="/" style={S.brandLogo}>
            <div style={S.brandLogoIcon}>✈</div>
            <span style={S.brandLogoText}>TourTravel</span>
          </Link>
          <p style={S.brandTagline}>
            Khám phá những điểm đến tuyệt vời và tạo nên những kỷ niệm khó quên cùng các tour du lịch được tuyển chọn kỹ lưỡng.
          </p>
          <div style={S.socials} aria-label="Mạng xã hội">
            {socials.map((s) => (
              <a key={s.label} href={s.href} aria-label={s.label} style={S.socialBtn}>{s.icon}</a>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div>
          <h4 style={S.colTitle}>Điều hướng</h4>
          <ul style={S.list}>
            {quickLinks.map((item) => (
              <li key={item.label}>
                <Link to={item.to} style={S.link}>{item.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Services */}
        <div>
          <h4 style={S.colTitle}>Dịch vụ</h4>
          <ul style={S.list}>
            {services.map((s) => (
              <li key={s}>
                <span style={S.link}>{s}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 style={S.colTitle}>Liên hệ</h4>
          <div style={S.contactGrid}>
            <div style={S.contactRow}>
              <span style={S.contactIcon}>📍</span>
              <span>123 Đường Du Lịch, TP. Hồ Chí Minh</span>
            </div>
            <div style={S.contactRow}>
              <span style={S.contactIcon}>📞</span>
              <span>+84 (028) 1234-5678</span>
            </div>
            <div style={S.contactRow}>
              <span style={S.contactIcon}>✉️</span>
              <span>hello@tourtravel.vn</span>
            </div>
            <div style={S.contactRow}>
              <span style={S.contactIcon}>🕒</span>
              <span>Thứ 2 – Thứ 7: 8:00 – 18:00</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div style={S.bottomBar}>
        <div style={S.bottomInner}>
          <p style={S.bottomText}>© 2025 TourTravel. Bảo lưu mọi quyền.</p>
          <div style={S.legalLinks}>
            <a href="#" style={S.legalLink}>Chính sách bảo mật</a>
            <a href="#" style={S.legalLink}>Điều khoản dịch vụ</a>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .footer-grid { grid-template-columns: 1fr 1fr !important; }
          .footer-brand { grid-column: 1 / -1; }
        }
        @media (max-width: 560px) {
          .footer-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </footer>
  )
}
