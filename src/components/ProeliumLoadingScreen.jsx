import React, { useState, useEffect, useRef } from 'react';
import { useCatalog } from '../context/CatalogContext';
import { FastForward } from 'lucide-react';

export function ProeliumLoadingScreen({ onFinish }) {
  const { playSound } = useCatalog();
  const [phase, setPhase] = useState('blackout'); // 'blackout' -> 'slam' -> 'sustain' -> 'slash_exit'
  const audioTriggeredRef = useRef(false);

  // Trigger audio & sequence lifecycle
  useEffect(() => {
    // Phase 1: Quick initial blackout & slash flash (0ms - 200ms)
    const t0 = setTimeout(() => {
      setPhase('slam');
      if (!audioTriggeredRef.current) {
        audioTriggeredRef.current = true;
        playSound('proelium');
      }
    }, 180);

    // Phase 2: Sustain epic tension (200ms - 2700ms)
    const t1 = setTimeout(() => {
      setPhase('sustain');
    }, 600);

    // Phase 3: Slash cut exit (2700ms - 3100ms)
    const t2 = setTimeout(() => {
      setPhase('slash_exit');
    }, 2800);

    // Phase 4: Finish & unmount
    const t3 = setTimeout(() => {
      if (onFinish) onFinish();
    }, 3250);

    // User gesture handler (in case browser autoplay policies require interaction)
    const handleGesture = () => {
      if (!audioTriggeredRef.current) {
        audioTriggeredRef.current = true;
        playSound('proelium');
      }
    };
    window.addEventListener('pointerdown', handleGesture, { once: true });
    window.addEventListener('keydown', handleGesture, { once: true });

    return () => {
      clearTimeout(t0);
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      window.removeEventListener('pointerdown', handleGesture);
      window.removeEventListener('keydown', handleGesture);
    };
  }, [playSound, onFinish]);

  // Click anywhere or press ESC / Space to exit immediately
  const handleSkip = () => {
    setPhase('slash_exit');
    setTimeout(() => {
      if (onFinish) onFinish();
    }, 350);
  };

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') {
        handleSkip();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <div
      onClick={handleSkip}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        background: '#040306',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        userSelect: 'none',
        cursor: 'pointer'
      }}
    >
      {/* 1. Slash Flash Streaks (triggers during slam) */}
      <div
        className={`proelium-streak-slash ${phase === 'slam' ? 'active' : ''}`}
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          zIndex: 5
        }}
      />

      {/* 2. Red Atmospheric Vignette & CRT Scanlines */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(circle at center, rgba(160, 18, 30, 0.45) 0%, rgba(30, 4, 8, 0.8) 55%, #050407 100%)',
          pointerEvents: 'none',
          zIndex: 1,
          opacity: phase === 'blackout' ? 0 : 1,
          transition: 'opacity 0.2s ease-out'
        }}
      />

      <div
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          backgroundImage: 'linear-gradient(rgba(18, 16, 26, 0) 50%, rgba(0, 0, 0, 0.45) 50%)',
          backgroundSize: '100% 4px',
          opacity: 0.75,
          zIndex: 2
        }}
      />

      {/* 3. Occult / Runic Star Geometric Ring (Project Moon Style) */}
      <div
        style={{
          position: 'absolute',
          width: 'min(85vw, 680px)',
          height: 'min(85vw, 680px)',
          pointerEvents: 'none',
          zIndex: 3,
          opacity: phase === 'blackout' ? 0 : 0.85,
          transform: phase === 'slam' ? 'scale(1.15) rotate(5deg)' : 'scale(1) rotate(0deg)',
          transition: 'transform 0.4s cubic-bezier(0.1, 0.9, 0.2, 1), opacity 0.3s ease-out',
          animation: 'proeliumRunicSpin 30s linear infinite'
        }}
      >
        <svg viewBox="0 0 500 500" width="100%" height="100%" style={{ overflow: 'visible' }}>
          {/* Outer circle with glow */}
          <circle cx="250" cy="250" r="230" fill="none" stroke="#ff1f35" strokeWidth="2.5" opacity="0.7" />
          <circle cx="250" cy="250" r="215" fill="none" stroke="#ff1f35" strokeWidth="1" strokeDasharray="6, 6" opacity="0.6" />
          
          {/* Middle geometric occult rings */}
          <circle cx="250" cy="250" r="160" fill="none" stroke="#ff1f35" strokeWidth="1.5" opacity="0.5" />
          <circle cx="250" cy="250" r="110" fill="none" stroke="#ff1f35" strokeWidth="2" strokeDasharray="12, 8" opacity="0.65" />

          {/* 7-Pointed / Occult Geometric Star Lines */}
          <polygon
            points="250,30 390,430 40,180 460,180 110,430"
            fill="none"
            stroke="#ff1f35"
            strokeWidth="1.8"
            opacity="0.45"
          />
          <polygon
            points="250,470 110,70 460,320 40,320 390,70"
            fill="none"
            stroke="#ff1f35"
            strokeWidth="1.2"
            opacity="0.35"
          />

          {/* Compass / Reticle Crosshairs */}
          <line x1="250" y1="10" x2="250" y2="490" stroke="#ff1f35" strokeWidth="1" strokeDasharray="8, 8" opacity="0.4" />
          <line x1="10" y1="250" x2="490" y2="250" stroke="#ff1f35" strokeWidth="1" strokeDasharray="8, 8" opacity="0.4" />

          {/* Dial Ticks */}
          {[...Array(24)].map((_, i) => (
            <line
              key={i}
              x1="250"
              y1="25"
              x2="250"
              y2={i % 6 === 0 ? "42" : "34"}
              stroke="#ff1f35"
              strokeWidth={i % 6 === 0 ? "2.5" : "1.2"}
              opacity={i % 6 === 0 ? "0.9" : "0.5"}
              transform={`rotate(${i * 15} 250 250)`}
            />
          ))}
        </svg>
      </div>

      {/* 4. Center Typography: PROELIUM FATALE */}
      <div
        className={`proelium-text-container ${phase}`}
        style={{
          position: 'relative',
          zIndex: 10,
          textAlign: 'center',
          padding: '0 20px',
          maxWidth: '1200px'
        }}
      >
        {/* Main Title: PROELIUM FATALE */}
        <h1
          className="proelium-main-title"
          style={{
            margin: 0,
            fontSize: 'clamp(2.8rem, 8.5vw, 6.2rem)',
            fontWeight: 900,
            fontFamily: "'Cinzel', 'Rajdhani', sans-serif",
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: '#ff1929',
            lineHeight: 1.05,
            textShadow: '0 0 25px rgba(255, 25, 41, 0.95), 0 0 55px rgba(255, 25, 41, 0.7), 0 0 90px rgba(230, 0, 25, 0.5)',
            transform: 'scaleY(1.08)'
          }}
        >
          PROELIUM FATALE
        </h1>

        {/* Subtext: Dante's Inferno Quote */}
        <div
          className="proelium-subtext"
          style={{
            marginTop: '14px',
            fontSize: 'clamp(0.85rem, 2.4vw, 1.45rem)',
            fontWeight: 800,
            fontFamily: "'JetBrains Mono', 'Rajdhani', monospace",
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            color: '#f6c824',
            textShadow: '0 0 12px rgba(246, 200, 36, 0.8), 0 0 25px rgba(246, 200, 36, 0.4)'
          }}
        >
          LASCIATE OGNI SPERANZA, VOI CH'ENTRATE
        </div>

        {/* Store Identifier Tag */}
        <div
          style={{
            marginTop: '16px',
            fontFamily: "'Share Tech Mono', monospace",
            fontSize: 'clamp(0.68rem, 1.6vw, 0.84rem)',
            letterSpacing: '0.26em',
            color: 'rgba(255, 255, 255, 0.55)',
            textTransform: 'uppercase'
          }}
        >
          // FAUST STORE // ANOMALY TRANSACTION ENGAGED
        </div>
      </div>

      {/* 5. Top & Bottom Hazard Bars */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '5px',
          zIndex: 12
        }}
        className="hazard-stripe"
      />
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '5px',
          zIndex: 12
        }}
        className="hazard-stripe"
      />

      {/* 6. Discreet Skip Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          handleSkip();
        }}
        style={{
          position: 'absolute',
          bottom: '24px',
          right: '24px',
          zIndex: 20,
          background: 'rgba(0, 0, 0, 0.6)',
          border: '1px solid rgba(255, 25, 41, 0.4)',
          color: 'rgba(255, 255, 255, 0.75)',
          padding: '6px 14px',
          borderRadius: '4px',
          fontSize: '0.74rem',
          fontFamily: "'JetBrains Mono', monospace",
          letterSpacing: '0.08em',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          transition: 'all 0.2s ease'
        }}
        title="Lewati intro langsung"
      >
        <FastForward size={13} color="#ff1929" />
        <span>SKIP SEQUENCE [ESC]</span>
      </button>

      {/* In-Game Slash / Shake / Glitch Keyframe Styles */}
      <style>{`
        @keyframes proeliumRunicSpin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        /* Initial Screen Slam & Shake */
        .proelium-text-container.slam {
          animation: proeliumImpactSlam 0.45s cubic-bezier(0.1, 0.9, 0.2, 1) forwards;
        }

        .proelium-text-container.sustain {
          animation: proeliumHeartbeat 2.2s ease-in-out infinite alternate;
        }

        .proelium-text-container.slash_exit {
          animation: proeliumSlashExit 0.35s cubic-bezier(0.8, 0, 0.2, 1) forwards;
        }

        @keyframes proeliumImpactSlam {
          0% {
            opacity: 0;
            transform: scale(1.6) translateY(-20px);
            filter: blur(12px);
          }
          40% {
            opacity: 1;
            transform: scale(0.97) translateY(4px);
            filter: blur(0);
          }
          70% {
            transform: scale(1.03) translateY(-2px);
          }
          100% {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        @keyframes proeliumHeartbeat {
          0% {
            transform: scale(1);
            filter: drop-shadow(0 0 15px rgba(255, 25, 41, 0.8));
          }
          50% {
            transform: scale(1.025);
            filter: drop-shadow(0 0 30px rgba(255, 25, 41, 1));
          }
          100% {
            transform: scale(1);
            filter: drop-shadow(0 0 15px rgba(255, 25, 41, 0.8));
          }
        }

        @keyframes proeliumSlashExit {
          0% {
            opacity: 1;
            transform: scale(1) skewX(0deg);
          }
          40% {
            opacity: 0.9;
            transform: scale(1.1) skewX(-15deg);
            filter: brightness(2);
          }
          100% {
            opacity: 0;
            transform: scale(1.3) skewX(30deg);
            filter: blur(16px);
          }
        }

        /* Slash Blade Streaks */
        .proelium-streak-slash.active {
          animation: slashStreakFlash 0.35s ease-out forwards;
        }

        @keyframes slashStreakFlash {
          0% {
            background: linear-gradient(135deg, transparent 40%, rgba(255, 25, 41, 0.85) 48%, #fff 50%, rgba(255, 25, 41, 0.85) 52%, transparent 60%);
            opacity: 1;
            transform: scale(1.5) rotate(-10deg);
          }
          60% {
            opacity: 0.6;
            background: linear-gradient(-135deg, transparent 42%, rgba(255, 25, 41, 0.7) 49%, #fff 50%, rgba(255, 25, 41, 0.7) 51%, transparent 58%);
          }
          100% {
            opacity: 0;
            transform: scale(1) rotate(0deg);
          }
        }
      `}</style>
    </div>
  );
}
