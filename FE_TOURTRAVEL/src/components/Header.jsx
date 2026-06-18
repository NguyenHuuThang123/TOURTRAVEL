import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const navLinks = [
  { to: '/', label: 'Trang chủ' },
  { to: '/tours', label: 'Khám phá tour' }
]

const S = {
  header: (scrolled) => ({
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 200,
    transition: 'background .3s, box-shadow .3s',
    background: scrolled ? 'rgba(15,30,20,0.97)' : 'transparent',
    boxShadow: scrolled ? '0 2px 20px rgba(0,0,0,0.3)' : 'none',
    backdropFilter: scrolled ? 'blur(12px)' : 'none'
  }),
  inner: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 32px',
    height: '70px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '24px'
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    textDecoration: 'none',
    flexShrink: 0
  },
  logoIcon: {
    width: '38px',
    height: '38px',
    borderRadius: '8px',
    background: 'rgba(231,201,160,0.15)',
    border: '1px solid rgba(231,201,160,0.3)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '16px'
  },
  logoText: {
    display: 'flex',
    flexDirection: 'column',
    lineHeight: 1.2
  },
  logoMain: {
    fontFamily: "'Playfair Display', serif",
    fontSize: '17px',
    fontWeight: 700,
    color: '#fff',
    letterSpacing: '0.3px'
  },
  logoSub: {
    fontSize: '9px',
    letterSpacing: '2.5px',
    textTransform: 'uppercase',
    color: '#e7c9a0',
    opacity: 0.8
  },
  nav: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    flex: 1,
    justifyContent: 'center'
  },
  navLink: (active) => ({
    padding: '8px 16px',
    fontSize: '0.85rem',
    letterSpacing: '0.5px',
    color: active ? '#e7c9a0' : 'rgba(255,255,255,0.8)',
    textDecoration: 'none',
    borderBottom: active ? '1px solid #e7c9a0' : '1px solid transparent',
    transition: 'color .2s, border-color .2s',
    fontWeight: active ? 600 : 400
  }),
  actions: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    flexShrink: 0
  },
  userChip: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  userAvatar: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    background: 'rgba(231,201,160,0.2)',
    border: '1px solid rgba(231,201,160,0.4)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#e7c9a0',
    fontSize: '12px',
    fontWeight: 700
  },
  userName: {
    fontSize: '0.85rem',
    color: 'rgba(255,255,255,0.85)',
    fontWeight: 500
  },
  btnGhost: {
    background: 'none',
    border: '1px solid rgba(255,255,255,0.25)',
    color: 'rgba(255,255,255,0.85)',
    padding: '7px 16px',
    borderRadius: '4px',
    fontSize: '0.82rem',
    cursor: 'pointer',
    textDecoration: 'none',
    display: 'inline-block',
    transition: 'border-color .2s, color .2s'
  },
  btnCta: {
    background: '#e7c9a0',
    border: '1px solid #e7c9a0',
    color: '#1b2a25',
    padding: '7px 18px',
    borderRadius: '4px',
    fontSize: '0.82rem',
    fontWeight: 700,
    cursor: 'pointer',
    textDecoration: 'none',
    display: 'inline-block',
    letterSpacing: '0.5px'
  },
  toggle: {
    display: 'none',
    flexDirection: 'column',
    gap: '5px',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '6px'
  },
  toggleBar: {
    width: '22px',
    height: '2px',
    background: '#fff',
    borderRadius: '2px',
    display: 'block'
  },
  mobileMenu: {
    background: 'rgba(13,26,18,0.98)',
    backdropFilter: 'blur(12px)',
    borderTop: '1px solid rgba(231,201,160,0.1)',
    padding: '16px 24px 24px'
  },
  mobileLink: {
    display: 'block',
    padding: '13px 0',
    borderBottom: '1px solid rgba(255,255,255,0.06)',
    color: 'rgba(255,255,255,0.85)',
    textDecoration: 'none',
    fontSize: '0.95rem'
  },
  mobileLinkActive: {
    color: '#e7c9a0',
    fontWeight: 600
  },
  mobileCta: {
    display: 'block',
    marginTop: '16px',
    padding: '12px',
    background: '#e7c9a0',
    color: '#1b2a25',
    textAlign: 'center',
    borderRadius: '4px',
    fontWeight: 700,
    textDecoration: 'none',
    fontSize: '0.9rem'
  },
  mobileLogout: {
    background: 'none',
    border: 'none',
    padding: '13px 0',
    width: '100%',
    textAlign: 'left',
    borderBottom: '1px solid rgba(255,255,255,0.06)',
    color: 'rgba(255,100,100,0.8)',
    fontSize: '0.95rem',
    cursor: 'pointer'
  }
}

