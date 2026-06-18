import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { getTours } from '../api/tourService'
import { formatCurrency } from '../utils/currency'

const fallbackImage = 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1200'

const featureItems = [
  {
    number: '01',
    title: 'Lịch trình được tuyển chọn',
    description: 'Mỗi chuyến đi được lên kế hoạch tỉ mỉ theo nhịp độ thực tế, điểm nổi bật địa phương và hậu cần dễ dàng.'
  },
  {
    number: '02',
    title: 'Đặt chỗ linh hoạt',
    description: 'Đặt chỗ nhanh chóng, xem lại chi tiết và quản lý kế hoạch của bạn từ tài khoản cá nhân.'
  },
  {
    number: '03',
    title: 'Hỗ trợ đáng tin cậy',
    description: 'Từ lần tìm kiếm đầu tiên đến ngày khởi hành, trải nghiệm luôn rõ ràng và được dẫn dắt chu đáo.'
  }
]

const testimonials = [
  {
    name: 'Linh Trần',
    location: 'Đà Nẵng',
    quote: 'Quy trình đặt chỗ đơn giản và tour hoàn toàn đúng như những gì chúng tôi kỳ vọng.'
  },
  {
    name: 'Minh Hoàng',
    location: 'TP. Hồ Chí Minh',
    quote: 'Tôi tìm được chuyến đi nhanh chóng, so sánh dễ dàng và xác nhận mọi thứ chỉ trong vài phút.'
  },
  {
    name: 'Anna Phạm',
    location: 'Hà Nội',
    quote: 'Trang chủ giúp tôi khám phá những điểm đến thực sự phù hợp với lịch trình của mình.'
  }
]

