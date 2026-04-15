      {/* Why Choose Us */}
      <section className="features-section">
        <div className="container">
          <div className="features-header">
            <h2 className="features-title">Why Choose TOURTRAVEL?</h2>
            <p className="features-subtitle">
              We're committed to providing exceptional travel experiences with personalized service and attention to detail.
            </p>
          </div>

          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon-wrapper">🏆</div>
              <h3 className="feature-card-title">Expert Guides</h3>
              <p className="feature-card-desc">
                Our certified local guides provide authentic experiences and deep insights into each destination.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon-wrapper">🛡️</div>
              <h3 className="feature-card-title">Safe & Secure</h3>
              <p className="feature-card-desc">
                Your safety is our priority with comprehensive travel insurance and 24/7 support throughout your journey.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon-wrapper">💰</div>
              <h3 className="feature-card-title">Best Price Guarantee</h3>
              <p className="feature-card-desc">
                We offer competitive pricing and match or beat any comparable tour package you find elsewhere.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon-wrapper">🌍</div>
              <h3 className="feature-card-title">Sustainable Travel</h3>
              <p className="feature-card-desc">
                We partner with eco-friendly accommodations and support local conservation initiatives.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="testimonials-section">
        <div className="container">
          <div className="features-header">
            <h2 className="features-title">What Our Travelers Say</h2>
            <p className="features-subtitle">
              Don't just take our word for it. Here's what our satisfied customers have to say about their experiences.
            </p>
          </div>

          <div className="testimonials-grid">
            <div className="testimonial-card">
              <div className="testimonial-stars">
                {[...Array(5)].map((_, i) => (
                  <span key={i}>⭐</span>
                ))}
              </div>
              <p className="testimonial-text">
                "The Swiss Alps tour exceeded all our expectations. The scenery was breathtaking, and our guide was incredibly knowledgeable. Every detail was perfectly organized!"
              </p>
              <div className="testimonial-author-row">
                <div className="testimonial-avatar" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1494790108755-2616b612b786?w=48)' }}></div>
                <div>
                  <p className="testimonial-author-name">Sarah Johnson</p>
                  <p className="testimonial-author-loc">New York, USA</p>
                </div>
              </div>
            </div>

            <div className="testimonial-card">
              <div className="testimonial-stars">
                {[...Array(5)].map((_, i) => (
                  <span key={i}>⭐</span>
                ))}
              </div>
              <p className="testimonial-text">
                "From start to finish, this was an incredible experience. The accommodations were luxurious, the food was amazing, and the activities were perfectly paced."
              </p>
              <div className="testimonial-author-row">
                <div className="testimonial-avatar" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=48)' }}></div>
                <div>
                  <p className="testimonial-author-name">Michael Chen</p>
                  <p className="testimonial-author-loc">Toronto, Canada</p>
                </div>
              </div>
            </div>

            <div className="testimonial-card">
              <div className="testimonial-stars">
                {[...Array(5)].map((_, i) => (
                  <span key={i}>⭐</span>
                ))}
              </div>
              <p className="testimonial-text">
                "TOURTRAVEL made our honeymoon absolutely perfect. The attention to detail and personalized service made us feel special throughout our entire trip."
              </p>
              <div className="testimonial-author-row">
                <div className="testimonial-avatar" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=48)' }}></div>
                <div>
                  <p className="testimonial-author-name">Emma Rodriguez</p>
                  <p className="testimonial-author-loc">Barcelona, Spain</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="newsletter-section">
        <div className="container">
          <h2 className="newsletter-title">Stay Updated</h2>
          <p className="newsletter-subtitle">
            Subscribe to our newsletter and be the first to know about exclusive deals, new destinations, and travel tips.
          </p>

          <form onSubmit={handleNewsletterSubmit} className="newsletter-form">
            <input
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="newsletter-input"
            />
            <button
              type="submit"
              className="newsletter-button"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </div>
  )
}