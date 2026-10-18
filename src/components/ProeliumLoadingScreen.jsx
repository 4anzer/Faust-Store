import React, { useState, useEffect, useRef } from 'react';
import { useCatalog } from '../context/CatalogContext';
import { Play, FastForward, Zap, ShieldAlert, CheckCircle2 } from 'lucide-react';

export function ProeliumLoadingScreen({ onFinish, forceShow = false }) {
  const { playSound, soundEnabled } = useCatalog();
  const [progress, setProgress] = useState(0);
  const [statusLog, setStatusLog] = useState('// INITIALIZING MEPHISTOPHELES ENGINE...');
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const audioTriggeredRef = useRef(false);

  // Trigger sound when component mounts
  useEffect(() => {
    const triggerAudio = () => {
      if (!audioTriggeredRef.current) {
        audioTriggeredRef.current = true;
        playSound('proelium');
      }
    };

    triggerAudio();

    // In case browser requires direct user interaction for Web Audio:
    const handleFirstGesture = () => {
      setHasInteracted(true);
      triggerAudio();
      window.removeEventListener('pointerdown', handleFirstGesture);
      window.removeEventListener('keydown', handleFirstGesture);
    };

    window.addEventListener('pointerdown', handleFirstGesture);
    window.addEventListener('keydown', handleFirstGesture);

    return () => {
      window.removeEventListener('pointerdown', handleFirstGesture);
      window.removeEventListener('keydown', handleFirstGesture);
    };
  }, [playSound]);

  // Loading progress sequence (approx 3.2 seconds total)
  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          return 100;
        }
        // Accelerate smoothly
        const step = prev < 30 ? 2 : prev < 75 ? 3 : 5;
        const next = Math.min(100, prev + step);

        // Update status text based on progress
        if (next < 25) {
          setStatusLog('// [STAGE 1] CONNECTING MEPHISTOPHELES BUS ENGINE...');
        } else if (next < 50) {
          setStatusLog('// [STAGE 2] CALIBRATING IDENTITIES, SHARDS & E.G.O THREATS...');
        } else if (next < 75) {
          setStatusLog('// [STAGE 3] SYNCHRONIZING REAL-TIME CATALOG & CLEARANCE...');
        } else if (next < 99) {
          setStatusLog('// [STAGE 4] VERIFYING EXECUTIVE ACCESS // ALLIANCE LEVEL 5...');
        } else {
          setStatusLog('// [COMPLETE] SYNCHRONIZATION SUCCESSFUL. ENTERING FAUST STORE.');
        }

        return next;
      });
    }, 45);

    return () => clearInterval(timer);
  }, []);

  // When progress reaches 100, wait briefly then fade out smoothly
  useEffect(() => {
    if (progress === 100) {
      playSound('equip');
      const timeout = setTimeout(() => {
        handleDismiss();
      }, 700);
      return () => clearTimeout(timeout);
    }
  }, [progress, playSound]);

  const handleDismiss = () => {
    setIsFadingOut(true);
    setTimeout(() => {
      if (onFinish) onFinish();
    }, 400);
  };

  // Allow ESC or Enter key to skip immediately
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') {
        handleDismiss();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div
      onClick={handleDismiss}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        background: 'radial-gradient(ellipse at center, rgba(80, 10, 18, 0.55) 0%, #08070b 65%, #030205 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '24px 20px',
        overflow: 'hidden',
        cursor: 'pointer',
        userSelect: 'none',
        opacity: isFadingOut ? 0 : 1,
        transform: isFadingOut ? 'scale(1.04)' : 'scale(1)',
        transition: 'opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1), transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        backdropFilter: 'blur(8px)'
      }}
    >
      {/* Background CRT Scanlines & Glitch Grid */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          backgroundImage: 'linear-gradient(rgba(18, 16, 26, 0) 50%, rgba(0, 0, 0, 0.4) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.03), rgba(0, 255, 0, 0.01), rgba(0, 0, 255, 0.03))',
          backgroundSize: '100% 4px, 6px 100%',
          opacity: 0.85
        }}
      />

      {/* Top Hazard Banner */}
      <div style={{ width: '100%', position: 'relative', zIndex: 2 }}>
        <div className="hazard-stripe" style={{ height: '4px', width: '100%', marginBottom: '14px' }} />
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '10px',
          color: 'var(--text-muted)',
          fontSize: '0.74rem',
          fontFamily: 'var(--font-mono)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{
              background: 'rgba(255, 42, 68, 0.2)',
              color: '#ff2a44',
              padding: '2px 8px',
              borderRadius: '2px',
              border: '1px solid #ff2a44',
              fontWeight: 800
            }}>
              ALERT // ALEPH
            </span>
            <span>MEPHISTOPHELES SYSTEM OVERRIDE</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <span style={{ color: '#f5c518' }}>SINNER CLEARANCE: DANTE</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDismiss();
              }}
              style={{
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                color: '#fff',
                padding: '4px 10px',
                borderRadius: '4px',
                fontSize: '0.7rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                fontFamily: 'var(--font-mono)'
              }}
              title="Lewati intro"
            >
              <FastForward size={12} />
              <span>LEWATI [ESC]</span>
            </button>
          </div>
        </div>
      </div>

      {/* Center Cinematic Content */}
      <div style={{
        position: 'relative',
        zIndex: 2,
        textAlign: 'center',
        maxWidth: '850px',
        margin: 'auto 0',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '22px'
      }}>
        {/* Animated Emblem Ring with Faust Store Logo */}
        <div style={{
          position: 'relative',
          width: '90px',
          height: '90px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {/* Rotating target reticle / warning circle */}
          <div style={{
            position: 'absolute',
            inset: '-10px',
            borderRadius: '50%',
            border: '2px dashed #ff2a44',
            opacity: 0.6,
            animation: 'spin 12s linear infinite'
          }} />

          {/* Secondary pulse ring */}
          <div style={{
            position: 'absolute',
            inset: '-18px',
            borderRadius: '50%',
            border: '1px solid rgba(255, 42, 68, 0.3)',
            animation: 'pulseGlow 2s ease-in-out infinite'
          }} />

          {/* Logo container */}
          <div style={{
            width: '80px',
            height: '80px',
            borderRadius: '12px',
            border: '2px solid #ff2a44',
            overflow: 'hidden',
            background: '#000',
            boxShadow: '0 0 24px rgba(255, 42, 68, 0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <img
              src="/logo.png"
              alt="Faust Store Emblem"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
        </div>

        {/* Cinematic Titles */}
        <div>
          <h1
            className="serif-title"
            style={{
              fontSize: 'clamp(2.4rem, 6vw, 4.4rem)',
              fontWeight: 900,
              letterSpacing: '0.18em',
              color: '#ffffff',
              margin: '0 0 8px 0',
              lineHeight: 1.1,
              textTransform: 'uppercase',
              textShadow: '0 0 15px rgba(255, 42, 68, 0.9), 0 0 35px rgba(255, 42, 68, 0.6), 0 0 70px rgba(255, 0, 51, 0.4)',
              animation: 'textGlitch 3s infinite'
            }}
          >
            PROELIUM FATALE
          </h1>

          <div style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 'clamp(0.78rem, 2vw, 1.05rem)',
            letterSpacing: '0.22em',
            color: '#f5c518',
            fontWeight: 700,
            textTransform: 'uppercase',
            textShadow: '0 0 10px rgba(245, 197, 24, 0.5)'
          }}>
            « LASCIATE OGNE SPERANZA, VOI CH'ENTRATE »
          </div>

          <div style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 'clamp(0.68rem, 1.5vw, 0.78rem)',
            letterSpacing: '0.12em',
            color: 'var(--text-muted)',
            marginTop: '6px'
          }}>
            [ ABANDON ALL HOPE, YE WHO ENTER HERE // FAUST STORE TERMINAL ]
          </div>
        </div>

        {/* Technical Loading Progress Bar */}
        <div style={{ width: '100%', maxWidth: '520px', marginTop: '10px' }}>
          
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.78rem',
            marginBottom: '8px'
          }}>
            <span style={{ color: 'var(--text-muted)' }}>SYNCING SINNER DATA...</span>
            <span style={{ color: '#ff2a44', fontWeight: 800 }}>{progress}%</span>
          </div>

          {/* Progress Bar Track */}
          <div style={{
            width: '100%',
            height: '10px',
            background: 'rgba(255, 255, 255, 0.06)',
            borderRadius: '2px',
            border: '1px solid rgba(255, 42, 68, 0.35)',
            overflow: 'hidden',
            position: 'relative',
            boxShadow: 'inset 0 0 8px rgba(0,0,0,0.8)'
          }}>
            <div style={{
              height: '100%',
              width: `${progress}%`,
              background: 'linear-gradient(90deg, #b026ff, #ff2a44, #ff5722)',
              boxShadow: '0 0 14px rgba(255, 42, 68, 0.9)',
              transition: 'width 0.08s ease-out'
            }} />
          </div>

          {/* Terminal Status Output */}
          <div style={{
            marginTop: '12px',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.74rem',
            color: progress === 100 ? '#10b981' : '#ff475e',
            letterSpacing: '0.04em',
            minHeight: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px'
          }}>
            {progress === 100 ? (
              <>
                <CheckCircle2 size={14} color="#10b981" />
                <span style={{ fontWeight: 800 }}>FAUST STORE IS ONLINE // KLIK UNTUK MASUK</span>
              </>
            ) : (
              <>
                <Zap size={13} className="blink" />
                <span>{statusLog}</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Hint */}
      <div style={{
        position: 'relative',
        zIndex: 2,
        width: '100%',
        textAlign: 'center'
      }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          background: 'rgba(0, 0, 0, 0.5)',
          padding: '6px 16px',
          borderRadius: '20px',
          border: '1px solid rgba(255, 42, 68, 0.3)',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.72rem',
          color: 'var(--text-muted)',
          marginBottom: '14px'
        }}>
          <span>KLIK DI MANA SAJA ATAU TEKAN</span>
          <kbd style={{
            background: 'rgba(255, 42, 68, 0.2)',
            color: '#ff2a44',
            padding: '2px 6px',
            borderRadius: '3px',
            border: '1px solid rgba(255, 42, 68, 0.4)',
            fontWeight: 800
          }}>
            ESC
          </kbd>
          <span>UNTUK MASUK LANGSUNG</span>
        </div>

        <div className="hazard-stripe" style={{ height: '4px', width: '100%' }} />
      </div>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes pulseGlow {
          0%, 100% { transform: scale(1); opacity: 0.3; }
          50% { transform: scale(1.08); opacity: 0.7; }
        }
        @keyframes textGlitch {
          0%, 100% { text-shadow: 0 0 15px rgba(255, 42, 68, 0.9), 0 0 35px rgba(255, 42, 68, 0.6); }
          50% { text-shadow: -2px 0 #00ffff, 2px 0 #ff0055, 0 0 25px rgba(255, 42, 68, 0.95); }
          52% { text-shadow: 0 0 15px rgba(255, 42, 68, 0.9); }
        }
      `}</style>
    </div>
  );
}
