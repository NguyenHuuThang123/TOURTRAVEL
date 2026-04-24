import { useEffect, useMemo, useRef, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import {
  createChatConversation,
  getChatConversationDetail,
  getMyChatConversations,
  sendChatMessage
} from '../api/tourService'
import { formatVietnamTime } from '../utils/datetime'

const CHAT_STORAGE_KEY = 'tourtravel_chat_session'
const CHAT_GUEST_NAME_KEY = 'tourtravel_chat_guest_name'

function buildChatStorageKey(user) {
  if (user?.id) {
    return `${CHAT_STORAGE_KEY}_user_${user.id}`
  }

  return `${CHAT_STORAGE_KEY}_guest`
}

function getStorageForChat(user) {
  return user?.id ? window.localStorage : window.sessionStorage
}

function getOrCreateSessionKey(user) {
  const storage = getStorageForChat(user)
  const storageKey = buildChatStorageKey(user)
  const saved = storage.getItem(storageKey)
  if (saved) return saved
  const nextKey = `chat_${Math.random().toString(36).slice(2)}${Date.now().toString(36)}`
  storage.setItem(storageKey, nextKey)
  return nextKey
}

function createFreshGuestSessionKey() {
  const nextKey = `chat_${Math.random().toString(36).slice(2)}${Date.now().toString(36)}`
  window.sessionStorage.setItem(buildChatStorageKey(null), nextKey)
  return nextKey
}

function formatTime(value) {
  return formatVietnamTime(value, 'vi-VN', { hour: '2-digit', minute: '2-digit' })
}

function labelForSender(message) {
  if (message.sender_type === 'guide') return 'Guide'
  if (message.sender_type === 'admin') return 'Admin'
  return 'Ban'
}

export default function ChatWidget() {
  const { token, user, isAuthenticated } = useAuth()
  const [open, setOpen] = useState(false)
  const [sessionKey, setSessionKey] = useState('')
  const [conversations, setConversations] = useState([])
  const [conversation, setConversation] = useState(null)
  const [activeTour, setActiveTour] = useState(null)
  const [messages, setMessages] = useState([])
  const [draft, setDraft] = useState('')
  const [guestName, setGuestName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [syncing, setSyncing] = useState(false)
  const messagesRef = useRef(null)

  useEffect(() => {
    setSessionKey(getOrCreateSessionKey(user))
  }, [user?.id])

  useEffect(() => {
    if (isAuthenticated) {
      window.sessionStorage.removeItem(CHAT_GUEST_NAME_KEY)
    }
  }, [isAuthenticated])

  useEffect(() => {
    const handleOpenGuideChat = (event) => {
      const detail = event.detail || {}
      const nextTour = detail.tourId ? { tourId: detail.tourId, guideName: detail.guideName || '' } : null
      setActiveTour(nextTour)
      setOpen(true)
      if (nextTour?.tourId) {
        loadLatestConversation(false, false, nextTour.tourId)
      }
    }

    window.addEventListener('tourtravel:open-guide-chat', handleOpenGuideChat)
    return () => window.removeEventListener('tourtravel:open-guide-chat', handleOpenGuideChat)
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

  const unreadCount = useMemo(
    () => conversations.reduce((sum, item) => sum + Number(item.unread_for_customer || 0), 0),
    [conversations]
  )

  const loadLatestConversation = async (showLoader = true, silent = false, preferredTourId = null) => {
    try {
      if (showLoader) setLoading(true)
      if (silent) setSyncing(true)

      const data = await getMyChatConversations(sessionKey, token)
      setConversations(data)
      if (!data.length) {
        setConversation(null)
        setMessages([])
        setError('')
        return
      }

      const selectedConversation =
        (preferredTourId && data.find((item) => item.tour_id === preferredTourId)) ||
        (activeTour?.tourId && data.find((item) => item.tour_id === activeTour.tourId)) ||
        (conversation?.id && data.find((item) => item.id === conversation.id)) ||
        data[0]

      const shouldLoadDetail =
        !conversation ||
        conversation.id !== selectedConversation.id ||
        conversation.last_message_at !== selectedConversation.last_message_at ||
        (open && selectedConversation.unread_for_customer > 0)

      setConversation(selectedConversation)

      if (shouldLoadDetail || open) {
        const detail = await getChatConversationDetail(selectedConversation.id, sessionKey, token)
        setConversation(detail.conversation)
        setMessages(detail.messages)
        setConversations((prev) => prev.map((item) => (item.id === detail.conversation.id ? detail.conversation : item)))
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
      const targetConversation =
        (activeTour?.tourId && conversations.find((item) => item.tour_id === activeTour.tourId)) ||
        (!activeTour?.tourId ? conversation : null)

      if (targetConversation?.id) {
        detail = await sendChatMessage(
          targetConversation.id,
          {
            session_key: sessionKey,
            content: draft.trim()
          },
          token
        )
      } else {
        let nextSessionKey = sessionKey
        if (!isAuthenticated) {
          const normalizedGuestName = guestName.trim()
          const previousGuestName = window.sessionStorage.getItem(CHAT_GUEST_NAME_KEY) || ''
          if (normalizedGuestName && normalizedGuestName !== previousGuestName) {
            nextSessionKey = createFreshGuestSessionKey()
            setSessionKey(nextSessionKey)
            setConversation(null)
            setMessages([])
            setConversations([])
            window.sessionStorage.setItem(CHAT_GUEST_NAME_KEY, normalizedGuestName)
          }
        }

        detail = await createChatConversation(
          {
            session_key: nextSessionKey,
            guest_name: isAuthenticated ? undefined : guestName.trim() || undefined,
            tour_id: activeTour?.tourId,
            message: draft.trim()
          },
          token
        )
      }

      setDraft('')
      setConversation(detail.conversation)
      setMessages(detail.messages)
      setConversations((prev) => {
        const filtered = prev.filter((item) => item.id !== detail.conversation.id)
        return [detail.conversation, ...filtered]
      })
      setActiveTour(null)
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
                  {activeTour?.guideName
                    ? `Ban dang nhan tin cho ${activeTour.guideName}. Hay dat cau hoi ve tour nay.`
                    : 'Hoi ve tour, lich khoi hanh hoac booking. Ben minh se tra loi ngay trong khung nay.'}
                </div>
              )}

              {messages.map((message) => (
                <article
                  key={message.id}
                  className={`chat-widget-message ${message.sender_type}`}
                >
                  <strong>{labelForSender(message)}</strong>
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
