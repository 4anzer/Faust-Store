import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Music, Disc } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export function AmbientBgmPlayer() {
  const { t } = useLanguage();
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    // Initialize audio element at 100% volume (locked, unchangeable)
    const audio = new Audio('/audio/bgm.mp3');
    audio.loop = true;
    audio.volume = 1.0;
    audioRef.current = audio;

    // Immediately attempt autoplay
    audio.play()
      .then(() => setIsPlaying(true))
      .catch(() => {
        // Browser autoplay restriction, will activate on first interaction
      });

    // Ensure audio starts on first user interaction anywhere
    const handleGesture = () => {
      if (audioRef.current) {
        audioRef.current.volume = 1.0;
        audioRef.current.play()
          .then(() => setIsPlaying(true))
          .catch(() => {});
      }
    };

    window.addEventListener('pointerdown', handleGesture, { once: true });
    window.addEventListener('keydown', handleGesture, { once: true });
    window.addEventListener('scroll', handleGesture, { once: true });

    return () => {
      window.removeEventListener('pointerdown', handleGesture);
      window.removeEventListener('keydown', handleGesture);
      window.removeEventListener('scroll', handleGesture);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play()
        .then(() => {
          setIsPlaying(true);
          setHasStartedOnce(true);
        })
        .catch((err) => {
          console.warn("Audio playback blocked", err);
        });
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        background: 'rgba(255, 42, 68, 0.08)',
        border: '1px solid rgba(255, 42, 68, 0.3)',
        borderRadius: '4px',
        padding: '4px 9px',
        transition: 'all 0.2s ease'
      }}
      title={isPlaying ? t('bgmPause') : t('bgmPlay')}
    >
      <button
        onClick={togglePlay}
        style={{
          background: 'transparent',
          border: 'none',
          padding: 0,
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          color: isPlaying ? 'var(--accent-primary)' : 'var(--text-muted)',
          cursor: 'pointer',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.72rem'
        }}
      >
        <Music 
          size={14} 
          style={{
            animation: isPlaying ? 'discSpin 4s linear infinite' : 'none'
          }} 
        />
        <span style={{ fontWeight: 700 }}>BGM</span>

        {/* Animated Equalizer Wave Bars */}
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '2px', height: '12px', width: '14px' }}>
          <span className={`eq-bar ${isPlaying ? 'playing' : ''}`} style={{ animationDelay: '0.1s' }} />
          <span className={`eq-bar ${isPlaying ? 'playing' : ''}`} style={{ animationDelay: '0.3s' }} />
          <span className={`eq-bar ${isPlaying ? 'playing' : ''}`} style={{ animationDelay: '0.2s' }} />
          <span className={`eq-bar ${isPlaying ? 'playing' : ''}`} style={{ animationDelay: '0.4s' }} />
        </div>
      </button>

      <style>{`
        @keyframes discSpin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .eq-bar {
          width: 2px;
          height: 3px;
          background: var(--text-muted);
          border-radius: 1px;
          transition: height 0.2s ease;
        }
        .eq-bar.playing {
          background: var(--accent-primary);
          animation: eqDance 0.8s ease-in-out infinite alternate;
        }
        @keyframes eqDance {
          0% { height: 3px; }
          50% { height: 12px; }
          100% { height: 6px; }
        }
      `}</style>
    </div>
  );
}
