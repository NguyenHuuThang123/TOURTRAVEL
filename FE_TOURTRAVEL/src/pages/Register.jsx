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
      setError(err.response?.data?.detail || 'Dang ky that bai.')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleRegister = async (credential) => {
    try {
      setLoading(true)
      setError('')
      const auth = await googleLogin(credential)
      navigate(auth?.user?.role === 'admin' ? '/admin' : '/account', { replace: true })
    } catch (err) {
      setError(err.response?.data?.detail || 'Dang ky bang Google that bai.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-gray-50)' }}>
      <Header />
      <main style={{ maxWidth: '480px', margin: '0 auto', padding: '48px 20px' }}>
        <div style={authCardStyle}>
          <p style={eyebrowStyle}>Create account</p>
          <h1 style={titleStyle}>Dang ky</h1>
          <p style={subtitleStyle}>Tao tai khoan de dat tour nhanh hon va quan ly thong tin ca nhan.</p>

          <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '16px' }}>
            <input
              required
              placeholder="Ho va ten"
              value={formData.name}
              onChange={(event) => setFormData((prev) => ({ ...prev, name: event.target.value }))}
              style={inputStyle}
            />
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
              {loading ? 'Dang tao tai khoan...' : 'Dang ky'}
            </button>
          </form>

          <GoogleAuthButton onCredential={handleGoogleRegister} text="signup_with" />

          <p style={{ marginTop: '20px' }}>
            Da co tai khoan? <Link to="/login">Dang nhap</Link>
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
