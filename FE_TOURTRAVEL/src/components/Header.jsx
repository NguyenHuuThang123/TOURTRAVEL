import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/tours', label: 'Tours' }
]

export default function Header() {
  const location = useLocation()
  const { user, logout, isAuthenticated } = useAuth()

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        backdropFilter: 'blur(18px)',
        background: 'rgba(248, 250, 252, 0.88)',
        borderBottom: '1px solid rgba(148, 163, 184, 0.18)'
      }}
    >
      <div
        className="container"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
          padding: '14px 0'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '18px', flexWrap: 'wrap' }}>
          <Link
            to="/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              color: '#0f172a'
            }}
          >
            <span
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '14px',
                background: 'linear-gradient(135deg, #2563eb 0%, #0f172a 100%)',
                color: 'white',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                boxShadow: '0 12px 32px rgba(37, 99, 235, 0.24)'
              }}
            >
              TT
            </span>
            <span style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.1 }}>
              <strong style={{ fontSize: '18px' }}>TourTravel</strong>
              <span style={{ fontSize: '11px', color: '#64748b', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                Explore and book
              </span>
            </span>
          </Link>

          <nav style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {navLinks.map((link) => {
              const active = location.pathname === link.to
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  style={{
                    padding: '10px 14px',
                    borderRadius: '999px',
                    color: active ? '#0f172a' : '#475569',
                    background: active ? 'rgba(37, 99, 235, 0.1)' : 'transparent',
                    fontWeight: 600
                  }}
                >
                  {link.label}
                </Link>
              )
            })}
            {user?.role === 'admin' && (
              <Link
                to="/admin"
                style={{
                  padding: '10px 14px',
                  borderRadius: '999px',
                  color: location.pathname === '/admin' ? '#0f172a' : '#475569',
                  background: location.pathname === '/admin' ? 'rgba(37, 99, 235, 0.1)' : 'transparent',
                  fontWeight: 600
                }}
              >
                Admin
              </Link>
            )}
            {isAuthenticated && (
              <Link
                to="/account"
                style={{
                  padding: '10px 14px',
                  borderRadius: '999px',
                  color: location.pathname === '/account' ? '#0f172a' : '#475569',
                  background: location.pathname === '/account' ? 'rgba(37, 99, 235, 0.1)' : 'transparent',
                  fontWeight: 600
                }}
              >
                Tai khoan
              </Link>
            )}
          </nav>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
          {isAuthenticated ? (
            <>
              <div
                style={{
                  padding: '8px 14px',
                  borderRadius: '999px',
                  background: 'white',
                  border: '1px solid #dbe7ff',
                  boxShadow: '0 10px 30px rgba(15, 23, 42, 0.06)'
                }}
              >
                <div style={{ fontSize: '13px', color: '#64748b' }}>Xin chao</div>
                <div style={{ fontWeight: 700, color: '#0f172a' }}>{user?.name}</div>
              </div>
              <button
                onClick={logout}
                style={{
                  padding: '12px 16px',
                  borderRadius: '999px',
                  background: '#e2e8f0',
                  color: '#0f172a',
                  fontWeight: 700
                }}
              >
                Dang xuat
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                style={{
                  padding: '12px 16px',
                  borderRadius: '999px',
                  background: 'white',
                  color: '#0f172a',
                  border: '1px solid #dbe7ff',
                  fontWeight: 700
                }}
              >
                Dang nhap
              </Link>
              <Link
                to="/register"
                style={{
                  padding: '12px 18px',
                  borderRadius: '999px',
                  background: 'linear-gradient(135deg, #2563eb 0%, #0f172a 100%)',
                  color: 'white',
                  fontWeight: 700,
                  boxShadow: '0 14px 32px rgba(37, 99, 235, 0.22)'
                }}
              >
                Dang ky
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
