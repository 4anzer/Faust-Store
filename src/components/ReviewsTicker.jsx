import React from 'react';
import { useCatalog } from '../context/CatalogContext';
import { Star, ShieldCheck, MessageSquareQuote, Sparkles } from 'lucide-react';

export function ReviewsTicker() {
  const { reviews } = useCatalog();

  if (!reviews || reviews.length === 0) return null;

  // Duplicate list to achieve a continuous, seamless infinite loop
  const duplicatedReviews = [...reviews, ...reviews];

  const formatTimeAgo = (dateStr) => {
    try {
      const diff = Date.now() - new Date(dateStr).getTime();
      const hours = Math.floor(diff / (1000 * 60 * 60));
      if (hours < 1) return 'Just now';
      if (hours < 24) return `${hours}h ago`;
      const days = Math.floor(hours / 24);
      return `${days}d ago`;
    } catch {
      return 'Recently';
    }
  };

  return (
    <section style={{
      margin: '40px auto 10px auto',
      width: '100%',
      position: 'relative',
      zIndex: 2,
      overflow: 'hidden'
    }}>
      {/* Ticker Header */}
      <div style={{
        maxWidth: '1350px',
        margin: '0 auto 16px auto',
        padding: '0 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '10px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Sparkles size={16} color="#f5c518" />
          <span className="serif-title" style={{ fontSize: '1.1rem', fontWeight: 900, color: 'var(--text-main)', letterSpacing: '0.04em' }}>
            VERIFIED CUSTOMER REVIEWS
          </span>
          <span className="badge" style={{
            background: 'rgba(245, 197, 24, 0.15)',
            color: '#f5c518',
            border: '1px solid #f5c518',
            fontSize: '0.68rem',
            fontWeight: 800
          }}>
            100% VERIFIED
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div style={{ display: 'flex', gap: '2px' }}>
            {[1, 2, 3, 4, 5].map((s) => (
              <Star key={s} size={13} fill="#f5c518" color="#f5c518" />
            ))}
          </div>
          <span className="mono" style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            Average: <strong style={{ color: '#f5c518' }}>5.0</strong> ({reviews.length} reviews)
          </span>
        </div>
      </div>

      {/* Edge gradient fade overlays for smooth cinematic entrance/exit */}
      <div style={{
        position: 'relative',
        width: '100%',
        overflow: 'hidden',
        padding: '6px 0'
      }}>
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          bottom: 0,
          width: '60px',
          background: 'linear-gradient(90deg, var(--bg-primary) 0%, transparent 100%)',
          zIndex: 5,
          pointerEvents: 'none'
        }} />

        <div style={{
          position: 'absolute',
          top: 0,
          right: 0,
          bottom: 0,
          width: '60px',
          background: 'linear-gradient(270deg, var(--bg-primary) 0%, transparent 100%)',
          zIndex: 5,
          pointerEvents: 'none'
        }} />

        {/* Continuous Infinite Scrolling Marquee Track */}
        <div className="reviews-marquee-track">
          {duplicatedReviews.map((rev, index) => (
            <div
              key={`${rev.id}-${index}`}
              className="review-marquee-card"
              style={{
                flex: '0 0 320px',
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-color)',
                borderRadius: '6px',
                padding: '14px 16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                boxShadow: '0 4px 14px rgba(0, 0, 0, 0.4)',
                transition: 'border-color 0.2s ease, transform 0.2s ease',
                cursor: 'default'
              }}
            >
              {/* Card Top: Customer Name & Game Badge */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <ShieldCheck size={14} color="#10b981" />
                  <span className="mono" style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-main)' }}>
                    {rev.customerName || 'Anonymous Operative'}
                  </span>
                </div>

                <span style={{
                  background: 'var(--bg-tertiary)',
                  border: '1px solid var(--border-color)',
                  color: 'var(--accent-secondary)',
                  fontSize: '0.64rem',
                  fontFamily: 'var(--font-mono)',
                  fontWeight: 700,
                  padding: '2px 6px',
                  borderRadius: '2px'
                }}>
                  {rev.game || 'Item'}
                </span>
              </div>

              {/* Stars */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={12}
                    fill={i < (rev.rating || 5) ? '#f5c518' : 'none'}
                    color={i < (rev.rating || 5) ? '#f5c518' : 'var(--text-muted)'}
                  />
                ))}
                <span className="mono" style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginLeft: '6px' }}>
                  {formatTimeAgo(rev.createdAt)}
                </span>
              </div>

              {/* Review Comment */}
              <p style={{
                fontSize: '0.82rem',
                color: '#d1d5db',
                lineHeight: '1.45',
                margin: 0,
                display: '-webkit-box',
                WebkitLineClamp: 3,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}>
                "{rev.comment}"
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Marquee Animation Styles */}
      <style>{`
        .reviews-marquee-track {
          display: flex;
          gap: 16px;
          width: max-content;
          animation: continuousReviewsMarquee 38s linear infinite;
        }

        .reviews-marquee-track:hover {
          animation-play-state: paused;
        }

        .review-marquee-card:hover {
          border-color: #f5c518 !important;
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(245, 197, 24, 0.15) !important;
        }

        @keyframes continuousReviewsMarquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </section>
  );
}
