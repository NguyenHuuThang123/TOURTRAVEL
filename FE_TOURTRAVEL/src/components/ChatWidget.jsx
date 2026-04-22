import { useEffect, useMemo, useRef, useState } from 'react'
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
  const [conversation, setConversation] = useState(null)
  const [messages, setMessages] = useState([])
  const [draft, setDraft] = useState('')
  const [guestName, setGuestName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [syncing, setSyncing] = useState(false)
  const messagesRef = useRef(null)

  useEffect(() => {
    setSessionKey(getOrCreateSessionKey())
  }, [])

  useEffect(() => {
    if (!sessionKey) return
    loadLatestConversation(false)
  }, [sessionKey, token])

  useEffect(() => {
    if (!sessionKey) return

    const intervalMs = open ? 2000 : 5000
    const timerId = window.setInterval(() => {
      loadLatestConversation(false, true)
    }, intervalMs)

    return () => window.clearInterval(timerId)
  }, [sessionKey, token, open, conversation?.id])

  useEffect(() => {
    if (!open || !messagesRef.current) return
    messagesRef.current.scrollTop = messagesRef.current.scrollHeight
  }, [messages, open])

  const unreadCount = useMemo(() => conversation?.unread_for_customer || 0, [conversation])

  const loadLatestConversation = async (showLoader = true, silent = false) => {
    try {
      if (showLoader) setLoading(true)
      if (silent) setSyncing(true)

      const data = await getMyChatConversations(sessionKey, token)
      if (!data.length) {
        setConversation(null)
        setMessages([])
        setError('')
        return
      }

      const latestConversation = data[0]
      const shouldLoadDetail =
        !conversation ||
        conversation.id !== latestConversation.id ||
        conversation.last_message_at !== latestConversation.last_message_at ||
        (open && latestConversation.unread_for_customer > 0)

      setConversation(latestConversation)

      if (shouldLoadDetail || open) {
        const detail = await getChatConversationDetail(latestConversation.id, sessionKey, token)
        setConversation(detail.conversation)
        setMessages(detail.messages)
      }

      setError('')
    } catch (err) {
      setError(err.response?.data?.detail || 'Khong the dong bo chat luc nay.')
    } finally {
      if (showLoader) setLoading(false)
      if (silent) setSyncing(false)
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!draft.trim()) return

    try {
      setLoading(true)
      setError('')

      let detail
      if (conversation?.id) {
        detail = await sendChatMessage(
          conversation.id,
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
            message: draft.trim()
          },
          token
        )
      }

      setDraft('')
      setConversation(detail.conversation)
      setMessages(detail.messages)
      setOpen(true)
    } catch (err) {
      setError(err.response?.data?.detail || 'Khong gui duoc tin nhan.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={`chat-widget ${open ? 'open' : ''}`}>
      {open && (
        <section className="chat-widget-panel chat-widget-panel-compact">
          <header className="chat-widget-header chat-widget-header-compact">
            <div>
              <strong>TourTravel chat</strong>
              <span>{conversation ? 'Dang hoat dong' : 'Ho tro nhanh'}</span>
            </div>
            <button type="button" onClick={() => setOpen(false)}>−</button>
          </header>

          <div className="chat-widget-main chat-widget-main-compact">
            {!isAuthenticated && !conversation && (
              <div className="chat-widget-guest-fields chat-widget-guest-fields-compact">
                <input
                  placeholder="Ten cua ban"
                  value={guestName}
                  onChange={(event) => setGuestName(event.target.value)}
                />
              </div>
            )}

            <div className="chat-widget-messages chat-widget-messages-compact" ref={messagesRef}>
              {!messages.length && (
                <div className="chat-widget-empty">
                  Hoi ve tour, lich khoi hanh hoac booking. Ben minh se tra loi ngay trong khung nay.
                </div>
              )}

              {messages.map((message) => (
                <article
                  key={message.id}
                  className={`chat-widget-message ${message.sender_type === 'admin' ? 'admin' : 'customer'}`}
                >
                  <p>{message.content}</p>
                  <small>{formatTime(message.created_at)}</small>
                </article>
              ))}
            </div>

            <form className="chat-widget-composer chat-widget-composer-compact" onSubmit={handleSubmit}>
              <textarea
                rows="2"
                placeholder="Nhap tin nhan..."
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
              />
              <button type="submit" disabled={loading || !draft.trim()}>
                Gui
              </button>
            </form>

            <div className="chat-widget-status-row">
              {syncing && <span>Dang cap nhat...</span>}
              {error && <span className="chat-widget-status-error">{error}</span>}
            </div>
          </div>
        </section>
      )}

      <button type="button" className="chat-widget-trigger chat-widget-trigger-compact" onClick={() => setOpen((prev) => !prev)}>
        <span>Chat</span>
        {!!unreadCount && <strong>{unreadCount}</strong>}
      </button>
    </div>
  )
}
