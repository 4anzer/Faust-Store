import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCatalog } from '../context/CatalogContext';
import { 
  ShoppingCart, 
  Volume2, 
  VolumeX,
  Sparkles
} from 'lucide-react';

export function Header({ onOpenCart, onReplayIntro }) {
  const { 
    merchantProfile, 
    cart, 
    soundEnabled, 
    toggleSound, 
    playSound 
  } = useCatalog();

  const navigate = useNavigate();

  const totalCartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 500,
      background: 'rgba(13, 11, 17, 0.94)',
      borderBottom: '1px solid var(--border-color)',
      backdropFilter: 'blur(10px)',
      boxShadow: '0 4px 20px rgba(0,0,0,0.6)'
    }}>
      {/* Top Hazard Caution Stripe */}
      <div className="hazard-stripe" style={{ height: '3px', width: '100%' }} />

      <div style={{
        maxWidth: '1350px',
        margin: '0 auto',
        padding: '12px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        {/* Brand / Logo */}
        <div 
          style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}
          onClick={() => { playSound('glitch'); navigate('/'); }}
        >
          <div style={{
            position: 'relative',
            width: '44px',
            height: '44px',
            borderRadius: '8px',
            overflow: 'hidden',
            border: '2px solid var(--accent-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 14px var(--accent-glow)',
            background: '#000',
            flexShrink: 0
          }}>
            <img 
              src="/logo.png" 
              alt="Faust Store Logo" 
              style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
            />
            <div style={{
              position: 'absolute',
              bottom: '2px',
              right: '2px',
              width: '9px',
              height: '9px',
              borderRadius: '50%',
              background: '#10b981',
              border: '1.5px solid #000'
            }} title="Online" />
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="serif-title" style={{
                fontSize: '1.3rem',
                fontWeight: 900,
                color: 'var(--text-main)',
                letterSpacing: '0.04em'
              }}>
                {merchantProfile.shopName || "Faust Store"}
              </span>
              <span className="badge" style={{
                background: 'rgba(255, 42, 68, 0.15)',
                color: 'var(--accent-primary)',
                border: '1px solid var(--accent-primary)',
                fontSize: '0.68rem'
              }}>
                OFFICIAL
              </span>
            </div>
            <p className="mono" style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
              {merchantProfile.subtitle || "Toko Item & Jasa In-Game Terpercaya"}
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          
          {/* Replay Proelium Intro Loading Screen */}
          {onReplayIntro && (
            <button
              onClick={() => {
                playSound('glitch');
                onReplayIntro();
              }}
              className="btn btn-sm"
              title="Putar Ulang Intro Loading Screen Proelium Fatale"
              style={{
                padding: '7px 11px',
                borderColor: 'rgba(255, 42, 68, 0.45)',
                background: 'rgba(255, 42, 68, 0.12)',
                color: 'var(--accent-primary)',
                display: 'flex',
                alignItems: 'center',
                gap: '5px'
              }}
            >
              <Sparkles size={14} />
              <span className="mono" style={{ fontSize: '0.72rem', fontWeight: 700 }}>INTRO</span>
            </button>
          )}

          {/* Sound FX Toggle */}
          <button
            onClick={toggleSound}
            className="btn btn-sm"
            title={soundEnabled ? "Mute Suara Efek" : "Aktifkan Suara Efek"}
            style={{
              padding: '7px 10px',
              color: soundEnabled ? 'var(--accent-primary)' : 'var(--text-muted)'
            }}
          >
            {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
          </button>

          {/* Keranjang Belanja Button */}
          <button
            onClick={() => {
              playSound('click');
              onOpenCart();
            }}
            className="btn btn-primary btn-sm"
            style={{ position: 'relative', padding: '7px 16px' }}
          >
            <ShoppingCart size={16} />
            <span>KERANJANG</span>
            {totalCartCount > 0 && (
              <span style={{
                position: 'absolute',
                top: '-7px',
                right: '-7px',
                background: '#fff',
                color: '#000',
                borderRadius: '50%',
                width: '19px',
                height: '19px',
                fontSize: '0.72rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 900,
                boxShadow: '0 0 10px rgba(255,255,255,0.8)'
              }}>
                {totalCartCount}
              </span>
            )}
          </button>

        </div>
      </div>
    </header>
  );
}
