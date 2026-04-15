import { useEffect, useRef, useState } from 'react'

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID

export default function GoogleAuthButton({ onCredential, text = 'continue_with' }) {
  const buttonRef = useRef(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (!GOOGLE_CLIENT_ID || !buttonRef.current) return

    let cancelled = false
    let timerId = null

    const renderGoogleButton = () => {
      if (cancelled || !window.google?.accounts?.id || !buttonRef.current) return false

      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: ({ credential }) => {
          if (credential) {
            onCredential(credential)
          }
        }
      })

      buttonRef.current.innerHTML = ''
      window.google.accounts.id.renderButton(buttonRef.current, {
        theme: 'outline',
        size: 'large',
        shape: 'pill',
        text,
        width: 384
      })
      setReady(true)
      return true
    }

    if (!renderGoogleButton()) {
      timerId = window.setInterval(() => {
        if (renderGoogleButton()) {
          window.clearInterval(timerId)
        }
      }, 250)
    }

    return () => {
      cancelled = true
      if (timerId) {
        window.clearInterval(timerId)
      }
    }
  }, [onCredential, text])

  if (!GOOGLE_CLIENT_ID) {
    return <p style={helperStyle}>Can cau hinh `VITE_GOOGLE_CLIENT_ID` de bat Google Sign-In.</p>
  }

  return (
    <div style={{ display: 'grid', gap: '10px' }}>
      <div style={dividerStyle}>
        <span>hoac</span>
      </div>
      <div ref={buttonRef} style={{ minHeight: '44px', opacity: ready ? 1 : 0.7 }} />
    </div>
  )
}

const dividerStyle = {
  position: 'relative',
  textAlign: 'center',
  color: '#64748b',
  fontSize: '13px'
}

const helperStyle = {
  marginTop: '14px',
  color: '#64748b',
  fontSize: '13px'
}
