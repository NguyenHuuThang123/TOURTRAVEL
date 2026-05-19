import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import GoogleAuthButton from '../components/GoogleAuthButton'
import { useAuth } from '../context/AuthContext'

export default function Register() {
  const navigate = useNavigate()
  const { googleLogin, register } = useAuth()
  const [formData, setFormData] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    try {
      setLoading(true)
      setError('')
      await register(formData)
      navigate('/account', { replace: true })
    } catch (err) {
      setError(err.response?.data?.detail || 'Đăng ký thất bại. Vui lòng thử lại.')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleRegister = async (credential) => {
    try {
      setLoading(true)
      setError('')
      const auth = await googleLogin(credential)
      navigate(
        auth?.user?.role === 'admin' ? '/admin'
        : auth?.user?.role === 'guide' ? '/guide'
        : '/account',
        { replace: true }
      )
    } catch (err) {
      setError(err.response?.data?.detail || 'Đăng ký bằng Google thất bại.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-shell">
      <Header />
      <main className="auth-main">
        <div className="auth-card">
          <p className="auth-eyebrow">Tạo tài khoản</p>
          <h1 className="auth-title">Đăng ký</h1>
          <p className="auth-subtitle">Tạo tài khoản để đặt tour nhanh hơn và quản lý thông tin cá nhân.</p>

          <form onSubmit={handleSubmit} className="auth-form">
            <label className="auth-field">
              <span>Họ và tên</span>
              <input
                required
                placeholder="Nguyễn Văn A"
                value={formData.name}
                onChange={(event) => setFormData((prev) => ({ ...prev, name: event.target.value }))}
                className="auth-input"
              />
            </label>
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
                placeholder="Tối thiểu 8 ký tự"
                value={formData.password}
                onChange={(event) => setFormData((prev) => ({ ...prev, password: event.target.value }))}
                className="auth-input"
              />
            </label>
            {error && <p className="auth-error">{error}</p>}
            <button type="submit" disabled={loading} className="auth-button">
              {loading ? 'Đang tạo tài khoản...' : 'Đăng ký ngay'}
            </button>
          </form>

          <div style={{ marginTop: '20px', marginBottom: '20px' }}>
            <GoogleAuthButton onCredential={handleGoogleRegister} text="signup_with" />
          </div>

          <p className="auth-footer-text">
            Đã có tài khoản?{' '}
            <Link to="/login" style={{ color: 'var(--accent-color)', fontWeight: 700 }}>
              Đăng nhập
            </Link>
          </p>
        </div>
      </main>
      <Footer />
    </div>
  )
}
