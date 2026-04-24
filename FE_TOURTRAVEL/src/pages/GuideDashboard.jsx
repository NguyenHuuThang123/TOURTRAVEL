import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { useAuth } from '../context/AuthContext'
import {
  getGuideBookings,
  getGuideChatConversationDetail,
  getGuideChatConversations,
  getGuideTours,
  sendGuideChatMessage
} from '../api/tourService'
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
                  </div>
                  <div>{booking.tour_name}</div>
                  <div>{booking.quantity} khach</div>
                  <div>{booking.user_phone}</div>
                  <div>{booking.status}</div>
                </article>
              ))}
              {!bookings.length && !loading && <div className="admin-empty-row">Chua co booking nao cho tour ban quan ly.</div>}
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
