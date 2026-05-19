import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const navLinks = [
  { to: '/', label: 'Trang chủ' },
  { to: '/tours', label: 'Khám phá tour' }
]

export default function Header() {
  const location = useLocation()
  const { user, logout, isAuthenticated } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)

  const isActive = (path) => location.pathname === path

  return (
    <header className="site-header">
      <div className="container site-header-inner">
        {/* Logo */}
        <Link to="/" className="site-logo" aria-label="TourTravel - Trang chủ">
          <span className="site-logo-icon" aria-hidden="true">✈</span>
          <span className="site-logo-text">
            <strong>TourTravel</strong>
            <span>Khám phá · Trải nghiệm</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="site-nav" aria-label="Điều hướng chính">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`site-nav-link ${isActive(link.to) ? 'active' : ''}`}
            >
              {link.label}
            </Link>
          ))}
          {user?.role === 'admin' && (
            <Link to="/admin" className={`site-nav-link ${isActive('/admin') ? 'active' : ''}`}>
              Quản trị
            </Link>
          )}
          {user?.role === 'guide' && (
            <Link to="/guide" className={`site-nav-link ${isActive('/guide') ? 'active' : ''}`}>
              Dashboard
            </Link>
          )}
          {isAuthenticated && (
            <Link
              to={user?.role === 'guide' ? '/guide' : '/account'}
              className={`site-nav-link ${['/account', '/guide'].includes(location.pathname) ? 'active' : ''}`}
            >
              Tài khoản
            </Link>
          )}
        </nav>

        {/* Auth actions */}
        <div className="site-header-actions">
          {isAuthenticated ? (
            <>
              <div className="site-user-chip">
                <span className="site-user-chip-avatar" aria-hidden="true">
                  {(user?.name || 'U').charAt(0).toUpperCase()}
                </span>
                <span className="site-user-chip-name">{user?.name}</span>
              </div>
              <button onClick={logout} className="site-btn-ghost" type="button">
                Đăng xuất
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="site-btn-ghost">Đăng nhập</Link>
              <Link to="/register" className="site-btn-cta">Đăng ký</Link>
            </>
          )}
        </div>

        {/* Mobile menu toggle */}
        <button
          className="site-menu-toggle"
          type="button"
          aria-label={menuOpen ? 'Đóng menu' : 'Mở menu'}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((v) => !v)}
        >
          <span /><span /><span />
        </button>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="site-mobile-menu" role="navigation" aria-label="Menu di động">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`site-mobile-link ${isActive(link.to) ? 'active' : ''}`}
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          {user?.role === 'admin' && (
            <Link to="/admin" className="site-mobile-link" onClick={() => setMenuOpen(false)}>Quản trị</Link>
          )}
          {user?.role === 'guide' && (
            <Link to="/guide" className="site-mobile-link" onClick={() => setMenuOpen(false)}>Dashboard</Link>
          )}
          {isAuthenticated ? (
            <>
              <Link
                to={user?.role === 'guide' ? '/guide' : '/account'}
                className="site-mobile-link"
                onClick={() => setMenuOpen(false)}
              >
                Tài khoản
              </Link>
              <button onClick={() => { logout(); setMenuOpen(false) }} className="site-mobile-link site-mobile-logout" type="button">
                Đăng xuất
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="site-mobile-link" onClick={() => setMenuOpen(false)}>Đăng nhập</Link>
              <Link to="/register" className="site-mobile-link site-mobile-cta" onClick={() => setMenuOpen(false)}>Đăng ký ngay</Link>
            </>
          )}
        </div>
      )}
    </header>
  )
}