const styles = {
  page: { fontFamily: "'Be Vietnam Pro', sans-serif", background: '#f4efe6', color: '#1b2a25' },

  /* ── HERO ── */
  hero: {
    position: 'relative',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    background: 'linear-gradient(180deg,#0d2318 0%,#1f4d3f 40%,#2d6e57 65%,#3d8a6d 80%,#4a9e7e 90%,#6db89a 100%)'
  },
  heroMtn1: {
    position: 'absolute', bottom: 0, left: 0, right: 0, height: '55%', zIndex: 1,
    background: 'linear-gradient(180deg,transparent 0%,#0a1a12 100%)',
    clipPath: 'polygon(0 60%,8% 35%,16% 55%,25% 20%,34% 45%,42% 10%,50% 40%,58% 15%,66% 50%,74% 25%,82% 55%,90% 30%,100% 50%,100% 100%,0 100%)'
  },
  heroMtn2: {
    position: 'absolute', bottom: 0, left: 0, right: 0, height: '40%', zIndex: 2,
    background: '#0d1f16',
    clipPath: 'polygon(0 70%,10% 45%,20% 65%,30% 30%,40% 55%,50% 25%,60% 50%,70% 20%,80% 60%,90% 35%,100% 55%,100% 100%,0 100%)'
  },
  heroMtn3: {
    position: 'absolute', bottom: 0, left: 0, right: 0, height: '28%', zIndex: 3,
    background: '#091510',
    clipPath: 'polygon(0 80%,12% 55%,24% 75%,36% 40%,48% 65%,60% 35%,72% 65%,84% 45%,100% 60%,100% 100%,0 100%)'
  },
  heroContent: {
    position: 'relative', zIndex: 10, flex: 1,
    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
    textAlign: 'center', padding: '120px 24px 180px'
  },
  heroLabel: {
    fontSize: '11px', letterSpacing: '3px', textTransform: 'uppercase',
    color: '#e7c9a0', marginBottom: '20px', opacity: 0.85
  },
  heroTitle: {
    fontFamily: "'Playfair Display', serif", fontSize: 'clamp(2.4rem,6vw,4.5rem)',
    color: '#fff', lineHeight: 1.15, margin: '0 0 24px', fontWeight: 700,
    maxWidth: '720px'
  },
  heroTitleAccent: { color: '#e7c9a0', fontStyle: 'italic', display: 'block' },
  heroSubtitle: {
    fontSize: '1.05rem', color: 'rgba(255,255,255,0.75)', maxWidth: '520px',
    lineHeight: 1.7, margin: '0 0 40px'
  },
  heroBtn: {
    display: 'inline-block', padding: '14px 36px', background: '#e7c9a0',
    color: '#1b2a25', borderRadius: '4px', textDecoration: 'none',
    fontWeight: 700, fontSize: '0.9rem', letterSpacing: '1px', textTransform: 'uppercase',
    transition: 'background .2s'
  },

  /* search bar */
  searchBar: {
    position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 20,
    background: 'rgba(15,30,20,0.92)', backdropFilter: 'blur(8px)',
    borderTop: '1px solid rgba(231,201,160,0.2)', padding: '20px 40px'
  },
  searchForm: {
    maxWidth: '1100px', margin: '0 auto',
    display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto',
    gap: '12px', alignItems: 'end'
  },
  searchField: { display: 'flex', flexDirection: 'column', gap: '6px' },
  searchLabel: { fontSize: '10px', letterSpacing: '2px', textTransform: 'uppercase', color: '#e7c9a0', opacity: 0.8 },
  searchInput: {
    background: 'transparent', border: 'none', borderBottom: '1px solid rgba(231,201,160,0.4)',
    color: '#fff', padding: '8px 0', fontSize: '0.95rem', outline: 'none',
    width: '100%'
  },
  searchBtn: {
    padding: '12px 28px', background: '#e7c9a0', color: '#1b2a25',
    border: 'none', borderRadius: '4px', fontWeight: 700, fontSize: '0.85rem',
    letterSpacing: '1px', textTransform: 'uppercase', cursor: 'pointer',
    whiteSpace: 'nowrap'
  },

  /* ── FEATURED TOURS ── */
  section: { padding: '80px 24px' },
  sectionInner: { maxWidth: '1100px', margin: '0 auto' },
  sectionHead: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end',
    marginBottom: '48px', flexWrap: 'wrap', gap: '16px'
  },
  sectionEyebrow: {
    fontSize: '10px', letterSpacing: '3px', textTransform: 'uppercase',
    color: '#cda06a', marginBottom: '10px'
  },
  sectionTitle: {
    fontFamily: "'Playfair Display', serif", fontSize: 'clamp(1.8rem,3.5vw,2.8rem)',
    color: '#1b2a25', margin: 0, lineHeight: 1.2
  },
  sectionSubtitle: { color: '#5a7060', fontSize: '1rem', lineHeight: 1.7, maxWidth: '480px', margin: '12px 0 0' },
  viewAllLink: {
    fontSize: '0.85rem', letterSpacing: '1.5px', textTransform: 'uppercase',
    color: '#1f4d3f', textDecoration: 'none', borderBottom: '1px solid #1f4d3f',
    paddingBottom: '2px', fontWeight: 600, whiteSpace: 'nowrap'
  },
  tourGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: '28px' },
  tourCard: {
    textDecoration: 'none', color: 'inherit', background: '#fff',
    borderRadius: '8px', overflow: 'hidden',
    boxShadow: '0 2px 16px rgba(27,42,37,0.08)', display: 'block',
    transition: 'transform .25s, box-shadow .25s'
  },
  tourImg: {
    height: '220px', backgroundSize: 'cover', backgroundPosition: 'center',
    position: 'relative'
  },
  tourBadge: {
    position: 'absolute', top: '14px', left: '14px',
    background: '#1b2a25', color: '#e7c9a0',
    fontSize: '11px', letterSpacing: '1px', padding: '4px 10px', borderRadius: '3px'
  },
  tourRating: {
    position: 'absolute', top: '14px', right: '14px',
    background: 'rgba(255,255,255,0.92)', color: '#1b2a25',
    fontSize: '11px', padding: '4px 10px', borderRadius: '3px', fontWeight: 700
  },
  tourBody: { padding: '22px 24px 20px' },
  tourName: {
    fontFamily: "'Playfair Display', serif", fontSize: '1.2rem',
    fontWeight: 700, margin: '0 0 8px', color: '#1b2a25'
  },
  tourDesc: { fontSize: '0.88rem', color: '#6b7f74', lineHeight: 1.6, margin: '0 0 18px',
    display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden'
  },
  tourFooter: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  tourPrice: { fontSize: '1.05rem', fontWeight: 700, color: '#1f4d3f' },
  tourAction: { fontSize: '0.8rem', color: '#cda06a', fontWeight: 600, letterSpacing: '0.5px' },
  loadingText: { textAlign: 'center', color: '#6b7f74', padding: '48px', fontSize: '1rem' },

  /* ── WHY US ── */
  whySection: { background: '#1b2a25', padding: '80px 24px' },
  whySectionInner: { maxWidth: '1100px', margin: '0 auto' },
  whyHead: { textAlign: 'center', marginBottom: '60px' },
  whyEyebrow: { fontSize: '10px', letterSpacing: '3px', textTransform: 'uppercase', color: '#e7c9a0', marginBottom: '12px' },
  whyTitle: {
    fontFamily: "'Playfair Display', serif", fontSize: 'clamp(1.8rem,3.5vw,2.8rem)',
    color: '#f4efe6', margin: 0
  },
  whyGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: '2px' },
  whyCard: {
    background: 'rgba(255,255,255,0.04)', padding: '40px 36px',
    borderLeft: '1px solid rgba(231,201,160,0.15)'
  },
  whyNumber: {
    fontFamily: "'Playfair Display', serif", fontSize: '3.5rem', fontWeight: 700,
    color: 'rgba(231,201,160,0.2)', lineHeight: 1, marginBottom: '20px'
  },
  whyCardTitle: { fontSize: '1.1rem', fontWeight: 700, color: '#f4efe6', marginBottom: '12px' },
  whyCardDesc: { fontSize: '0.9rem', color: 'rgba(244,239,230,0.65)', lineHeight: 1.7 },

  /* ── TESTIMONIALS ── */
  testimonialsSection: { background: '#f4efe6', padding: '80px 24px' },
  testimonialsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: '24px' },
  testimonialCard: {
    background: '#fff', borderRadius: '8px', padding: '32px',
    boxShadow: '0 2px 12px rgba(27,42,37,0.07)'
  },
  testimonialStars: { color: '#cda06a', fontSize: '14px', letterSpacing: '2px', marginBottom: '18px' },
  testimonialQuote: {
    fontFamily: "'Playfair Display', serif", fontStyle: 'italic',
    fontSize: '1rem', color: '#1b2a25', lineHeight: 1.75, marginBottom: '24px'
  },
  testimonialAuthorRow: { display: 'flex', alignItems: 'center', gap: '14px' },
  testimonialAvatar: {
    width: '42px', height: '42px', borderRadius: '50%',
    background: '#1f4d3f', display: 'flex', alignItems: 'center', justifyContent: 'center',
    color: '#e7c9a0', fontWeight: 700, fontSize: '0.9rem', flexShrink: 0
  },
  testimonialName: { fontWeight: 700, fontSize: '0.9rem', color: '#1b2a25' },
  testimonialLoc: { fontSize: '0.8rem', color: '#8a9e93', marginTop: '2px' },

  /* ── CTA ── */
  ctaSection: {
    position: 'relative', padding: '100px 24px', textAlign: 'center', overflow: 'hidden',
    background: 'linear-gradient(135deg,#0d2318 0%,#1f4d3f 50%,#2d6e57 100%)'
  },
  ctaOverlay: {
    position: 'absolute', inset: 0, zIndex: 1,
    background: 'url("https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1400") center/cover no-repeat',
    opacity: 0.15
  },
  ctaContent: { position: 'relative', zIndex: 2, maxWidth: '640px', margin: '0 auto' },
  ctaLabel: { fontSize: '10px', letterSpacing: '3px', textTransform: 'uppercase', color: '#e7c9a0', marginBottom: '16px' },
  ctaTitle: {
    fontFamily: "'Playfair Display', serif", fontSize: 'clamp(2rem,4vw,3rem)',
    color: '#fff', margin: '0 0 20px', lineHeight: 1.2
  },
  ctaText: { color: 'rgba(255,255,255,0.75)', fontSize: '1rem', lineHeight: 1.7, marginBottom: '36px' },
  ctaBtn: {
    display: 'inline-block', padding: '15px 40px', background: '#e7c9a0',
    color: '#1b2a25', borderRadius: '4px', textDecoration: 'none',
    fontWeight: 700, fontSize: '0.9rem', letterSpacing: '1px', textTransform: 'uppercase'
  }
}

