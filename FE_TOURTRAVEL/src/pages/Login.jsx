import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useAuth()
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

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-gray-50)' }}>
      <Header />
      <main style={{ maxWidth: '480px', margin: '0 auto', padding: '48px 20px' }}>
        <div style={authCardStyle}>
          <p style={eyebrowStyle}>Welcome back</p>
          <h1 style={titleStyle}>Dang nhap</h1>
          <p style={subtitleStyle}>Dang nhap de quan ly tour, xem tai khoan va thao tac admin neu ban duoc cap quyen.</p>

          <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '16px' }}>
            <input
              type="email"
              required
              placeholder="Email"
              value={formData.email}
              onChange={(event) => setFormData((prev) => ({ ...prev, email: event.target.value }))}
              style={inputStyle}
            />
            <input
              type="password"
              required
              placeholder="Mat khau"
              value={formData.password}
              onChange={(event) => setFormData((prev) => ({ ...prev, password: event.target.value }))}
              style={inputStyle}
            />
            {error && <p style={{ color: '#dc2626' }}>{error}</p>}
            <button type="submit" disabled={loading} style={primaryButton}>
              {loading ? 'Dang dang nhap...' : 'Dang nhap'}
            </button>
          </form>

          <p style={{ marginTop: '20px' }}>
            Chua co tai khoan? <Link to="/register">Dang ky ngay</Link>
          </p>
        </div>
      </main>
      <Footer />
    </div>
  )
}

const authCardStyle = {
  background: 'linear-gradient(180deg, #ffffff 0%, #f8fbff 100%)',
  borderRadius: '24px',
  padding: '32px',
  border: '1px solid #dbe7ff',
  boxShadow: '0 24px 80px rgba(37, 99, 235, 0.12)'
}

const eyebrowStyle = {
  color: '#2563eb',
  fontWeight: 700,
  textTransform: 'uppercase',
  letterSpacing: '0.08em',
  fontSize: '12px',
  marginBottom: '8px'
}

const titleStyle = {
  fontSize: '36px',
  fontWeight: 800,
  marginBottom: '10px'
}

const subtitleStyle = {
  marginBottom: '20px'
}

const inputStyle = {
  padding: '14px 16px',
  borderRadius: '14px',
  border: '1px solid #cbd5e1'
}

const primaryButton = {
  padding: '14px 18px',
  borderRadius: '14px',
  border: 'none',
  background: 'linear-gradient(135deg, #2563eb 0%, #0f172a 100%)',
  color: 'white',
  fontWeight: 700
}
