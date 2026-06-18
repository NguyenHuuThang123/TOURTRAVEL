import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { getMyTourReview, getTourById, getTourReviews, upsertMyTourReview } from '../api/tourService'
import { useAuth } from '../context/AuthContext'
import { formatCurrency } from '../utils/currency'
import { formatVietnamDate, formatVietnamDateRange } from '../utils/datetime'

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
        setError(err.response?.data?.detail || 'Không tìm thay tour hoặc có lỗi xảy ra khi tải dữ liệu.')
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
    return (
      <div className="tour-detail-shell">
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400;1,700&family=Be+Vietnam+Pro:wght@400;500;600;700&display=swap" />
        <Header />
        <div className="tour-detail-feedback">Đang tải chi tiết tour...</div>
        <Footer />
      </div>
    )
  }

  if (error || !tour) {
    return (
      <div className="tour-detail-shell">
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400;1,700&family=Be+Vietnam+Pro:wght@400;500;600;700&display=swap" />
        <Header />
        <div className="tour-detail-feedback error">
          <p>{error || 'Không tìm thấy tour hoặc có lỗi xảy ra khi tải dữ liệu.'}</p>
          <Link to="/tours">Quay lại danh sách tour</Link>
        </div>
        <Footer />
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
    { label: 'Thời lượng', value: `${tour.duration_days} ngày`, icon: '◔' },
    { label: 'Số chỗ tối đa', value: `${tour.max_participants} người`, icon: '⌘' },
    tour.activity_level && { label: 'Mức độ hoạt động', value: tour.activity_level, icon: '↟' },
    tour.languages && { label: 'Ngôn ngữ', value: tour.languages, icon: '◎' }
  ].filter(Boolean)

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
      setReviewMessage(hadReview ? 'Đã cập nhật đánh giá của bạn.' : 'Cảm ơn bạn đã gửi đánh giá.')
    } catch (err) {
      setReviewError(err.response?.data?.detail || 'Không thể gửi đánh giá lúc này.')
    } finally {
      setReviewSubmitting(false)
    }
  }

  const renderStars = (value) => '★★★★★'.slice(0, value) + '☆☆☆☆☆'.slice(0, 5 - value)
  const canReview = user?.role === 'user'

  return (
    <div className="tour-detail-shell">
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400;1,700&family=Be+Vietnam+Pro:wght@400;500;600;700&display=swap"
      />
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
                {tour.travel_style && <span>{tour.travel_style}</span>}
                {tour.duration_days && <span>{tour.duration_days} ngày</span>}
              </div>
              <h1>{tour.name}</h1>
              <div className="tour-detail-rating">
                <span style={{ color: '#e7c9a0' }}>
                  ★ {reviewCount ? ratingAverage.toFixed(1) : 'Mới'}{reviewCount ? ` · ${reviewCount} đánh giá` : ''}
                </span>
                <span style={{ opacity: 0.75 }}>◉ {tour.destination}</span>
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
                <h2>Hướng dẫn viên</h2>
                <div className="tour-guide-card">
                  <div className="tour-guide-profile">
                    <img src={guide.avatar} alt={guide.name} />
                    <div>
                      <strong>{guide.name}</strong>
                      <p>{guide.title} • {guide.experience}</p>
                      <div className="tour-guide-links">
                        <button type="button" onClick={handleMessageGuide}>Nhắn tin</button>
                      </div>
                      <p>{guide.bio}</p>
                    </div>
                  </div>
                </div>
              </section>
            )}

            <section className="tour-overview-section">
              <h2>Tổng quan</h2>
              <p>{tour.description}</p>
            </section>

            <section className="tour-reviews-section">
              <div className="tour-reviews-header">
                <div>
                  <h2>Đánh giá & Xếp hạng</h2>
                  <p>Khách hàng có thể chia sẻ trải nghiệm sau khi đặt tour thành công.</p>
                </div>
                <div className="tour-review-summary-card">
                  <strong>{reviewCount ? ratingAverage.toFixed(1) : '0.0'}</strong>
                  <span>{renderStars(Math.round(ratingAverage || 0))}</span>
                  <small>{reviewCount} đánh giá</small>
                </div>
              </div>

              <div className="tour-reviews-layout">
                <form className="tour-review-form" onSubmit={handleReviewSubmit}>
                  <h3>{myReview ? 'Cập nhật đánh giá của bạn' : 'Gửi đánh giá của bạn'}</h3>
                  <p className="tour-review-form-note">
                    {!isAuthenticated
                      ? 'Đăng nhập để gửi nhận xét và xếp hạng bằng sao.'
                      : canReview
                        ? 'Bạn có thể chọn từ 1 đến 5 sao và để lại bình luận ngắn gọn.'
                        : 'Chỉ tài khoản khách hàng mới có thể gửi đánh giá.'}
                  </p>

                  <div className="tour-review-stars-input" role="radiogroup" aria-label="Đánh giá sao">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        aria-label={`${star} sao`}
                        aria-pressed={star <= reviewForm.rating}
                        className={star <= reviewForm.rating ? 'active' : ''}
                        onClick={() => setReviewForm((prev) => ({ ...prev, rating: star }))}
                        disabled={!isAuthenticated || !canReview || reviewSubmitting}
                      >
                        ★
                      </button>
                    ))}
                  </div>

                  <label className="tour-review-textarea">
                    <span>Bình luận</span>
                    <textarea
                      value={reviewForm.comment}
                      onChange={(event) => setReviewForm((prev) => ({ ...prev, comment: event.target.value }))}
                      placeholder="Chia sẻ điều bạn thích, lưu ý cho người đi sau, chất lượng hướng dẫn viên..."
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
                    {reviewSubmitting ? 'Đang gửi...' : myReview ? 'Cập nhật đánh giá' : 'Gửi đánh giá'}
                  </button>
                </form>

                <div className="tour-review-list">
                  {reviews.length === 0 ? (
                    <div className="tour-review-empty">
                      Chưa có bình luận nào. Hãy là người đầu tiên chia sẻ trải nghiệm về tour này.
                    </div>
                  ) : (
                    reviews.map((review) => (
                      <article key={review.id} className="tour-review-card">
                        <div className="tour-review-card-head">
                          <div>
                            <strong>{review.user_name}</strong>
                            <span>{formatVietnamDate(review.updated_at)}</span>
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
                  <span>/ người</span>
                </div>
                <span className="tour-booking-spots">Còn {tour.available_slots} chỗ trống</span>
              </div>

              <div className="tour-booking-field">
                <span>Ngày bắt đầu</span>
                <strong>{formatVietnamDateRange(tour.start_date, tour.end_date)}</strong>
              </div>

              <div className="tour-booking-field">
                <span>Số người</span>
                <div className="tour-booking-travelers">
                  <button
                    type="button"
                    className="tour-booking-stepper"
                    aria-label="Giảm số người"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    disabled={quantity <= 1}
                  >−</button>
                  <strong>{quantity} người lớn</strong>
                  <button
                    type="button"
                    className="tour-booking-stepper"
                    aria-label="Tăng số người"
                    onClick={() => setQuantity((q) => Math.min(tour.available_slots || 1, q + 1))}
                    disabled={quantity >= (tour.available_slots || 1)}
                  >+</button>
                </div>
              </div>

              <button
                onClick={() => navigate('/checkout', { state: { tour, quantity } })}
                disabled={tour.available_slots < 1 || user?.role === 'guide'}
                className="tour-booking-button"
                title={user?.role === 'guide' ? 'Hướng dẫn viên không thể đặt tour' : undefined}
              >
                {tour.available_slots < 1 ? 'Hết chỗ' : 'Đặt ngay'}
              </button>

              <div className="tour-booking-benefits">
                <span>Đặt tour an toàn với chính sách hủy linh hoạt.</span>
                <span>Hủy miễn phí đến 30 ngày trước ngày khởi hành.</span>
                <span>Bảo vệ du lịch được bao gồm.</span>
                <span>Đảm bảo giá tốt nhất.</span>
              </div>

              <div className="tour-booking-total">
                <span>Tổng số tiền</span>
                <strong>{formatCurrency(total)}</strong>
              </div>
            </div>
          </aside>
        </div>
      </main>

      <Footer />
      <style>{`
        .tour-detail-hero-image { transition: box-shadow .3s; }
        .tour-quick-card { transition: box-shadow .2s, transform .2s; }
        .tour-quick-card:hover { box-shadow: 0 6px 24px rgba(31,77,63,0.12) !important; transform: translateY(-2px); }
        .tour-review-card { transition: box-shadow .2s; }
        .tour-review-card:hover { box-shadow: 0 4px 18px rgba(31,77,63,0.1) !important; }
        @media (max-width: 1024px) {
          .tour-detail-layout { grid-template-columns: 1fr !important; }
          .tour-booking-column { position: static !important; }
          .tour-reviews-layout { grid-template-columns: 1fr !important; }
          .tour-review-form { position: static !important; }
          .tour-quick-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 640px) {
          .tour-detail-hero-image { min-height: 320px !important; }
          .tour-quick-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .container { padding-left: 16px !important; padding-right: 16px !important; }
        }
      `}</style>
    </div>
  )
}
