export default function Hero() {
  return (
    <section style={{
      background: 'var(--gradient-hero)',
      color: 'var(--text-white)',
      padding: 'var(--spacing-2xl) 0',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background Pattern */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        opacity: 0.1,
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
      }}></div>

      <div className="container" style={{
        position: 'relative',
        zIndex: 2,
        textAlign: 'center'
      }}>
        <h1 style={{
          fontSize: 'var(--font-size-5xl)',
          fontWeight: 'bold',
          marginBottom: 'var(--spacing-lg)',
          lineHeight: '1.1'
        }}>
          Discover Your Next
          <br />
          <span style={{
            background: 'var(--gradient-secondary)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            Adventure
          </span>
        </h1>

        <p style={{
          fontSize: 'var(--font-size-xl)',
          marginBottom: 'var(--spacing-2xl)',
          opacity: 0.9,
          maxWidth: '600px',
          margin: '0 auto var(--spacing-2xl)'
        }}>
          Explore breathtaking destinations, create unforgettable memories, and embark on journeys that will change your perspective forever.
        </p>

        {/* Search Bar */}
        <div style={{
          background: 'var(--bg-white)',
          borderRadius: 'var(--radius-xl)',
          padding: 'var(--spacing-sm)',
          boxShadow: 'var(--shadow-xl)',
          maxWidth: '600px',
          margin: '0 auto var(--spacing-xl)',
          display: 'flex',
          gap: 'var(--spacing-sm)',
          flexWrap: 'wrap'
        }}>
          <input
            type="text"
            placeholder="Where do you want to go?"
            style={{
              flex: 1,
              minWidth: '200px',
              padding: 'var(--spacing-md)',
              border: 'none',
              outline: 'none',
              fontSize: 'var(--font-size-base)',
              borderRadius: 'var(--radius-md)',
              background: 'var(--bg-gray-50)'
            }}
          />
          <input
            type="date"
            style={{
              padding: 'var(--spacing-md)',
              border: 'none',
              outline: 'none',
              fontSize: 'var(--font-size-base)',
              borderRadius: 'var(--radius-md)',
              background: 'var(--bg-gray-50)'
            }}
          />
          <button className="btn btn-primary" style={{
            padding: 'var(--spacing-md) var(--spacing-xl)',
            fontSize: 'var(--font-size-base)',
            fontWeight: '600'
          }}>
            🔍 Search
          </button>
        </div>

        {/* Stats */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: 'var(--spacing-2xl)',
          flexWrap: 'wrap'
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{
              fontSize: 'var(--font-size-3xl)',
              fontWeight: 'bold',
              marginBottom: 'var(--spacing-xs)'
            }}>
              500+
            </div>
            <div style={{
              fontSize: 'var(--font-size-sm)',
              opacity: 0.8,
              textTransform: 'uppercase',
              letterSpacing: '0.1em'
            }}>
              Destinations
            </div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{
              fontSize: 'var(--font-size-3xl)',
              fontWeight: 'bold',
              marginBottom: 'var(--spacing-xs)'
            }}>
              10K+
            </div>
            <div style={{
              fontSize: 'var(--font-size-sm)',
              opacity: 0.8,
              textTransform: 'uppercase',
              letterSpacing: '0.1em'
            }}>
              Happy Travelers
            </div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{
              fontSize: 'var(--font-size-3xl)',
              fontWeight: 'bold',
              marginBottom: 'var(--spacing-xs)'
            }}>
              98%
            </div>
            <div style={{
              fontSize: 'var(--font-size-sm)',
              opacity: 0.8,
              textTransform: 'uppercase',
              letterSpacing: '0.1em'
            }}>
              Satisfaction Rate
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