export default function Header() {
  const location = useLocation()
  const { user, logout, isAuthenticated } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  const isActive = (path) => location.pathname === path
  const isHome = location.pathname === '/'

  useEffect(() => {
    if (!isHome) { setScrolled(true); return }
    const onScroll = () => setScrolled(window.scrollY > 30)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [isHome])

  useEffect(() => setMenuOpen(false), [location.pathname])

  return (
    <header style={S.header(scrolled)}>
      <div style={S.inner}>
        {/* Logo */}
        <Link to="/" style={S.logo} aria-label="TourTravel - Trang chủ">
          <div style={S.logoIcon}>✈</div>
          <div style={S.logoText}>
            <span style={S.logoMain}>TourTravel</span>
            <span style={S.logoSub}>Khám phá · Trải nghiệm</span>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav style={S.nav} className="header-desktop-nav" aria-label="Điều hướng chính">
          {navLinks.map((link) => (
            <Link key={link.to} to={link.to} style={S.navLink(isActive(link.to))}>
              {link.label}
            </Link>
          ))}
          {user?.role === 'admin' && (
            <Link to="/admin" style={S.navLink(isActive('/admin'))}>Quản trị</Link>
          )}
          {user?.role === 'guide' && (
            <Link to="/guide" style={S.navLink(isActive('/guide'))}>Dashboard</Link>
          )}
          {isAuthenticated && (
            <Link
              to={user?.role === 'guide' ? '/guide' : '/account'}
              style={S.navLink(['/account', '/guide'].includes(location.pathname))}
            >
              Tài khoản
            </Link>
          )}
        </nav>

        {/* Auth actions */}
        <div style={S.actions} className="header-desktop-actions">
          {isAuthenticated ? (
            <>
              <div style={S.userChip}>
                <div style={S.userAvatar}>
                  {(user?.name || 'U').charAt(0).toUpperCase()}
                </div>
                <span style={S.userName}>{user?.name}</span>
              </div>
              <button onClick={logout} style={S.btnGhost} type="button">Đăng xuất</button>
            </>
          ) : (
            <>
              <Link to="/login" style={S.btnGhost}>Đăng nhập</Link>
              <Link to="/register" style={S.btnCta}>Đăng ký</Link>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          style={{ ...S.toggle, display: 'flex' }}
          className="header-mobile-toggle"
          type="button"
          aria-label={menuOpen ? 'Đóng menu' : 'Mở menu'}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((v) => !v)}
        >
          <span style={S.toggleBar} />
          <span style={S.toggleBar} />
          <span style={S.toggleBar} />
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div style={S.mobileMenu} role="navigation" aria-label="Menu di động">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              style={{ ...S.mobileLink, ...(isActive(link.to) ? S.mobileLinkActive : {}) }}
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          {user?.role === 'admin' && (
            <Link to="/admin" style={S.mobileLink} onClick={() => setMenuOpen(false)}>Quản trị</Link>
          )}
          {user?.role === 'guide' && (
            <Link to="/guide" style={S.mobileLink} onClick={() => setMenuOpen(false)}>Dashboard</Link>
          )}
          {isAuthenticated ? (
            <>
              <Link
                to={user?.role === 'guide' ? '/guide' : '/account'}
                style={S.mobileLink}
                onClick={() => setMenuOpen(false)}
              >
                Tài khoản
              </Link>
              <button
                style={S.mobileLogout}
                onClick={() => { logout(); setMenuOpen(false) }}
                type="button"
              >
                Đăng xuất
              </button>
            </>
          ) : (
            <>
              <Link to="/login" style={S.mobileLink} onClick={() => setMenuOpen(false)}>Đăng nhập</Link>
              <Link to="/register" style={S.mobileCta} onClick={() => setMenuOpen(false)}>Đăng ký ngay</Link>
            </>
          )}
        </div>
      )}

      <style>{`
        @media (min-width: 769px) { .header-mobile-toggle { display: none !important; } }
        @media (max-width: 768px) {
          .header-desktop-nav, .header-desktop-actions { display: none !important; }
        }
      `}</style>
    </header>
  )
}
