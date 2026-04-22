import { useEffect, useMemo, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import {
  createChatConversation,
  getChatConversationDetail,
  getMyChatConversations,
  sendChatMessage
} from '../api/tourService'

const CHAT_STORAGE_KEY = 'tourtravel_chat_session'

function getOrCreateSessionKey() {
  const saved = localStorage.getItem(CHAT_STORAGE_KEY)
  if (saved) return saved
  const nextKey = `chat_${Math.random().toString(36).slice(2)}${Date.now().toString(36)}`
  localStorage.setItem(CHAT_STORAGE_KEY, nextKey)
  return nextKey
}

function formatTime(value) {
  if (!value) return ''
  return new Date(value).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
}

export default function ChatWidget() {
  const { token, user, isAuthenticated } = useAuth()
  const [open, setOpen] = useState(false)
  const [sessionKey, setSessionKey] = useState('')
  const [conversations, setConversations] = useState([])
  const [activeConversation, setActiveConversation] = useState(null)
  const [messages, setMessages] = useState([])
  const [draft, setDraft] = useState('')
  const [guestName, setGuestName] = useState('')
  const [guestEmail, setGuestEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    setSessionKey(getOrCreateSessionKey())
  }, [])

  useEffect(() => {
    if (!sessionKey) return
    loadConversations(false)
  }, [sessionKey, token])

  useEffect(() => {
    if (!open || !activeConversation?.id) return

    const timerId = window.setInterval(() => {
      loadConversationDetail(activeConversation.id, false)
    }, 10000)

    return () => window.clearInterval(timerId)
  }, [activeConversation?.id, open])

  const unreadCount = useMemo(
    () => conversations.reduce((sum, item) => sum + (item.unread_for_customer || 0), 0),
    [conversations]
  )

  const loadConversations = async (showLoader = true) => {
    try {
      if (showLoader) setLoading(true)
      const data = await getMyChatConversations(sessionKey, token)
      setConversations(data)
      if (!activeConversation && data.length) {
        await loadConversationDetail(data[0].id, false)
      }
      setError('')
    } catch (err) {
      setError(err.response?.data?.detail || 'Khong the tai hoi thoai luc nay.')
    } finally {
      if (showLoader) setLoading(false)
    }
  }

  const loadConversationDetail = async (conversationId, showLoader = true) => {
    try {
      if (showLoader) setLoading(true)
      const detail = await getChatConversationDetail(conversationId, sessionKey, token)
      setActiveConversation(detail.conversation)
      setMessages(detail.messages)
      setConversations((prev) =>
        prev.map((item) => (item.id === detail.conversation.id ? detail.conversation : item))
      )
      setError('')
    } catch (err) {
      setError(err.response?.data?.detail || 'Khong the tai tin nhan.')
    } finally {
      if (showLoader) setLoading(false)
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!draft.trim()) return

    try {
      setLoading(true)
      setError('')

      let detail
      if (activeConversation?.id) {
        detail = await sendChatMessage(
          activeConversation.id,
          {
            session_key: sessionKey,
            content: draft.trim()
          },
          token
        )
      } else {
        detail = await createChatConversation(
          {
            session_key: sessionKey,
            guest_name: isAuthenticated ? undefined : guestName.trim() || undefined,
            guest_email: isAuthenticated ? undefined : guestEmail.trim() || undefined,
            message: draft.trim()
          },
          token
        )
      }

      setDraft('')
      setActiveConversation(detail.conversation)
      setMessages(detail.messages)
      setConversations((prev) => {
        const filtered = prev.filter((item) => item.id !== detail.conversation.id)
        return [detail.conversation, ...filtered]
      })
    } catch (err) {
      setError(err.response?.data?.detail || 'Khong gui duoc tin nhan.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={`chat-widget ${open ? 'open' : ''}`}>
      {open && (
        <section className="chat-widget-panel">
          <header className="chat-widget-header">
            <div>
              <p>Customer support</p>
              <strong>Chat voi TourTravel</strong>
            </div>
            <button type="button" onClick={() => setOpen(false)}>Thu gon</button>
          </header>

          <div className="chat-widget-body">
            <aside className="chat-widget-sidebar">
              <div className="chat-widget-sidebar-head">
                <strong>Hoi thoai</strong>
                <button type="button" onClick={() => loadConversations(false)}>Tai lai</button>
              </div>

              <div className="chat-widget-conversation-list">
                {conversations.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    className={`chat-widget-conversation-item ${activeConversation?.id === item.id ? 'active' : ''}`}
                    onClick={() => loadConversationDetail(item.id)}
                  >
                    <div>
                      <strong>{item.user_name}</strong>
                      <span>{item.last_message_preview}</span>
                    </div>
                    <div className="chat-widget-conversation-meta">
                      <small>{formatTime(item.last_message_at)}</small>
                      {!!item.unread_for_customer && <em>{item.unread_for_customer}</em>}
                    </div>
                  </button>
                ))}

                {!conversations.length && <div className="chat-widget-empty">Chua co hoi thoai nao. Hay gui tin nhan dau tien.</div>}
              </div>
            </aside>

            <div className="chat-widget-main">
              <div className="chat-widget-intro">
                <strong>{activeConversation ? activeConversation.user_name : (user?.name || 'Ban')}</strong>
                <span>
                  {activeConversation ? `Trang thai: ${activeConversation.status}` : 'Nhan vien se phan hoi trong khung chat nay.'}
                </span>
              </div>

              {!isAuthenticated && !activeConversation && (
                <div className="chat-widget-guest-fields">
                  <input
                    placeholder="Ten cua ban"
                    value={guestName}
                    onChange={(event) => setGuestName(event.target.value)}
                  />
                  <input
                    type="email"
                    placeholder="Email lien he (khong bat buoc)"
                    value={guestEmail}
                    onChange={(event) => setGuestEmail(event.target.value)}
                  />
                </div>
              )}

              <div className="chat-widget-messages">
                {messages.map((message) => (
                  <article
                    key={message.id}
                    className={`chat-widget-message ${message.sender_type === 'admin' ? 'admin' : 'customer'}`}
                  >
                    <strong>{message.sender_name}</strong>
                    <p>{message.content}</p>
                    <small>{formatTime(message.created_at)}</small>
                  </article>
                ))}

                {!messages.length && <div className="chat-widget-empty">Chua co tin nhan nao. Ban co the dat cau hoi ve tour, lich khoi hanh hoac booking.</div>}
              </div>

              <form className="chat-widget-composer" onSubmit={handleSubmit}>
                <textarea
                  rows="3"
                  placeholder="Nhap noi dung can ho tro..."
                  value={draft}
                  onChange={(event) => setDraft(event.target.value)}
                />
                <button type="submit" disabled={loading || !draft.trim()}>
                  {loading ? 'Dang gui...' : 'Gui tin nhan'}
                </button>
              </form>

              {error && <div className="chat-widget-error">{error}</div>}
            </div>
          </div>
        </section>
      )}

      <button type="button" className="chat-widget-trigger" onClick={() => setOpen((prev) => !prev)}>
        <span>Chat voi chung toi</span>
        {!!unreadCount && <strong>{unreadCount}</strong>}
      </button>
    </div>
  )
}
