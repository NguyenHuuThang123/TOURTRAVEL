export default function Footer() {
  return (
    <footer style={{
      background: 'var(--text-primary)',
      color: 'var(--text-white)',
      padding: 'var(--spacing-2xl) 0 var(--spacing-lg)',
      marginTop: 'var(--spacing-2xl)'
    }}>
      <div className="container">
        <div className="grid grid-4" style={{ marginBottom: 'var(--spacing-xl)' }}>
          {/* Company Info */}
          <div>
            <h3 style={{
              fontSize: 'var(--font-size-lg)',
              marginBottom: 'var(--spacing-md)',
              background: 'var(--gradient-primary)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              TourTravel
            </h3>
            <p style={{
              color: 'var(--text-light)',
              lineHeight: '1.6',
              marginBottom: 'var(--spacing-md)'
            }}>
              Discover amazing destinations and create unforgettable memories with our curated tour experiences.
            </p>
            <div style={{ display: 'flex', gap: 'var(--spacing-sm)' }}>
              <a href="#" style={{ color: 'var(--text-light)', fontSize: '1.2rem' }}>📘</a>
              <a href="#" style={{ color: 'var(--text-light)', fontSize: '1.2rem' }}>🐦</a>
              <a href="#" style={{ color: 'var(--text-light)', fontSize: '1.2rem' }}>📷</a>
              <a href="#" style={{ color: 'var(--text-light)', fontSize: '1.2rem' }}>💼</a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{
              fontSize: 'var(--font-size-base)',
              marginBottom: 'var(--spacing-md)',
              color: 'var(--text-white)'
            }}>
              Quick Links
            </h4>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {['Home', 'Tours', 'Destinations', 'About Us', 'Contact'].map((item) => (
                <li key={item} style={{ marginBottom: 'var(--spacing-sm)' }}>
                  <a href="#" style={{
                    color: 'var(--text-light)',
                    transition: 'var(--transition-fast)'
                  }}>
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 style={{
              fontSize: 'var(--font-size-base)',
              marginBottom: 'var(--spacing-md)',
              color: 'var(--text-white)'
            }}>
              Services
            </h4>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {['Tour Booking', 'Hotel Reservation', 'Travel Insurance', 'Guided Tours', 'Custom Packages'].map((item) => (
                <li key={item} style={{ marginBottom: 'var(--spacing-sm)' }}>
                  <a href="#" style={{
                    color: 'var(--text-light)',
                    transition: 'var(--transition-fast)'
                  }}>
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 style={{
              fontSize: 'var(--font-size-base)',
              marginBottom: 'var(--spacing-md)',
              color: 'var(--text-white)'
            }}>
              Contact Us
            </h4>
            <div style={{ color: 'var(--text-light)', lineHeight: '1.6' }}>
              <p>📍 123 Travel Street, City, Country</p>
              <p>📞 +1 (555) 123-4567</p>
              <p>✉️ info@tourtravel.com</p>
              <p>🕒 Mon - Fri: 9AM - 6PM</p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div style={{
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          paddingTop: 'var(--spacing-lg)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 'var(--spacing-md)'
        }}>
          <p style={{ color: 'var(--text-light)', margin: 0 }}>
            © 2024 TourTravel. All rights reserved.
          </p>
          <div style={{ display: 'flex', gap: 'var(--spacing-lg)' }}>
            <a href="#" style={{ color: 'var(--text-light)', fontSize: 'var(--font-size-sm)' }}>
              Privacy Policy
            </a>
            <a href="#" style={{ color: 'var(--text-light)', fontSize: 'var(--font-size-sm)' }}>
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