export default function Home() {
  const navigate = useNavigate()
  const [tours, setTours] = useState([])
  const [loading, setLoading] = useState(true)
  const [heroSearch, setHeroSearch] = useState({ search: '', destination: '', duration: '' })

  useEffect(() => {
    const loadFeaturedTours = async () => {
      try {
        const data = await getTours()
        setTours(Array.isArray(data) ? data.slice(0, 3) : [])
      } catch {
        setTours([])
      } finally {
        setLoading(false)
      }
    }
    loadFeaturedTours()
  }, [])

  const destinations = useMemo(() => {
    return [...new Set(tours.map((t) => t.destination).filter(Boolean))].slice(0, 8)
  }, [tours])

  const handleSearch = (e) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (heroSearch.search.trim()) params.set('search', heroSearch.search.trim())
    if (heroSearch.destination) params.set('destination', heroSearch.destination)
    if (heroSearch.duration) params.set('duration', heroSearch.duration)
    navigate(`/tours${params.toString() ? `?${params.toString()}` : ''}`)
  }

  const getInitials = (name) =>
    name.split(' ').map((w) => w[0]).slice(-2).join('').toUpperCase()

  return (
    <div style={styles.page}>
      <link
        href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400;1,700&family=Be+Vietnam+Pro:wght@300;400;500;600;700&display=swap"
        rel="stylesheet"
      />
      <Header />

      {/* ── HERO ── */}
      <section style={styles.hero}>
        <div style={styles.heroMtn1} />
        <div style={styles.heroMtn2} />
        <div style={styles.heroMtn3} />

        <div style={styles.heroContent}>
          <p style={styles.heroLabel}>Nền tảng đặt tour du lịch hàng đầu</p>
          <h1 style={styles.heroTitle}>
            Khám phá Việt Nam
            <span style={styles.heroTitleAccent}>theo cách của bạn</span>
          </h1>
          <p style={styles.heroSubtitle}>
            Duyệt tour theo điểm đến, so sánh giá và thời lượng, rồi đặt chỗ chỉ trong vài bước đơn giản.
          </p>
          <Link to="/tours" style={styles.heroBtn}>
            Khám phá tour ngay
          </Link>
        </div>

        {/* Search Bar */}
        <div style={styles.searchBar}>
          <form style={styles.searchForm} onSubmit={handleSearch}>
            <div style={styles.searchField}>
              <label style={styles.searchLabel}>Từ khóa</label>
              <input
                style={styles.searchInput}
                value={heroSearch.search}
                onChange={(e) => setHeroSearch((p) => ({ ...p, search: e.target.value }))}
                placeholder="VD: Hạ Long, biển, luxury..."
              />
            </div>
            <div style={styles.searchField}>
              <label style={styles.searchLabel}>Điểm đến</label>
              <select
                style={{ ...styles.searchInput, cursor: 'pointer' }}
                value={heroSearch.destination}
                onChange={(e) => setHeroSearch((p) => ({ ...p, destination: e.target.value }))}
              >
                <option value="" style={{ background: '#1b2a25' }}>Tất cả điểm đến</option>
                {destinations.map((d) => (
                  <option key={d} value={d} style={{ background: '#1b2a25' }}>{d}</option>
                ))}
              </select>
            </div>
            <div style={styles.searchField}>
              <label style={styles.searchLabel}>Thời lượng</label>
              <select
                style={{ ...styles.searchInput, cursor: 'pointer' }}
                value={heroSearch.duration}
                onChange={(e) => setHeroSearch((p) => ({ ...p, duration: e.target.value }))}
              >
                <option value="" style={{ background: '#1b2a25' }}>Bất kỳ</option>
                <option value="1-3" style={{ background: '#1b2a25' }}>1–3 ngày</option>
                <option value="4-7" style={{ background: '#1b2a25' }}>4–7 ngày</option>
                <option value="8-14" style={{ background: '#1b2a25' }}>8–14 ngày</option>
                <option value="15+" style={{ background: '#1b2a25' }}>15+ ngày</option>
              </select>
            </div>
            <button type="submit" style={styles.searchBtn}>Tìm tour</button>
          </form>
        </div>
      </section>

      {/* ── FEATURED TOURS ── */}
      <section style={styles.section}>
        <div style={styles.sectionInner}>
          <div style={styles.sectionHead}>
            <div>
              <p style={styles.sectionEyebrow}>Được tuyển chọn</p>
              <h2 style={styles.sectionTitle}>Tour nổi bật</h2>
              <p style={styles.sectionSubtitle}>
                Những lựa chọn phổ biến nhất, được tuyển chọn kỹ lưỡng để mang đến trải nghiệm tốt nhất.
              </p>
            </div>
            <Link to="/tours" style={styles.viewAllLink}>Xem tất cả tour</Link>
          </div>

          {loading ? (
            <div style={styles.loadingText}>Đang tải tour nổi bật...</div>
          ) : (
            <div style={styles.tourGrid}>
              {tours.map((tour) => (
                <Link key={tour.id} to={`/tours/${tour.id}`} style={styles.tourCard}>
                  <div
                    style={{
                      ...styles.tourImg,
                      backgroundImage: `url(${tour.image || fallbackImage})`
                    }}
                  >
                    <span style={styles.tourBadge}>{tour.duration_days} ngày</span>
                    <span style={styles.tourRating}>
                      ★ {tour.review_count ? Number(tour.rating_average || 0).toFixed(1) : 'Mới'}
                    </span>
                  </div>
                  <div style={styles.tourBody}>
                    <h3 style={styles.tourName}>{tour.name}</h3>
                    <p style={styles.tourDesc}>{tour.description}</p>
                    <div style={styles.tourFooter}>
                      <div>
                        <span style={{ fontSize: '0.8rem', color: '#8a9e93' }}>Từ </span>
                        <strong style={styles.tourPrice}>{formatCurrency(tour.price)}</strong>
                      </div>
                      <span style={styles.tourAction}>
                        {tour.review_count ? `${tour.review_count} đánh giá` : 'Xem chi tiết'}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── VÌ SAO CHỌN CHÚNG TÔI ── */}
      <section style={styles.whySection}>
        <div style={styles.whySectionInner}>
          <div style={styles.whyHead}>
            <p style={styles.whyEyebrow}>Cam kết của chúng tôi</p>
            <h2 style={styles.whyTitle}>Vì sao chọn TourTravel?</h2>
          </div>
          <div style={styles.whyGrid}>
            {featureItems.map((item) => (
              <div key={item.number} style={styles.whyCard}>
                <div style={styles.whyNumber}>{item.number}</div>
                <h3 style={styles.whyCardTitle}>{item.title}</h3>
                <p style={styles.whyCardDesc}>{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section style={styles.testimonialsSection}>
        <div style={styles.sectionInner}>
          <div style={{ ...styles.sectionHead, justifyContent: 'center', textAlign: 'center', flexDirection: 'column', alignItems: 'center' }}>
            <p style={styles.sectionEyebrow}>Khách hàng nói gì</p>
            <h2 style={styles.sectionTitle}>Đánh giá từ du khách</h2>
            <p style={{ ...styles.sectionSubtitle, textAlign: 'center' }}>
              Những trải nghiệm thực tế từ hàng nghìn du khách đã tin tưởng lựa chọn TourTravel.
            </p>
          </div>
          <div style={styles.testimonialsGrid}>
            {testimonials.map((item) => (
              <article key={item.name} style={styles.testimonialCard}>
                <div style={styles.testimonialStars}>★★★★★</div>
                <p style={styles.testimonialQuote}>"{item.quote}"</p>
                <div style={styles.testimonialAuthorRow}>
                  <div style={styles.testimonialAvatar}>{getInitials(item.name)}</div>
                  <div>
                    <div style={styles.testimonialName}>{item.name}</div>
                    <div style={styles.testimonialLoc}>{item.location}</div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={styles.ctaSection}>
        <div style={styles.ctaOverlay} />
        <div style={styles.ctaContent}>
          <p style={styles.ctaLabel}>Sẵn sàng lên đường?</p>
          <h2 style={styles.ctaTitle}>Khám phá toàn bộ danh mục tour</h2>
          <p style={styles.ctaText}>
            Duyệt qua hàng trăm tour, so sánh điểm đến và đặt chỗ khi bạn đã sẵn sàng — mọi thứ đều trong một nơi.
          </p>
          <Link to="/tours" style={styles.ctaBtn}>Duyệt tour ngay</Link>
        </div>
      </section>

      <Footer />
    </div>
  )
}
