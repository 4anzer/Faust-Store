import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCatalog } from '../context/CatalogContext';
import { useLanguage } from '../context/LanguageContext';
import { AmbientBgmPlayer } from './AmbientBgmPlayer';
import { 
  ShoppingCart
} from 'lucide-react';

export function Header({ onOpenCart }) {
  const { 
    merchantProfile, 
    cart, 
    playSound 
  } = useCatalog();

  const { t } = useLanguage();
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
      {/* Top Hazard Caution Stripe with pulse glow */}
      <div className="hazard-stripe" style={{ height: '3px', width: '100%' }} />

      <div style={{
        maxWidth: '1350px',
        margin: '0 auto',
        padding: '10px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        {/* Brand / Logo (Enlarged for high visibility) */}
        <div 
          style={{ display: 'flex', alignItems: 'center', gap: '14px', cursor: 'pointer' }}
          onClick={() => { playSound('glitch'); navigate('/'); }}
        >
          {/* Bigger Logo Container */}
          <div style={{
            position: 'relative',
            width: '60px',
            height: '60px',
            borderRadius: '10px',
            overflow: 'hidden',
            border: '2.5px solid var(--accent-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 18px var(--accent-glow), inset 0 0 10px rgba(0,0,0,0.8)',
            background: '#000',
            flexShrink: 0,
            transition: 'transform 0.2s ease, box-shadow 0.2s ease'
          }}>
            <img 
              src="/logo.png" 
              alt="Faust Store Logo" 
              style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
            />
            {/* Live Online Badge */}
            <div style={{
              position: 'absolute',
              bottom: '3px',
              right: '3px',
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              background: '#10b981',
              border: '2px solid #000',
              boxShadow: '0 0 6px #10b981'
            }} title={t('onlineStatus')} />
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="serif-title" style={{
                fontSize: '1.42rem',
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
                fontSize: '0.68rem',
                fontWeight: 800
              }}>
                {t('officialBadge')}
              </span>
            </div>
            <p className="mono" style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
              {merchantProfile.subtitle || "Trusted In-Game Item & Service Shop"}
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          
          {/* Ambient BGM Audio Player (SCP Sector 17 - Always 100% volume) */}
          <AmbientBgmPlayer />

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
            <span>{t('cartButton')}</span>
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
