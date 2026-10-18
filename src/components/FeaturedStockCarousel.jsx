import React, { useState, useEffect, useRef } from 'react';
import { useCatalog } from '../context/CatalogContext';
import { THREAT_LEVELS } from '../data/defaultData';
import { 
  ChevronLeft, 
  ChevronRight, 
  ExternalLink, 
  Gamepad2, 
  Sparkles,
  Layers
} from 'lucide-react';

export function FeaturedStockCarousel({ onInspect }) {
  const { items, playSound } = useCatalog();

  // Filter only items that are strictly in stock
  const inStockItems = items.filter((item) => (item.stock || 0) > 0);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef(null);

  // Auto-slide every 4.5 seconds
  useEffect(() => {
    if (inStockItems.length <= 1 || isPaused) return;

    timerRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % inStockItems.length);
    }, 4500);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [inStockItems.length, isPaused]);

  if (inStockItems.length === 0) return null;

  const currentItem = inStockItems[currentIndex] || inStockItems[0];
  const threat = THREAT_LEVELS[currentItem?.threat] || {
    name: currentItem?.threat || 'SAFE',
    color: '#00f0ff',
    bg: 'rgba(0, 240, 255, 0.15)'
  };

  const handlePrev = (e) => {
    e.stopPropagation();
    playSound('click');
    setCurrentIndex((prev) => (prev - 1 + inStockItems.length) % inStockItems.length);
  };

  const handleNext = (e) => {
    e.stopPropagation();
    playSound('click');
    setCurrentIndex((prev) => (prev + 1) % inStockItems.length);
  };

  const handleSelectDot = (idx, e) => {
    e.stopPropagation();
    playSound('click');
    setCurrentIndex(idx);
  };

  // Determine game-specific button label
  const isRoblox = currentItem.game?.toLowerCase().includes('roblox');
  const isSteam = currentItem.game?.toLowerCase().includes('steam') || currentItem.game?.toLowerCase().includes('cs2');
  
  const ctaLabel = isRoblox 
    ? "ROBLOX ITEM ↗" 
    : isSteam 
    ? "STEAM TRADE ↗" 
    : "INSPECT ITEM ↗";

  return (
    <div style={{
      maxWidth: '1350px',
      margin: '18px auto 8px auto',
      padding: '0 20px',
      width: '100%',
      position: 'relative',
      zIndex: 2
    }}>
      <div 
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        style={{
          position: 'relative',
          height: '260px',
          borderRadius: '8px',
          overflow: 'hidden',
          border: '1.5px solid var(--border-color)',
          boxShadow: '0 8px 30px rgba(0, 0, 0, 0.8), 0 0 20px rgba(255, 42, 68, 0.08)',
          background: '#07060a',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          transition: 'border-color 0.3s ease'
        }}
      >
        {/* Background Artwork Image with Atmospheric Gradient & Scanlines */}
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `url(${currentItem.image})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'brightness(0.65) contrast(1.15) saturate(1.1)',
          transform: 'scale(1.02)',
          transition: 'background-image 0.5s ease-in-out, filter 0.3s ease'
        }} />

        {/* Cinematic Vignette & Dark Gradient Overlay */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(180deg, rgba(7,6,10,0.5) 0%, rgba(7,6,10,0.3) 40%, rgba(7,6,10,0.95) 100%), radial-gradient(circle at 80% 50%, rgba(0,0,0,0.2) 0%, rgba(7,6,10,0.85) 100%)',
          pointerEvents: 'none'
        }} />

        {/* Scanline CRT Texture */}
        <div className="scanlines" style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.15,
          pointerEvents: 'none'
        }} />

        {/* Top Header Row of Carousel */}
        <div style={{
          position: 'relative',
          zIndex: 5,
          padding: '12px 18px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          {/* Live In-Stock Indicator */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(7, 6, 10, 0.82)',
            padding: '4px 10px',
            borderRadius: '4px',
            border: '1px solid var(--border-color)',
            backdropFilter: 'blur(6px)'
          }}>
            <span style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: '#10b981',
              boxShadow: '0 0 8px #10b981',
              display: 'inline-block'
            }} />
            <span className="mono" style={{ fontSize: '0.72rem', color: '#10b981', fontWeight: 800 }}>
              LIVE IN-STOCK ARTIFACTS
            </span>
          </div>

          {/* Right Top Status (Realm / Containment badge like reference image) */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(7, 6, 10, 0.85)',
            border: '1px solid rgba(0, 240, 255, 0.35)',
            padding: '4px 10px',
            borderRadius: '4px',
            fontSize: '0.74rem',
            fontFamily: 'var(--font-mono)',
            backdropFilter: 'blur(6px)'
          }}>
            <Layers size={13} color="#00f0ff" />
            <span style={{ color: 'var(--text-muted)' }}>SECTOR:</span>
            <span style={{ color: '#00f0ff', fontWeight: 800 }}>AUTO-ROTATION</span>
          </div>
        </div>

        {/* Navigation Arrow: Left (<) */}
        <button
          onClick={handlePrev}
          aria-label="Previous In-Stock Item"
          style={{
            position: 'absolute',
            left: '12px',
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 10,
            width: '36px',
            height: '48px',
            background: 'rgba(7, 6, 10, 0.85)',
            border: '1px solid var(--border-color)',
            color: 'var(--text-main)',
            borderRadius: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
            transition: 'background 0.2s ease, border-color 0.2s ease, transform 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = 'var(--accent-primary)';
            e.currentTarget.style.background = 'rgba(255, 42, 68, 0.2)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'var(--border-color)';
            e.currentTarget.style.background = 'rgba(7, 6, 10, 0.85)';
          }}
        >
          <ChevronLeft size={22} />
        </button>

        {/* Navigation Arrow: Right (>) */}
        <button
          onClick={handleNext}
          aria-label="Next In-Stock Item"
          style={{
            position: 'absolute',
            right: '12px',
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 10,
            width: '36px',
            height: '48px',
            background: 'rgba(7, 6, 10, 0.85)',
            border: '1px solid var(--border-color)',
            color: 'var(--text-main)',
            borderRadius: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
            transition: 'background 0.2s ease, border-color 0.2s ease, transform 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = 'var(--accent-primary)';
            e.currentTarget.style.background = 'rgba(255, 42, 68, 0.2)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'var(--border-color)';
            e.currentTarget.style.background = 'rgba(7, 6, 10, 0.85)';
          }}
        >
          <ChevronRight size={22} />
        </button>

        {/* Bottom Content Row */}
        <div style={{
          position: 'relative',
          zIndex: 5,
          padding: '14px 52px',
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          {/* Item Details: Tag, Title & Subtitle */}
          <div style={{ maxWidth: '650px', flex: '1 1 240px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span style={{
                background: 'rgba(16, 185, 129, 0.2)',
                color: '#10b981',
                border: '1px solid #10b981',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.68rem',
                fontWeight: 800,
                padding: '2px 8px',
                borderRadius: '3px',
                letterSpacing: '0.06em'
              }}>
                {currentItem.game?.toUpperCase()}
              </span>

              <span style={{
                background: threat.bg,
                color: threat.color,
                border: `1px solid ${threat.color}`,
                fontFamily: 'var(--font-mono)',
                fontSize: '0.68rem',
                fontWeight: 800,
                padding: '2px 7px',
                borderRadius: '3px'
              }}>
                {threat.name}
              </span>
            </div>

            <h2 className="serif-title" style={{
              fontSize: 'clamp(1.05rem, 3.8vw, 1.55rem)',
              fontWeight: 900,
              color: '#f5c518',
              letterSpacing: '0.03em',
              textShadow: '0 0 16px rgba(245, 197, 24, 0.5), 0 2px 4px rgba(0,0,0,0.8)',
              margin: 0,
              lineHeight: 1.25,
              wordBreak: 'break-word'
            }}>
              {currentItem.name?.toUpperCase()}
            </h2>
          </div>

          {/* Center-Bottom Pagination Dots */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            background: 'rgba(7, 6, 10, 0.7)',
            padding: '5px 10px',
            borderRadius: '20px',
            border: '1px solid var(--border-color)',
            backdropFilter: 'blur(6px)'
          }}>
            {inStockItems.slice(0, 8).map((_, idx) => (
              <button
                key={idx}
                onClick={(e) => handleSelectDot(idx, e)}
                aria-label={`Go to slide ${idx + 1}`}
                style={{
                  width: idx === currentIndex ? '16px' : '7px',
                  height: '7px',
                  borderRadius: '3px',
                  background: idx === currentIndex ? '#f5c518' : 'rgba(255,255,255,0.25)',
                  boxShadow: idx === currentIndex ? '0 0 8px #f5c518' : 'none',
                  border: 'none',
                  padding: 0,
                  cursor: 'pointer',
                  transition: 'all 0.25s ease'
                }}
              />
            ))}
          </div>

          {/* Right Bottom: Stock Count Box & Action Button */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {/* Stock Count Box (like the '46 ITEMS' box in reference image) */}
            <div style={{
              background: 'rgba(13, 11, 17, 0.92)',
              border: '1px solid var(--border-color)',
              padding: '6px 12px',
              borderRadius: '4px',
              textAlign: 'center',
              boxShadow: '0 2px 8px rgba(0,0,0,0.6)'
            }}>
              <div className="mono" style={{ fontSize: '1.05rem', fontWeight: 900, color: '#f5c518' }}>
                {currentItem.stock}
              </div>
              <div className="mono" style={{ fontSize: '0.62rem', color: 'var(--text-muted)', letterSpacing: '0.05em' }}>
                IN STOCK
              </div>
            </div>

            {/* Glowing CTA Button */}
            <button
              onClick={() => onInspect(currentItem)}
              style={{
                background: 'linear-gradient(135deg, #ffd166 0%, #f5c518 100%)',
                color: '#07060a',
                border: 'none',
                padding: '10px 16px',
                borderRadius: '4px',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.82rem',
                fontWeight: 900,
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer',
                boxShadow: '0 0 16px rgba(245, 197, 24, 0.6), inset 0 1px 1px rgba(255,255,255,0.6)',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 0 24px rgba(245, 197, 24, 0.85)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 0 16px rgba(245, 197, 24, 0.6)';
              }}
            >
              <Gamepad2 size={16} />
              <span>{ctaLabel}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
