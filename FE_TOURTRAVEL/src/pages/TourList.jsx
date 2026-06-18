import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { getTours } from '../api/tourService'
import { formatCurrency } from '../utils/currency'

const TOURS_PER_PAGE = 8

const durationOptions = [
  { label: '1-3 Ngày', key: '1-3' },
  { label: '4-7 Ngày', key: '4-7' },
  { label: '8-14 Ngày', key: '8-14' },
  { label: '15+ Ngày', key: '15+' }
]

const styleOptions = [
  { label: 'Khám phá & mạo hiểm', value: 'Adventure' },
  { label: 'Nghỉ dưỡng cao cấp', value: 'Luxury' },
  { label: 'Văn hóa & di sản', value: 'Cultural' },
  { label: 'Biển & Đảo', value: 'Beach' }
]

const FALLBACK_PRICE_MIN = 500000
const FALLBACK_PRICE_MAX = 50000000

const C = {
  bg: '#f4efe6',
  green: '#1f4d3f',
  dark: '#1b2a25',
  gold: '#e7c9a0',
  amber: '#cda06a',
  border: 'rgba(31,77,63,0.12)'
}

const S = {
  page: {
    background: C.bg,
    minHeight: '100vh',
    fontFamily: "'Be Vietnam Pro', sans-serif"
  },
  wrap: {
    maxWidth: '1280px',
    margin: '0 auto',
    padding: '104px 32px 80px',
    display: 'grid',
    gridTemplateColumns: '266px 1fr',
    gap: '40px',
    alignItems: 'start'
  },

  /* sidebar */
  sidebar: {
    position: 'sticky',
    top: '90px',
    background: '#fff',
    borderRadius: '10px',
    border: `1px solid ${C.border}`,
    overflow: 'hidden',
    boxShadow: '0 2px 16px rgba(31,77,63,0.06)'
  },
  sidebarHead: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px 22px 18px',
    borderBottom: `1px solid ${C.border}`
  },
  sidebarTitle: {
    fontFamily: "'Playfair Display', serif",
    fontSize: '18px',
    fontWeight: 700,
    color: C.dark,
    margin: 0
  },
  clearBtn: {
    background: 'none',
    border: 'none',
    color: C.amber,
    fontSize: '13px',
    cursor: 'pointer',
    padding: 0,
    fontFamily: "'Be Vietnam Pro', sans-serif",
    textDecoration: 'underline'
  },
  sidebarBody: { padding: '0 22px 22px' },

  chipRow: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '6px',
    padding: '14px 0 6px'
  },
  chip: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    background: 'rgba(31,77,63,0.07)',
    border: `1px solid rgba(31,77,63,0.18)`,
    borderRadius: '20px',
    padding: '4px 8px 4px 12px',
    fontSize: '12px',
    color: C.green,
    fontWeight: 600
  },
  chipX: {
    cursor: 'pointer',
    fontSize: '16px',
    lineHeight: 1,
    color: C.green,
    background: 'none',
    border: 'none',
    padding: 0,
    marginTop: '-1px',
    fontFamily: 'inherit'
  },

  group: {
    marginTop: '20px',
    paddingTop: '20px',
    borderTop: `1px solid ${C.border}`
  },
  groupLabel: {
    fontSize: '10px',
    letterSpacing: '2px',
    textTransform: 'uppercase',
    color: C.green,
    fontWeight: 700,
    marginBottom: '14px',
    display: 'block'
  },

  priceRow: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '13px',
    fontWeight: 600,
    color: C.dark,
    marginBottom: '12px'
  },
  sliderWrap: {
    position: 'relative',
    height: '20px',
    userSelect: 'none'
  },
  sliderTrack: {
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    left: 0,
    right: 0,
    height: '3px',
    background: 'rgba(31,77,63,0.14)',
    borderRadius: '2px'
  },
  rangeInput: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    opacity: 0,
    cursor: 'pointer',
    margin: 0
  },

  checkRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '6px 0',
    cursor: 'pointer',
    userSelect: 'none'
  },
  checkBox: {
    width: '16px',
    height: '16px',
    accentColor: C.green,
    cursor: 'pointer',
    flexShrink: 0
  },
  checkTxt: { fontSize: '14px', color: '#3c3c3c', lineHeight: 1.4 },

  radioCircle: (active) => ({
    width: '16px',
    height: '16px',
    borderRadius: '50%',
    border: `2px solid ${active ? C.green : 'rgba(31,77,63,0.3)'}`,
    background: active ? C.green : 'transparent',
    flexShrink: 0,
    transition: 'all .15s',
    boxSizing: 'border-box'
  }),
  radioTxt: (active) => ({
    fontSize: '14px',
    color: active ? C.green : '#3c3c3c',
    fontWeight: active ? 600 : 400
  }),

  applyBtn: {
    display: 'block',
    width: '100%',
    marginTop: '22px',
    padding: '12px',
    background: C.green,
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: 700,
    letterSpacing: '0.5px',
    cursor: 'pointer',
    fontFamily: "'Be Vietnam Pro', sans-serif"
  },

  /* main */
  main: { minWidth: 0 },
  toolbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: '28px',
    flexWrap: 'wrap',
    gap: '16px'
  },
  pageTitle: {
    fontFamily: "'Playfair Display', serif",
    fontSize: '30px',
    fontWeight: 700,
    color: C.dark,
    margin: '0 0 4px'
  },
  resultCount: {
    fontSize: '14px',
    color: 'rgba(27,42,37,0.5)',
    margin: 0
  },
  controls: { display: 'flex', gap: '10px', alignItems: 'center' },
  searchInput: {
    padding: '9px 16px',
    border: `1px solid rgba(31,77,63,0.2)`,
    borderRadius: '6px',
    fontSize: '14px',
    background: '#fff',
    color: C.dark,
    outline: 'none',
    fontFamily: "'Be Vietnam Pro', sans-serif",
    width: '210px'
  },
  sortWrap: { position: 'relative' },
  sortSelect: {
    padding: '9px 36px 9px 14px',
    border: `1px solid rgba(31,77,63,0.2)`,
    borderRadius: '6px',
    fontSize: '13px',
    background: '#fff',
    color: C.dark,
    outline: 'none',
    cursor: 'pointer',
    fontFamily: "'Be Vietnam Pro', sans-serif",
    appearance: 'none',
    WebkitAppearance: 'none'
  },
  sortArrow: {
    position: 'absolute',
    right: '12px',
    top: '50%',
    transform: 'translateY(-50%)',
    pointerEvents: 'none',
    fontSize: '9px',
    color: C.green
  },

  /* grid */
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '24px'
  },

  /* card */
  card: {
    background: '#fff',
    borderRadius: '10px',
    overflow: 'hidden',
    border: `1px solid ${C.border}`,
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '0 2px 12px rgba(31,77,63,0.05)',
    transition: 'box-shadow .2s, transform .2s'
  },
  imgWrap: { position: 'relative', height: '196px', overflow: 'hidden' },
  img: { width: '100%', height: '100%', objectFit: 'cover', display: 'block' },
  badge: {
    position: 'absolute',
    top: '14px',
    left: '14px',
    background: 'rgba(27,42,37,0.82)',
    backdropFilter: 'blur(4px)',
    color: C.gold,
    fontSize: '11px',
    fontWeight: 600,
    letterSpacing: '0.5px',
    padding: '4px 11px',
    borderRadius: '20px'
  },
  cardBody: {
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    flex: 1
  },
  cardLocation: {
    fontSize: '11px',
    letterSpacing: '1.5px',
    textTransform: 'uppercase',
    color: C.amber,
    marginBottom: '7px',
    fontWeight: 600
  },
  cardTitle: {
    fontFamily: "'Playfair Display', serif",
    fontSize: '17px',
    fontWeight: 700,
    color: C.dark,
    marginBottom: '8px',
    lineHeight: 1.35
  },
  cardDesc: {
    fontSize: '13px',
    color: 'rgba(27,42,37,0.58)',
    lineHeight: 1.65,
    flex: 1,
    marginBottom: '16px',
    display: '-webkit-box',
    WebkitLineClamp: 3,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden'
  },
  cardFoot: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: '14px',
    borderTop: `1px solid ${C.border}`
  },
  priceLabel: { fontSize: '11px', color: 'rgba(27,42,37,0.42)', marginBottom: '2px' },
  price: { fontSize: '17px', fontWeight: 700, color: C.green },
  cardBtn: {
    background: 'none',
    border: `1px solid ${C.green}`,
    color: C.green,
    padding: '8px 15px',
    borderRadius: '5px',
    fontSize: '13px',
    fontWeight: 600,
    cursor: 'pointer',
    textDecoration: 'none',
    display: 'inline-block',
    fontFamily: "'Be Vietnam Pro', sans-serif",
    transition: 'background .15s, color .15s'
  },

  feedback: {
    textAlign: 'center',
    padding: '72px 24px',
    color: 'rgba(27,42,37,0.4)',
    fontSize: '15px'
  },

  /* pagination */
  paginator: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '6px',
    marginTop: '48px'
  },
  pageBtn: (active) => ({
    minWidth: '38px',
    height: '38px',
    padding: '0 8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: `1px solid ${active ? C.green : 'rgba(31,77,63,0.18)'}`,
    borderRadius: '6px',
    background: active ? C.green : '#fff',
    color: active ? '#fff' : C.dark,
    fontSize: '13px',
    fontWeight: active ? 700 : 400,
    cursor: 'pointer',
    fontFamily: "'Be Vietnam Pro', sans-serif",
    transition: 'all .15s',
    boxSizing: 'border-box'
  }),
  pageDots: {
    color: 'rgba(27,42,37,0.35)',
    fontSize: '14px',
    padding: '0 2px',
    lineHeight: '38px'
  }
}

