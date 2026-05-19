import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import GoogleAuthButton from '../components/GoogleAuthButton'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const { googleLogin, login } = useAuth()
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const redirectTo = location.state?.from || '/account'
  const destinationForRole = (role) => {
    if (role === 'admin') return '/admin'
    if (role === 'guide') return '/guide'
    return redirectTo
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    try {
      setLoading(true)
      setError('')
      const auth = await login(formData)
      const destination = destinationForRole(auth?.user?.role)
      navigate(destination, { replace: true })
    } catch (err) {
      setError(err.response?.data?.detail || 'Dang nhap that bai.')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLogin = async (credential) => {
    try {
      setLoading(true)
      setError('')
      const auth = await googleLogin(credential)
      const destination = destinationForRole(auth?.user?.role)
      navigate(destination, { replace: true })
    } catch (err) {
      setError(err.response?.data?.detail || 'Dang nhap bang Google that bai.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-shell">
      <Header />
      <main className="auth-main">
        <div className="auth-card">
          <p className="auth-eyebrow">Chào mừng trở lại</p>
          <h1 className="auth-title">Đăng nhập</h1>
          <p className="auth-subtitle">Đăng nhập để quản lý tour, xem tài khoản và thao tác quản trị nếu bạn được cấp quyền.</p>

          <form onSubmit={handleSubmit} className="auth-form">
            <label className="auth-field">
              <span>Email</span>
              <input
                type="email"
                required
                placeholder="example@email.com"
                value={formData.email}
                onChange={(event) => setFormData((prev) => ({ ...prev, email: event.target.value }))}
                className="auth-input"
              />
            </label>
            <label className="auth-field">
              <span>Mật khẩu</span>
              <input
                type="password"
                required
                placeholder="Nhập mật khẩu"
                value={formData.password}
                onChange={(event) => setFormData((prev) => ({ ...prev, password: event.target.value }))}
                className="auth-input"
              />
            </label>
            {error && <p className="auth-error">{error}</p>}
            <button type="submit" disabled={loading} className="auth-button">
              {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
            </button>
          </form>

          <div style={{ marginTop: '24px', marginBottom: '24px' }}>
            <GoogleAuthButton onCredential={handleGoogleLogin} text="continue_with" />
          </div>

          <p className="auth-footer-text">
            Chưa có tài khoản? <Link to="/register" style={{ color: 'var(--primary-color)', fontWeight: 'bold' }}>Đăng ký ngay</Link>
          </p>
        </div>
      </main>
      <Footer />
    </div>
  )
}
