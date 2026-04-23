import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { getMyTourReview, getTourById, getTourReviews, upsertMyTourReview } from '../api/tourService'
import { useAuth } from '../context/AuthContext'
import { formatCurrency } from '../utils/currency'

export default function TourDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user, token, isAuthenticated } = useAuth()
  const [tour, setTour] = useState(null)
  const [reviews, setReviews] = useState([])
  const [myReview, setMyReview] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' })
  const [reviewError, setReviewError] = useState('')
  const [reviewMessage, setReviewMessage] = useState('')
  const [reviewSubmitting, setReviewSubmitting] = useState(false)

  useEffect(() => {
    const loadTour = async () => {
      try {
        setLoading(true)
        const [tourData, reviewData] = await Promise.all([
          getTourById(id),
          getTourReviews(id)
        ])
        setTour(tourData)
        setReviews(reviewData)
        setError('')
      } catch (err) {
        setError(err.response?.data?.detail || 'Khong tim thay tour.')
      } finally {
        setLoading(false)
      }
    }

    loadTour()
  }, [id])

  useEffect(() => {
    if (!isAuthenticated || !token) {
      setMyReview(null)
      setReviewForm({ rating: 5, comment: '' })
      return
    }

    getMyTourReview(id, token)
      .then((review) => {
        setMyReview(review)
        if (review) {
          setReviewForm({ rating: review.rating, comment: review.comment })
        } else {
          setReviewForm({ rating: 5, comment: '' })
        }
      })
      .catch(() => {
        setMyReview(null)
        setReviewForm({ rating: 5, comment: '' })
      })
  }, [id, isAuthenticated, token])

  if (loading) {
    return <div style={{ padding: '40px' }}>Dang tai chi tiet tour...</div>
  }

  if (error || !tour) {
    return (
      <div style={{ padding: '40px' }}>
        <p style={{ color: '#dc2626' }}>{error || 'Khong tim thay tour.'}</p>
        <Link to="/tours">Quay lai danh sach tour</Link>
      </div>
    )
  }

  const total = quantity * tour.price
  const ratingAverage = Number(tour.rating_average || 0)
  const reviewCount = Number(tour.review_count || 0)
  const guide = tour.guide_name
    ? {
        name: tour.guide_name,
        title: tour.guide_title || 'Verified Guide',
        experience: tour.guide_experience_years ? `${tour.guide_experience_years} years experience` : 'Guide team',
        avatar: tour.guide_avatar || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120',
        bio: tour.guide_bio || 'Your assigned guide will support the group before and during the trip.'
      }
    : null
  const quickInfo = [
    { label: 'Duration', value: `${tour.duration_days} Days`, icon: '◔' },
    { label: 'Group Size', value: `Max ${tour.max_participants}`, icon: '⌘' },
    { label: 'Activity Level', value: 'Moderate', icon: '↟' },
    { label: 'Language', value: 'English, German', icon: '◎' }
  ]

  const handleMessageGuide = () => {
    window.dispatchEvent(
      new CustomEvent('tourtravel:open-guide-chat', {
        detail: {
          tourId: tour.id,
          guideName: tour.guide_name
        }
      })
    )
  }

  const handleReviewSubmit = async (event) => {
    event.preventDefault()
    if (!token) {
      navigate('/login')
      return
    }

    try {
      setReviewSubmitting(true)
      setReviewError('')
      setReviewMessage('')
      const hadReview = Boolean(myReview)

      const savedReview = await upsertMyTourReview(
        id,
        { rating: reviewForm.rating, comment: reviewForm.comment.trim() },
        token
      )

      const latestReviews = await getTourReviews(id)
      const latestTour = await getTourById(id)

      setMyReview(savedReview)
      setReviews(latestReviews)
      setTour(latestTour)
      setReviewMessage(hadReview ? 'Da cap nhat danh gia cua ban.' : 'Cam on ban da gui danh gia.')
    } catch (err) {
      setReviewError(err.response?.data?.detail || 'Khong the gui danh gia luc nay.')
    } finally {
      setReviewSubmitting(false)
    }
  }

  const renderStars = (value) => '★★★★★'.slice(0, value) + '☆☆☆☆☆'.slice(0, 5 - value)
  const canReview = user?.role === 'user'

  return (
    <div className="tour-detail-shell">
      <Header />

      <main className="container tour-detail-main">
        <section className="tour-detail-hero">
          <div
            className="tour-detail-hero-image"
            style={{ backgroundImage: `url(${tour.image || 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1400'})` }}
          >
            <div className="tour-detail-overlay" />
            <div className="tour-detail-hero-content">
              <div className="tour-detail-tags">
                <span>Most Popular</span>
                <span>Eco-Certified</span>
              </div>
              <h1>{tour.name}</h1>
              <div className="tour-detail-rating">
                <span>
                  ★ {reviewCount ? ratingAverage.toFixed(1) : 'New'} ({reviewCount} Reviews)
                </span>
                <span>◉ {tour.destination}</span>
              </div>
            </div>
          </div>
        </section>

        <div className="tour-detail-layout">
          <section className="tour-detail-content">
            <div className="tour-quick-grid">
              {quickInfo.map((item) => (
                <article key={item.label} className="tour-quick-card">
                  <span className="tour-quick-icon">{item.icon}</span>
                  <p>{item.label}</p>
                  <strong>{item.value}</strong>
                </article>
              ))}
            </div>

            {guide && (
              <section className="tour-guide-section">
                <h2>Meet your guide</h2>
                <div className="tour-guide-card">
                  <div className="tour-guide-profile">
                    <img src={guide.avatar} alt={guide.name} />
                    <div>
                      <strong>{guide.name}</strong>
                      <p>{guide.title} • {guide.experience}</p>
                      <div className="tour-guide-links">
                        <button type="button" onClick={handleMessageGuide}>Message Guide</button>
                        <span>Verified Guide</span>
                      </div>
                      <p>{guide.bio}</p>
                    </div>
                  </div>
                </div>
              </section>
            )}

            <section className="tour-overview-section">
              <h2>Overview</h2>
              <p>{tour.description}</p>
            </section>

            <section className="tour-reviews-section">
              <div className="tour-reviews-header">
                <div>
                  <h2>Reviews & Ratings</h2>
                  <p>Khach hang co the chia se trai nghiem sau khi dat tour thanh cong.</p>
                </div>
                <div className="tour-review-summary-card">
                  <strong>{reviewCount ? ratingAverage.toFixed(1) : '0.0'}</strong>
                  <span>{renderStars(Math.round(ratingAverage || 0))}</span>
                  <small>{reviewCount} danh gia</small>
                </div>
              </div>

              <div className="tour-reviews-layout">
                <form className="tour-review-form" onSubmit={handleReviewSubmit}>
                  <h3>{myReview ? 'Cap nhat danh gia cua ban' : 'Gui danh gia cua ban'}</h3>
                  <p className="tour-review-form-note">
                    {!isAuthenticated
                      ? 'Dang nhap de gui nhan xet va xep hang bang sao.'
                      : canReview
                        ? 'Ban co the chon tu 1 den 5 sao va de lai binh luan ngan gon.'
                        : 'Chi tai khoan khach hang moi co the gui danh gia.'}
                  </p>

                  <div className="tour-review-stars-input" role="radiogroup" aria-label="Tour rating">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        className={star <= reviewForm.rating ? 'active' : ''}
                        onClick={() => setReviewForm((prev) => ({ ...prev, rating: star }))}
                        disabled={!isAuthenticated || !canReview || reviewSubmitting}
                      >
                        ★
                      </button>
                    ))}
                  </div>

                  <label className="tour-review-textarea">
                    <span>Binh luan</span>
                    <textarea
                      value={reviewForm.comment}
                      onChange={(event) => setReviewForm((prev) => ({ ...prev, comment: event.target.value }))}
                      placeholder="Chia se dieu ban thich, luu y cho nguoi di sau, chat luong huong dan vien..."
                      rows="5"
                      disabled={!isAuthenticated || !canReview || reviewSubmitting}
                    />
                  </label>

                  {reviewError && <div className="tour-review-feedback error">{reviewError}</div>}
                  {reviewMessage && <div className="tour-review-feedback ok">{reviewMessage}</div>}

                  <button
                    type="submit"
                    className="tour-review-submit"
                    disabled={!isAuthenticated || !canReview || reviewSubmitting}
                  >
                    {reviewSubmitting ? 'Dang gui...' : myReview ? 'Cap nhat danh gia' : 'Gui danh gia'}
                  </button>
                </form>

                <div className="tour-review-list">
                  {reviews.length === 0 ? (
                    <div className="tour-review-empty">
                      Chua co binh luan nao. Hoi vien dat tour dau tien co the mo man phan danh gia nay.
                    </div>
                  ) : (
                    reviews.map((review) => (
                      <article key={review.id} className="tour-review-card">
                        <div className="tour-review-card-head">
                          <div>
                            <strong>{review.user_name}</strong>
                            <span>{new Date(review.updated_at).toLocaleDateString()}</span>
                          </div>
                          <div className="tour-review-card-rating">
                            <span>{renderStars(review.rating)}</span>
                            <strong>{review.rating}.0</strong>
                          </div>
                        </div>
                        <p>{review.comment}</p>
                      </article>
                    ))
                  )}
                </div>
              </div>
            </section>
          </section>

          <aside className="tour-booking-column">
            <div className="tour-booking-card">
              <div className="tour-booking-price">
                <div>
                  <strong>{formatCurrency(tour.price)}</strong>
                  <span>/ nguoi</span>
                </div>
                <span className="tour-booking-spots">{tour.available_slots} spots left</span>
              </div>

              <div className="tour-booking-field">
                <span>Select dates</span>
                <strong>{new Date(tour.start_date).toLocaleDateString()} - {new Date(tour.end_date).toLocaleDateString()}</strong>
              </div>

              <div className="tour-booking-field">
                <span>Travelers</span>
                <div className="tour-booking-travelers">
                  <input
                    type="number"
                    min="1"
                    max={tour.available_slots || 1}
                    value={quantity}
                    onChange={(event) => setQuantity(Math.max(1, Number(event.target.value) || 1))}
                  />
                  <strong>{quantity} Adults</strong>
                </div>
              </div>

              <button
                onClick={() => navigate('/checkout', { state: { tour, quantity } })}
                disabled={tour.available_slots < 1 || user?.role === 'guide'}
                className="tour-booking-button"
              >
                {user?.role === 'guide' ? 'Guide cannot book' : tour.available_slots < 1 ? 'Sold Out' : 'Reserve Now'}
              </button>

              <p className="tour-booking-note">No payment required today • 100% Secure</p>

              <div className="tour-booking-benefits">
                <span>Free cancellation up to 30 days before</span>
                <span>Travel protection included</span>
                <span>Best price guaranteed</span>
              </div>

              <div className="tour-booking-total">
                <span>Total amount</span>
                <strong>{formatCurrency(total)}</strong>
              </div>
            </div>
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  )
}
