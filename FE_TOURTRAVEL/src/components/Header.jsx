import { Link } from 'react-router-dom'

export default function Header() {
  return (
    <header style={{
      background: 'var(--bg-white)',
      boxShadow: 'var(--shadow-sm)',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 'var(--spacing-md) 0'
      }}>
        {/* Logo */}
        <Link to="/" style={{
          fontSize: 'var(--font-size-xl)',
          fontWeight: 'bold',
          background: 'var(--gradient-primary)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>
          TourTravel
        </Link>

        {/* Navigation */}
        <nav style={{ display: 'flex', gap: 'var(--spacing-xl)', alignItems: 'center' }}>
          <Link to="/" style={{
            color: 'var(--text-primary)',
            fontWeight: '500',
            padding: 'var(--spacing-sm) var(--spacing-md)',
            borderRadius: 'var(--radius-md)',
            transition: 'var(--transition-fast)'
          }}>
            Home
          </Link>
          <Link to="/tours" style={{
            color: 'var(--text-primary)',
            fontWeight: '500',
            padding: 'var(--spacing-sm) var(--spacing-md)',
            borderRadius: 'var(--radius-md)',
            transition: 'var(--transition-fast)'
          }}>
            Tours
          </Link>
          <Link to="/about" style={{
            color: 'var(--text-primary)',
            fontWeight: '500',
            padding: 'var(--spacing-sm) var(--spacing-md)',
            borderRadius: 'var(--radius-md)',
            transition: 'var(--transition-fast)'
          }}>
            About
          </Link>
          <Link to="/contact" style={{
            color: 'var(--text-primary)',
            fontWeight: '500',
            padding: 'var(--spacing-sm) var(--spacing-md)',
            borderRadius: 'var(--radius-md)',
            transition: 'var(--transition-fast)'
          }}>
            Contact
          </Link>
        </nav>

        {/* CTA Button */}
        <button className="btn btn-primary" style={{
          padding: 'var(--spacing-sm) var(--spacing-lg)',
          fontSize: 'var(--font-size-sm)'
        }}>
          Book Now
        </button>
      </div>
    </header>
  )
}
