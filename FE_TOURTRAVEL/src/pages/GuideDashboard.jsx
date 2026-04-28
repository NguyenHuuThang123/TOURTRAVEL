import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { useAuth } from '../context/AuthContext'
import {
  guideCheckInBooking,
  getGuideBookings,
  getGuideChatConversationDetail,
  getGuideChatConversations,
  getGuideTours,
  sendGuideChatMessage
} from '../api/tourService'
import { formatCurrency } from '../utils/currency'
import { formatVietnamDateTime } from '../utils/datetime'

function formatDate(value) {
  return formatVietnamDateTime(value) || '-'
}

function bubbleClass(senderType) {
  if (senderType === 'customer') return 'customer'
  if (senderType === 'guide') return 'guide'
  return 'admin'
}

function senderLabel(senderType) {
  if (senderType === 'guide') return 'Guide'
  if (senderType === 'admin') return 'Admin'
  return 'Customer'
}

const bookingStatusLabel = {
  confirmed: 'Da xac nhan',
  cancelled: 'Da huy',
  pending: 'Cho xu ly'
}

export default function GuideDashboard() {
  const { token, user, logout } = useAuth()
  const [activeSection, setActiveSection] = useState('overview')
  const [tours, setTours] = useState([])
  const [bookings, setBookings] = useState([])
  const [conversations, setConversations] = useState([])
  const [activeChat, setActiveChat] = useState(null)
  const [chatReply, setChatReply] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [scanInput, setScanInput] = useState('')
  const [scanBusy, setScanBusy] = useState(false)
  const [scanResult, setScanResult] = useState(null)
  const [scannerNotice, setScannerNotice] = useState('')
  const [cameraEnabled, setCameraEnabled] = useState(false)
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const scanLockRef = useRef(false)
  const lastScanRef = useRef({ value: '', time: 0 })

  const hasNativeQrScanner = typeof window !== 'undefined' && 'BarcodeDetector' in window
  const hasCameraAccess = typeof navigator !== 'undefined' && !!navigator.mediaDevices?.getUserMedia

  useEffect(() => {
    if (token) {
      loadData()
    }
  }, [token])

  useEffect(() => {
    if (!token || activeSection !== 'messages') return

    const timerId = window.setInterval(async () => {
      try {
        const latestConversations = await getGuideChatConversations(token)
        setConversations(latestConversations)

        if (activeChat?.conversation?.id) {
          const detail = await getGuideChatConversationDetail(activeChat.conversation.id, token)
          setActiveChat(detail)
        } else if (latestConversations.length) {
          const detail = await getGuideChatConversationDetail(latestConversations[0].id, token)
          setActiveChat(detail)
        }
      } catch {
        // Keep current UI stable if background sync fails.
      }
    }, 2000)

    return () => window.clearInterval(timerId)
  }, [activeSection, activeChat?.conversation?.id, token])

  useEffect(() => {
    if (activeSection !== 'checkin') {
      setCameraEnabled(false)
    }
  }, [activeSection])

  useEffect(() => {
    if (activeSection !== 'checkin' || !cameraEnabled) return undefined

    if (!hasCameraAccess) {
      setScannerNotice('Trinh duyet nay khong ho tro camera. Ban van co the dan noi dung QR hoac ma booking ben duoi.')
      setCameraEnabled(false)
      return undefined
    }

    if (!hasNativeQrScanner) {
      setScannerNotice('Camera da san sang nhung trinh duyet chua ho tro quet QR native. Hay dan noi dung QR hoac ma booking de check-in.')
      setCameraEnabled(false)
      return undefined
    }

    let stream
    let intervalId
    let cancelled = false

    const startScanner = async () => {
      try {
        setScannerNotice('Dang khoi dong camera quet QR...')
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: 'environment' } },
          audio: false
        })

        if (cancelled || !videoRef.current) return

        videoRef.current.srcObject = stream
        await videoRef.current.play()
        setScannerNotice('Dua ma QR vao khung hinh. He thong se tu dong check-in khi doc duoc ma hop le.')

        const detector = new window.BarcodeDetector({ formats: ['qr_code'] })
        intervalId = window.setInterval(async () => {
          if (scanLockRef.current || !videoRef.current || !canvasRef.current) return
          if (videoRef.current.readyState < 2) return

          const canvas = canvasRef.current
          const context = canvas.getContext('2d')
          if (!context) return

          canvas.width = videoRef.current.videoWidth || 720
          canvas.height = videoRef.current.videoHeight || 540
          context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height)

          const codes = await detector.detect(canvas)
          const rawValue = codes?.[0]?.rawValue?.trim()
          if (!rawValue) return

          const now = Date.now()
          if (lastScanRef.current.value === rawValue && now - lastScanRef.current.time < 5000) return
          lastScanRef.current = { value: rawValue, time: now }
          await handleCheckIn(rawValue, true)
        }, 900)
      } catch (err) {
        setScannerNotice(
          err?.name === 'NotAllowedError'
            ? 'Camera bi tu choi quyen truy cap. Ban co the cap quyen camera hoac dan noi dung QR vao o nhap.'
            : 'Khong the bat camera tren thiet bi nay. Ban van co the check-in bang noi dung QR hoac ma booking.'
        )
        setCameraEnabled(false)
      }
    }

    startScanner()

    return () => {
      cancelled = true
      if (intervalId) window.clearInterval(intervalId)
      if (videoRef.current?.srcObject) {
        const tracks = videoRef.current.srcObject.getTracks?.() || []
        tracks.forEach((track) => track.stop())
        videoRef.current.srcObject = null
      }
      if (stream) {
        stream.getTracks().forEach((track) => track.stop())
      }
    }
  }, [activeSection, cameraEnabled, hasCameraAccess, hasNativeQrScanner])

  const loadData = async () => {
    try {
      setLoading(true)
      const [tourData, bookingData, chatData] = await Promise.all([
        getGuideTours(token),
        getGuideBookings(token),
        getGuideChatConversations(token)
      ])
      setTours(tourData)
      setBookings(bookingData)
      setConversations(chatData)
      if (chatData.length) {
        const detail = await getGuideChatConversationDetail(chatData[0].id, token)
        setActiveChat(detail)
      } else {
        setActiveChat(null)
      }
      setError('')
    } catch (err) {
      setError(err.response?.data?.detail || 'Khong the tai du lieu huong dan vien.')
    } finally {
      setLoading(false)
    }
  }

  const stats = useMemo(() => {
    const confirmedGuests = bookings
      .filter((item) => item.status === 'confirmed')
      .reduce((sum, item) => sum + Number(item.quantity || 0), 0)

    return [
      { label: 'Tours assigned', value: tours.length },
      { label: 'Travelers', value: confirmedGuests },
      { label: 'Open chats', value: conversations.filter((item) => item.status === 'open').length }
    ]
  }, [bookings, conversations, tours])

  const handleOpenChat = async (conversationId) => {
    try {
      setLoading(true)
      const detail = await getGuideChatConversationDetail(conversationId, token)
      setActiveChat(detail)
      setError('')
    } catch (err) {
      setError(err.response?.data?.detail || 'Khong the mo hoi thoai nay.')
    } finally {
      setLoading(false)
    }
  }

  const handleSendReply = async (event) => {
    event.preventDefault()
    if (!activeChat?.conversation?.id || !chatReply.trim()) return

    try {
      setError('')
      setMessage('')
      const detail = await sendGuideChatMessage(activeChat.conversation.id, { content: chatReply.trim() }, token)
      setActiveChat(detail)
      setChatReply('')
      setMessage('Da gui tin nhan cho khach hang.')
      setConversations((prev) => {
        const next = prev.filter((item) => item.id !== detail.conversation.id)
        return [detail.conversation, ...next]
      })
    } catch (err) {
      setError(err.response?.data?.detail || 'Khong the gui tin nhan.')
    }
  }

  const syncCheckedInBooking = (updatedBooking) => {
    setBookings((prev) => prev.map((item) => (item.id === updatedBooking.id ? updatedBooking : item)))
  }

  const handleCheckIn = async (rawContent = scanInput, fromCamera = false) => {
    const value = rawContent.trim()
    if (!value || scanBusy) return

    try {
      scanLockRef.current = true
      setScanBusy(true)
      setError('')
      setMessage('')
      const result = await guideCheckInBooking(value, token)
      setScanResult(result)
      setScanInput(value)
      syncCheckedInBooking(result.booking)
      setMessage(
        result.checkin_status === 'checked_in_now'
          ? `Check-in thanh cong cho ${result.booking.user_name}.`
          : `${result.booking.user_name} da duoc check-in truoc do.`
      )
      if (fromCamera) {
        setScannerNotice('Da doc ma thanh cong. Ban co the giu camera de quet tiep hoac tat camera de xem chi tiet.')
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'Khong the check-in booking nay.')
    } finally {
      setScanBusy(false)
      window.setTimeout(() => {
        scanLockRef.current = false
      }, 1200)
    }
  }

  return (
    <div className="guide-shell">
      <Header />

      <main className="container guide-main">
        <section className="guide-hero">
          <div>
            <p className="account-eyebrow">Guide panel</p>
            <h1>{user?.guide_title || 'Huong dan vien'}</h1>
            <p>
              Theo doi tour duoc giao, danh sach khach va trao doi truc tiep voi khach hang ngay trong mot bang dieu khien.
            </p>
          </div>

          <div className="guide-hero-card">
            <strong>{user?.name}</strong>
            <span>{user?.guide_experience_years ? `${user.guide_experience_years} nam kinh nghiem` : 'Guide team'}</span>
            <button type="button" className="admin-ghost-btn" onClick={logout}>Dang xuat</button>
          </div>
        </section>

        <section className="guide-stat-row">
          {stats.map((item) => (
            <article key={item.label} className="account-stat-card">
              <span>{item.label}</span>
              <strong>{item.value}</strong>
            </article>
          ))}
        </section>

        <section className="guide-tabs">
          <button type="button" className={activeSection === 'overview' ? 'active' : ''} onClick={() => setActiveSection('overview')}>Overview</button>
          <button type="button" className={activeSection === 'travelers' ? 'active' : ''} onClick={() => setActiveSection('travelers')}>Travelers</button>
          <button type="button" className={activeSection === 'checkin' ? 'active' : ''} onClick={() => setActiveSection('checkin')}>QR Check-in</button>
          <button type="button" className={activeSection === 'messages' ? 'active' : ''} onClick={() => setActiveSection('messages')}>Messages</button>
        </section>

        {(loading || error || message) && (
          <section className="admin-feedback-bar">
            {loading && <span>Dang tai du lieu...</span>}
            {message && <span className="ok">{message}</span>}
            {error && <span className="err">{error}</span>}
          </section>
        )}

        {activeSection === 'overview' && (
          <section className="guide-grid">
            <div className="guide-panel">
              <div className="guide-panel-head">
                <h2>Tours cua ban</h2>
                <span>{tours.length} tour</span>
              </div>
              <div className="guide-tour-list">
                {tours.map((tour) => (
                  <article key={tour.id} className="guide-tour-card">
                    <div>
                      <strong>{tour.name}</strong>
                      <p>{tour.destination}</p>
                    </div>
                    <div>
                      <span>{tour.available_slots}/{tour.max_participants} cho</span>
                      <small>{formatDate(tour.start_date)}</small>
                    </div>
                  </article>
                ))}
                {!tours.length && !loading && <div className="admin-empty-row">Chua co tour nao duoc gan cho ban.</div>}
              </div>
            </div>

            <div className="guide-panel">
              <div className="guide-panel-head">
                <h2>Ho so huong dan vien</h2>
              </div>
              <div className="guide-profile-card">
                <img src={user?.guide_avatar || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120'} alt={user?.name} />
                <div>
                  <strong>{user?.name}</strong>
                  <p>{user?.guide_title || 'Guide'}</p>
                  <span>{user?.guide_bio || 'Cap nhat thong tin guide trong User Editor.'}</span>
                </div>
              </div>
            </div>
          </section>
        )}

        {activeSection === 'travelers' && (
          <section className="guide-panel">
            <div className="guide-panel-head">
              <h2>Danh sach khach cua tour ban</h2>
            </div>
            <div className="guide-traveler-table">
              <div className="guide-traveler-head">
                <span>Khach hang</span>
                <span>Tour</span>
                <span>So luong</span>
                <span>Lien he</span>
                <span>Trang thai</span>
              </div>
              {bookings.map((booking) => (
                <article key={booking.id} className="guide-traveler-row">
                  <div>
                    <strong>{booking.user_name}</strong>
                    <small>{booking.user_email}</small>
                    {booking.checked_in_at && <small className="guide-checkin-inline">Check-in: {formatDate(booking.checked_in_at)}</small>}
                  </div>
                  <div>{booking.tour_name}</div>
                  <div>{booking.quantity} khach</div>
                  <div>{booking.user_phone}</div>
                  <div>
                    <span>{bookingStatusLabel[booking.status] || booking.status}</span>
                    <small className={`guide-checkin-badge ${booking.checked_in_at ? 'done' : 'pending'}`}>
                      {booking.checked_in_at ? 'Da check-in' : 'Chua check-in'}
                    </small>
                  </div>
                </article>
              ))}
              {!bookings.length && !loading && <div className="admin-empty-row">Chua co booking nao cho tour ban quan ly.</div>}
            </div>
          </section>
        )}

        {activeSection === 'checkin' && (
          <section className="guide-grid">
            <div className="guide-panel">
              <div className="guide-panel-head">
                <div>
                  <h2>Quet ma QR cua khach</h2>
                  <span>Camera tu dong doc QR check-in, hoac dan booking id de doi chieu nhanh.</span>
                </div>
                <button
                  type="button"
                  className="admin-ghost-btn"
                  onClick={() => setCameraEnabled((prev) => !prev)}
                >
                  {cameraEnabled ? 'Tat camera' : 'Bat camera'}
                </button>
              </div>

              <div className="guide-scanner-body">
                <div className={`guide-scanner-frame ${cameraEnabled ? 'live' : ''}`}>
                  <video ref={videoRef} muted playsInline />
                  {!cameraEnabled && (
                    <div className="guide-scanner-placeholder">
                      <strong>QR Check-in</strong>
                      <p>Bat camera de quet truc tiep tu dien thoai cua khach.</p>
                    </div>
                  )}
                </div>
                <canvas ref={canvasRef} hidden />
                <p className="guide-scanner-note">{scannerNotice || 'Ban co the quet QR, dan link check-in, JSON QR, hoac nhap truc tiep booking id.'}</p>

                <form
                  className="guide-scanner-form"
                  onSubmit={(event) => {
                    event.preventDefault()
                    handleCheckIn()
                  }}
                >
                  <textarea
                    rows="4"
                    placeholder="Dan noi dung QR, link check-in hoac booking id vao day..."
                    value={scanInput}
                    onChange={(event) => setScanInput(event.target.value)}
                  />
                  <button type="submit" className="admin-green-btn" disabled={!scanInput.trim() || scanBusy}>
                    {scanBusy ? 'Dang xu ly...' : 'Check-in booking'}
                  </button>
                </form>
              </div>
            </div>

            <div className="guide-panel">
              <div className="guide-panel-head">
                <h2>Thong tin sau khi quet</h2>
                <span>{scanResult?.matched_via ? `Nhan dien qua ${scanResult.matched_via}` : 'Chua co ket qua'}</span>
              </div>

              <div className="guide-checkin-result">
                {!scanResult && <div className="admin-empty-row">Quet QR cua khach de hien thong tin booking va trang thai check-in.</div>}

                {scanResult && (
                  <>
                    <div className={`guide-result-banner ${scanResult.checkin_status}`}>
                      <strong>
                        {scanResult.checkin_status === 'checked_in_now' ? 'Check-in vua duoc ghi nhan' : 'Khach da check-in truoc do'}
                      </strong>
                      <span>
                        {scanResult.booking.checked_in_at
                          ? `Thoi gian: ${formatDate(scanResult.booking.checked_in_at)}`
                          : 'Chua co moc thoi gian check-in'}
                      </span>
                    </div>

                    <div className="guide-result-grid">
                      <div>
                        <span>Khach hang</span>
                        <strong>{scanResult.booking.user_name}</strong>
                        <small>{scanResult.booking.user_email}</small>
                      </div>
                      <div>
                        <span>Booking</span>
                        <strong>{scanResult.booking.id}</strong>
                        <small>{bookingStatusLabel[scanResult.booking.status] || scanResult.booking.status}</small>
                      </div>
                      <div>
                        <span>Tour</span>
                        <strong>{scanResult.booking.tour_name}</strong>
                        <small>{scanResult.booking.tour_destination || 'Dang cap nhat'}</small>
                      </div>
                      <div>
                        <span>Lich khoi hanh</span>
                        <strong>{scanResult.booking.start_date ? formatDate(scanResult.booking.start_date) : '-'}</strong>
                        <small>{scanResult.booking.quantity} khach</small>
                      </div>
                      <div>
                        <span>Lien he</span>
                        <strong>{scanResult.booking.user_phone}</strong>
                        <small>{formatCurrency(scanResult.booking.total_price)}</small>
                      </div>
                      <div>
                        <span>Guide xac nhan</span>
                        <strong>{scanResult.booking.checked_in_by_guide_name || user?.name || 'Guide'}</strong>
                        <small>{scanResult.booking.checked_in_at ? formatDate(scanResult.booking.checked_in_at) : 'Dang cho quet'}</small>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </section>
        )}

        {activeSection === 'messages' && (
          <section className="guide-message-layout">
            <div className="guide-panel">
              <div className="guide-panel-head">
                <h2>Hoi thoai voi khach</h2>
              </div>
              <div className="guide-conversation-list">
                {conversations.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    className={`admin-chat-list-item ${activeChat?.conversation?.id === item.id ? 'active' : ''}`}
                    onClick={() => handleOpenChat(item.id)}
                  >
                    <div>
                      <strong>{item.user_name}</strong>
                      <span>{item.tour_name || 'Tour duoc gan'}</span>
                      <p>{item.last_message_preview}</p>
                    </div>
                    <div className="admin-chat-item-side">
                      <small>{formatDate(item.last_message_at)}</small>
                      {!!item.unread_for_guide && <em>{item.unread_for_guide} moi</em>}
                    </div>
                  </button>
                ))}
                {!conversations.length && !loading && <div className="admin-empty-row">Chua co khach nao nhan tin cho ban.</div>}
              </div>
            </div>

            <div className="guide-panel guide-chat-panel">
              <div className="guide-panel-head">
                <h2>{activeChat?.conversation?.user_name || 'Chon hoi thoai'}</h2>
                <span>{activeChat?.conversation?.tour_name || 'Tin nhan khach hang'}</span>
              </div>
              <div className="admin-chat-messages">
                {activeChat?.messages?.map((item) => (
                  <article key={item.id} className={`admin-chat-bubble ${bubbleClass(item.sender_type)}`}>
                    <strong>{senderLabel(item.sender_type)} • {item.sender_name}</strong>
                    <p>{item.content}</p>
                    <small>{formatDate(item.created_at)}</small>
                  </article>
                ))}
                {!activeChat?.messages?.length && <div className="admin-empty-row">Chon mot hoi thoai de bat dau phan hoi.</div>}
              </div>

              <form className="admin-chat-compose" onSubmit={handleSendReply}>
                <textarea
                  rows="4"
                  placeholder="Nhan tin cho khach hang..."
                  value={chatReply}
                  onChange={(event) => setChatReply(event.target.value)}
                />
                <button type="submit" className="admin-green-btn" disabled={!activeChat?.conversation?.id || !chatReply.trim()}>
                  Gui tin nhan
                </button>
              </form>
            </div>
          </section>
        )}

        <section className="guide-note">
          <p>Guide chi co quyen quan ly tour duoc gan va thong tin khach hang lien quan. Chuc nang dat tour da bi vo hieu hoa cho role nay.</p>
          <Link to="/tours" className="account-secondary-link">Xem trang cong khai</Link>
        </section>
      </main>

      <Footer />
    </div>
  )
}
