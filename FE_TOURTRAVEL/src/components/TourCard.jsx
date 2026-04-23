import { Link } from 'react-router-dom'
import { formatCurrency } from '../utils/currency'

export default function TourCard({ tour }) {
  return (
    <Link to={`/tours/${tour.id}`} style={{ textDecoration: 'none' }}>
      <div className="card" style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}>
        {/* Tour Image Placeholder */}
        <div style={{
          height: '200px',
          background: 'var(--gradient-primary)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute',
            top: 'var(--spacing-md)',
            right: 'var(--spacing-md)',
            background: 'rgba(0, 0, 0, 0.7)',
            color: 'var(--text-white)',
            padding: 'var(--spacing-xs) var(--spacing-sm)',
            borderRadius: 'var(--radius-sm)',
            fontSize: 'var(--font-size-xs)',
            fontWeight: 'bold'
          }}>
            ⭐ 4.8
          </div>
          <div style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            background: 'linear-gradient(transparent, rgba(0, 0, 0, 0.7))',
            padding: 'var(--spacing-xl) var(--spacing-lg) var(--spacing-lg)',
            color: 'var(--text-white)'
          }}>
            <h3 style={{
              fontSize: 'var(--font-size-lg)',
              marginBottom: 'var(--spacing-xs)',
              fontWeight: '600'
            }}>
              {tour.name}
            </h3>
            <p style={{
              fontSize: 'var(--font-size-sm)',
              opacity: 0.9,
              margin: 0
            }}>
              📍 {tour.destination}
            </p>
          </div>
        </div>

        {/* Tour Info */}
        <div style={{ padding: 'var(--spacing-lg)', flex: 1 }}>
          <p style={{
            color: 'var(--text-secondary)',
            fontSize: 'var(--font-size-sm)',
            marginBottom: 'var(--spacing-md)',
            lineHeight: '1.5'
          }}>
            {tour.description}
          </p>

          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 'var(--spacing-md)'
          }}>
            <div>
              <span style={{
                fontSize: 'var(--font-size-xs)',
                color: 'var(--text-light)',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>
                Duration
              </span>
              <p style={{
                fontSize: 'var(--font-size-sm)',
                fontWeight: '500',
                color: 'var(--text-primary)',
                margin: 'var(--spacing-xs) 0 0 0'
              }}>
                {tour.duration_days} days
              </p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span style={{
                fontSize: 'var(--font-size-xs)',
                color: 'var(--text-light)',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>
                Price
              </span>
              <p style={{
                fontSize: 'var(--font-size-lg)',
                fontWeight: 'bold',
                background: 'var(--gradient-primary)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                margin: 'var(--spacing-xs) 0 0 0'
              }}>
                {formatCurrency(tour.price)}
              </p>
            </div>
          </div>

          <div style={{
            display: 'flex',
            gap: 'var(--spacing-sm)',
            marginBottom: 'var(--spacing-lg)'
          }}>
            <span style={{
              fontSize: 'var(--font-size-xs)',
              color: 'var(--text-light)',
              background: 'var(--bg-gray-100)',
              padding: 'var(--spacing-xs) var(--spacing-sm)',
              borderRadius: 'var(--radius-sm)'
            }}>
              🏖️ Adventure
            </span>
            <span style={{
              fontSize: 'var(--font-size-xs)',
              color: 'var(--text-light)',
              background: 'var(--bg-gray-100)',
              padding: 'var(--spacing-xs) var(--spacing-sm)',
              borderRadius: 'var(--radius-sm)'
            }}>
              👥 Max {tour.max_participants}
            </span>
          </div>

          <button className="btn btn-primary" style={{
            width: '100%',
            padding: 'var(--spacing-sm) var(--spacing-md)',
            fontSize: 'var(--font-size-sm)'
          }}>
            View Details →
          </button>
        </div>
      </div>
    </Link>
  )
}