function buildPageNumbers(current, total) {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
  if (current <= 4) return [1, 2, 3, 4, 5, '...', total]
  if (current >= total - 3) return [1, '...', total - 4, total - 3, total - 2, total - 1, total]
  return [1, '...', current - 1, current, current + 1, '...', total]
}

export default function TourList() {
  const [searchParams] = useSearchParams()
  const [tours, setTours] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState(() => searchParams.get('search') || '')
  const [sortBy, setSortBy] = useState('latest')
  const [selectedDuration, setSelectedDuration] = useState(() => searchParams.get('duration') || '')
  const [selectedDestination, setSelectedDestination] = useState(() => searchParams.get('destination') || '')
  const [selectedStyle, setSelectedStyle] = useState(() => searchParams.get('style') || '')
  const [priceBounds, setPriceBounds] = useState({ min: FALLBACK_PRICE_MIN, max: FALLBACK_PRICE_MAX })
  const [priceRange, setPriceRange] = useState({ min: FALLBACK_PRICE_MIN, max: FALLBACK_PRICE_MAX })
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => { loadTours() }, [])

  useEffect(() => {
    setSearch(searchParams.get('search') || '')
    setSelectedDuration(searchParams.get('duration') || '')
    setSelectedDestination(searchParams.get('destination') || '')
    setSelectedStyle(searchParams.get('style') || '')
  }, [searchParams])

  useEffect(() => {
    if (!tours.length) return
    const prices = tours.map((t) => Number(t.price) || 0)
    const min = Math.floor(Math.min(...prices))
    const max = Math.ceil(Math.max(...prices))
    setPriceBounds({ min, max })
    setPriceRange({ min, max })
  }, [tours])

  useEffect(() => { setCurrentPage(1) }, [search, selectedDuration, selectedDestination, selectedStyle, priceRange, sortBy])

  const loadTours = async () => {
    try {
      setLoading(true)
      setError('')
      const data = await getTours()
      setTours(data)
    } catch (err) {
      setError(err.response?.data?.detail || 'Không thể tải danh sách tour.')
    } finally {
      setLoading(false)
    }
  }

  const destinations = useMemo(
    () => [...new Set(tours.map((t) => t.destination.split(',').slice(-1)[0].trim()))],
    [tours]
  )

  const visibleTours = useMemo(() => {
    const kw = search.trim().toLowerCase()
    const filtered = tours.filter((t) => {
      const matchKw =
        !kw ||
        t.name.toLowerCase().includes(kw) ||
        t.description.toLowerCase().includes(kw) ||
        t.destination.toLowerCase().includes(kw)
      const matchDest = !selectedDestination || t.destination.toLowerCase().includes(selectedDestination.toLowerCase())
      const matchStyle = !selectedStyle || (t.travel_style || '').toLowerCase().includes(selectedStyle.toLowerCase())
      const matchDur =
        !selectedDuration ||
        (selectedDuration === '1-3' && t.duration_days <= 3) ||
        (selectedDuration === '4-7' && t.duration_days >= 4 && t.duration_days <= 7) ||
        (selectedDuration === '8-14' && t.duration_days >= 8 && t.duration_days <= 14) ||
        (selectedDuration === '15+' && t.duration_days >= 15)
      const matchPrice = t.price >= priceRange.min && t.price <= priceRange.max
      return matchKw && matchDest && matchStyle && matchDur && matchPrice
    })
    return filtered.sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price
      if (sortBy === 'price-desc') return b.price - a.price
      if (sortBy === 'duration') return a.duration_days - b.duration_days
      return new Date(a.start_date) - new Date(b.start_date)
    })
  }, [priceRange, search, selectedDestination, selectedDuration, selectedStyle, sortBy, tours])

  const totalPages = Math.ceil(visibleTours.length / TOURS_PER_PAGE)
  const pageTours = visibleTours.slice((currentPage - 1) * TOURS_PER_PAGE, currentPage * TOURS_PER_PAGE)
  const pageNumbers = buildPageNumbers(currentPage, totalPages)

  const minPct = ((priceRange.min - priceBounds.min) / Math.max(priceBounds.max - priceBounds.min, 1)) * 100
  const maxPct = ((priceRange.max - priceBounds.min) / Math.max(priceBounds.max - priceBounds.min, 1)) * 100

  const handleMinPrice = (e) => {
    const v = Number(e.target.value)
    setPriceRange((p) => ({ ...p, min: Math.min(v, p.max - 100000) }))
  }
  const handleMaxPrice = (e) => {
    const v = Number(e.target.value)
    setPriceRange((p) => ({ ...p, max: Math.max(v, p.min + 100000) }))
  }

  const clearAll = () => {
    setSelectedDuration('')
    setSelectedDestination('')
    setSelectedStyle('')
    setPriceRange({ min: priceBounds.min, max: priceBounds.max })
    setSearch('')
  }

  const hasActiveFilters = !!(selectedDuration || selectedDestination || selectedStyle)

  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,400&family=Be+Vietnam+Pro:wght@400;500;600;700&display=swap"
      />

      <div style={S.page}>
        <Header />

        <div style={S.wrap} className="tl-wrap">
          {/* Sidebar */}
          <aside style={S.sidebar}>
            <div style={S.sidebarHead}>
              <h2 style={S.sidebarTitle}>Bộ lọc</h2>
              {hasActiveFilters && (
                <button type="button" style={S.clearBtn} onClick={clearAll}>Xóa lọc</button>
              )}
            </div>

            <div style={S.sidebarBody}>
              {hasActiveFilters && (
                <div style={S.chipRow}>
                  {selectedDuration && (
                    <span style={S.chip}>
                      {durationOptions.find((d) => d.key === selectedDuration)?.label}
                      <button type="button" style={S.chipX} onClick={() => setSelectedDuration('')}>×</button>
                    </span>
                  )}
                  {selectedDestination && (
                    <span style={S.chip}>
                      {selectedDestination}
                      <button type="button" style={S.chipX} onClick={() => setSelectedDestination('')}>×</button>
                    </span>
                  )}
                  {selectedStyle && (
                    <span style={S.chip}>
                      {styleOptions.find((s) => s.value === selectedStyle)?.label || selectedStyle}
                      <button type="button" style={S.chipX} onClick={() => setSelectedStyle('')}>×</button>
                    </span>
                  )}
                </div>
              )}

              {/* Price range */}
              <div style={S.group}>
                <span style={S.groupLabel}>Khoảng giá</span>
                <div style={S.priceRow}>
                  <span>{formatCurrency(priceRange.min)}</span>
                  <span>{formatCurrency(priceRange.max)}</span>
                </div>
                <div style={S.sliderWrap}>
                  <div style={S.sliderTrack} />
                  <div style={{
                    position: 'absolute',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    left: `${minPct}%`,
                    width: `${maxPct - minPct}%`,
                    height: '3px',
                    background: C.green,
                    borderRadius: '2px'
                  }} />
                  <input type="range" min={priceBounds.min} max={priceBounds.max} value={priceRange.min} onChange={handleMinPrice} style={S.rangeInput} />
                  <input type="range" min={priceBounds.min} max={priceBounds.max} value={priceRange.max} onChange={handleMaxPrice} style={S.rangeInput} />
                </div>
              </div>

              {/* Duration */}
              <div style={S.group}>
                <span style={S.groupLabel}>Thời gian</span>
                {durationOptions.map((opt) => (
                  <label key={opt.key} style={S.checkRow}>
                    <input
                      type="checkbox"
                      style={S.checkBox}
                      checked={selectedDuration === opt.key}
                      onChange={() => setSelectedDuration(selectedDuration === opt.key ? '' : opt.key)}
                    />
                    <span style={S.checkTxt}>{opt.label}</span>
                  </label>
                ))}
              </div>

              {/* Destination */}
              <div style={S.group}>
                <span style={S.groupLabel}>Địa điểm</span>
                {destinations.map((dest) => (
                  <label key={dest} style={S.checkRow}>
                    <input
                      type="checkbox"
                      style={S.checkBox}
                      checked={selectedDestination === dest}
                      onChange={() => setSelectedDestination(selectedDestination === dest ? '' : dest)}
                    />
                    <span style={S.checkTxt}>{dest}</span>
                  </label>
                ))}
              </div>

              {/* Style */}
              <div style={S.group}>
                <span style={S.groupLabel}>Phong cách</span>
                {styleOptions.map((opt) => {
                  const active = selectedStyle === opt.value
                  return (
                    <div
                      key={opt.value}
                      style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '7px 0', cursor: 'pointer', userSelect: 'none' }}
                      onClick={() => setSelectedStyle(active ? '' : opt.value)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => e.key === 'Enter' && setSelectedStyle(active ? '' : opt.value)}
                    >
                      <div style={S.radioCircle(active)} />
                      <span style={S.radioTxt(active)}>{opt.label}</span>
                    </div>
                  )
                })}
              </div>

              <button type="button" style={S.applyBtn}>Áp dụng bộ lọc</button>
            </div>
          </aside>

          {/* Main */}
          <main style={S.main}>
            <div style={S.toolbar}>
              <div>
                <h1 style={S.pageTitle}>Khám phá tour du lịch</h1>
                <p style={S.resultCount}>{visibleTours.length} tour phù hợp với bạn</p>
              </div>
              <div style={S.controls}>
                <input
                  style={S.searchInput}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Tìm tour..."
                />
                <div style={S.sortWrap}>
                  <select style={S.sortSelect} value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                    <option value="latest">Phổ biến nhất</option>
                    <option value="price-asc">Giá: Thấp đến cao</option>
                    <option value="price-desc">Giá: Cao đến thấp</option>
                    <option value="duration">Thời lượng</option>
                  </select>
                  <span style={S.sortArrow}>▼</span>
                </div>
              </div>
            </div>

            {loading && <div style={S.feedback}>Đang tải danh sách tour...</div>}
            {error && <div style={{ ...S.feedback, color: '#c0392b' }}>{error}</div>}

            {!loading && !error && (
              <>
                {pageTours.length === 0 ? (
                  <div style={S.feedback}>Không tìm thấy tour phù hợp. Thử điều chỉnh bộ lọc.</div>
                ) : (
                  <div style={S.grid} className="tl-grid">
                    {pageTours.map((tour) => (
                      <article key={tour.id} style={S.card} className="tl-card">
                        <div style={S.imgWrap}>
                          <img
                            src={tour.image || 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800'}
                            alt={tour.name}
                            style={S.img}
                            loading="lazy"
                          />
                          <span style={S.badge}>{tour.duration_days} Ngày</span>
                        </div>

                        <div style={S.cardBody}>
                          <p style={S.cardLocation}>◉ {tour.destination.toUpperCase()}</p>
                          <h3 style={S.cardTitle}>{tour.name}</h3>
                          <p style={S.cardDesc}>{tour.description}</p>

                          <div style={S.cardFoot}>
                            <div>
                              <p style={S.priceLabel}>Chỉ từ</p>
                              <p style={S.price}>{formatCurrency(tour.price)}</p>
                            </div>
                            <Link to={`/tours/${tour.id}`} style={S.cardBtn} className="tl-card-btn">
                              Xem chi tiết
                            </Link>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                )}

                {totalPages > 1 && (
                  <nav style={S.paginator} aria-label="Phân trang">
                    <button
                      type="button"
                      style={{ ...S.pageBtn(false), opacity: currentPage === 1 ? 0.4 : 1 }}
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    >
                      ‹
                    </button>

                    {pageNumbers.map((n, i) =>
                      n === '...' ? (
                        <span key={`dots-${i}`} style={S.pageDots}>···</span>
                      ) : (
                        <button
                          key={n}
                          type="button"
                          style={S.pageBtn(n === currentPage)}
                          onClick={() => setCurrentPage(n)}
                        >
                          {n}
                        </button>
                      )
                    )}

                    <button
                      type="button"
                      style={{ ...S.pageBtn(false), opacity: currentPage === totalPages ? 0.4 : 1 }}
                      disabled={currentPage === totalPages}
                      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    >
                      ›
                    </button>
                  </nav>
                )}
              </>
            )}
          </main>
        </div>

        <Footer />
      </div>

      <style>{`
        .tl-card:hover { box-shadow: 0 8px 32px rgba(31,77,63,0.13) !important; transform: translateY(-3px) !important; }
        .tl-card-btn:hover { background: #1f4d3f !important; color: #fff !important; }
        @media (max-width: 1024px) {
          .tl-wrap { grid-template-columns: 230px 1fr !important; gap: 28px !important; }
        }
        @media (max-width: 768px) {
          .tl-wrap { grid-template-columns: 1fr !important; padding: 90px 20px 60px !important; }
          .tl-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  )
}
