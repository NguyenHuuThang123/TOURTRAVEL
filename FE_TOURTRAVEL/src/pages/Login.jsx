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

  const handleSubmit = async (event) => {
    event.preventDefault()
    try {
      setLoading(true)
      setError('')
      const auth = await login(formData)
      const destination = auth?.user?.role === 'admin' ? '/admin' : redirectTo
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
      const destination = auth?.user?.role === 'admin' ? '/admin' : redirectTo
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
          <p className="auth-eyebrow">Welcome back</p>
          <h1 className="auth-title">Dang nhap</h1>
          <p className="auth-subtitle">Dang nhap de quan ly tour, xem tai khoan va thao tac admin neu ban duoc cap quyen.</p>

          <form onSubmit={handleSubmit} className="auth-form">
            <input
              type="email"
              required
              placeholder="Email"
              value={formData.email}
              onChange={(event) => setFormData((prev) => ({ ...prev, email: event.target.value }))}
              className="auth-input"
            />
            <input
              type="password"
              required
              placeholder="Mat khau"
              value={formData.password}
              onChange={(event) => setFormData((prev) => ({ ...prev, password: event.target.value }))}
              className="auth-input"
            />
            {error && <p style={{ color: '#dc2626' }}>{error}</p>}
            <button type="submit" disabled={loading} className="auth-button">
              {loading ? 'Dang dang nhap...' : 'Dang nhap'}
            </button>
          </form>

          <div style={{ marginTop: '24px', marginBottom: '24px' }}>
            <GoogleAuthButton onCredential={handleGoogleLogin} text="continue_with" />
          </div>

          <p className="auth-footer-text">
            Chua co tai khoan? <Link to="/register" style={{ color: 'var(--primary-color)', fontWeight: 'bold' }}>Dang ky ngay</Link>
          </p>
        </div>
      </main>
      <Footer />
    </div>
  )
}
