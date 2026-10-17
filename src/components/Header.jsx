import React, { useState } from 'react';
import { useCatalog } from '../context/CatalogContext';
import { 
  ShieldAlert, 
  ShoppingCart, 
  Settings, 
  Volume2, 
  VolumeX, 
  Flame, 
  BookOpen, 
  Eye, 
  FileText,
  Clock
} from 'lucide-react';

export function Header({ onOpenCart, onOpenAdmin, isCuratorMode, setIsCuratorMode }) {
  const { 
    merchantProfile, 
    cart, 
    theme, 
    changeTheme, 
    soundEnabled, 
    toggleSound, 
    playSound 
  } = useCatalog();

  const totalCartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const themeList = [
    { id: 'limbus', name: 'Limbus Co.', icon: Flame, color: '#ff2a44', desc: 'Mephistopheles / Golden Bough' },
    { id: 'lobotomy', name: 'Lobotomy Corp.', icon: Eye, color: '#f5c518', desc: 'Enkephalin Hazard' },
    { id: 'ruina', name: 'Library of Ruina', icon: BookOpen, color: '#00f0ff', desc: 'Book of Light' },
    { id: 'scp', name: 'SCP Foundation', icon: FileText, color: '#e63946', desc: 'Secure Contain Protect' }
  ];

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 500,
      background: 'var(--header-bg)',
      borderBottom: '1px solid var(--border-color)',
      backdropFilter: 'blur(10px)',
      boxShadow: '0 4px 20px rgba(0,0,0,0.6)'
    }}>
      {/* Top Hazard Caution Stripe */}
      <div className="hazard-stripe" style={{ height: '4px', width: '100%' }} />

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
        {/* Brand / Store Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', cursor: 'pointer' }}
             onClick={() => playSound('glitch')}>
          <div style={{
            position: 'relative',
            width: '42px',
            height: '42px',
            borderRadius: '50%',
            background: 'var(--bg-tertiary)',
            border: '2px solid var(--accent-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 14px var(--accent-glow)'
          }}>
            <ShieldAlert size={22} color="var(--accent-primary)" />
            <div style={{
              position: 'absolute',
              bottom: '-2px',
              right: '-2px',
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              background: '#10b981',
              border: '2px solid var(--bg-primary)'
            }} title="Containment Active" />
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="serif-title glitch-hover" style={{
                fontSize: '1.25rem',
                fontWeight: 900,
                color: 'var(--text-main)',
                letterSpacing: '0.08em'
              }}>
                {merchantProfile.shopName || "THE REQUISITION WING"}
              </span>
              <span className="badge mono" style={{
                background: 'var(--border-color)',
                color: 'var(--accent-primary)',
                fontSize: '0.65rem',
                border: '1px solid var(--accent-primary)'
              }}>
                CLEARANCE LV.5
              </span>
            </div>
            <p className="mono" style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
              {merchantProfile.subtitle || "Abnormality & In-Game Items Requisition Vault"}
            </p>
          </div>
        </div>

        {/* Action Controls & Theme Selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          
          {/* Theme Selector Pills */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            background: 'var(--bg-tertiary)',
            padding: '3px',
            borderRadius: '4px',
            border: '1px solid var(--border-color)'
          }}>
            {themeList.map((t) => {
              const Icon = t.icon;
              const isActive = theme === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => changeTheme(t.id)}
                  title={t.desc}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                    padding: '4px 8px',
                    background: isActive ? 'var(--bg-card)' : 'transparent',
                    border: isActive ? `1px solid ${t.color}` : '1px solid transparent',
                    color: isActive ? t.color : 'var(--text-muted)',
                    borderRadius: '2px',
                    cursor: 'pointer',
                    fontSize: '0.72rem',
                    fontFamily: 'var(--font-mono)',
                    fontWeight: isActive ? 700 : 500,
                    transition: 'all 0.15s ease',
                    boxShadow: isActive ? `0 0 8px ${t.color}40` : 'none'
                  }}
                >
                  <Icon size={12} />
                  <span className="theme-text-label">{t.name}</span>
                </button>
              );
            })}
          </div>

          {/* Sound FX Toggle */}
          <button
            onClick={toggleSound}
            className="btn btn-sm"
            title={soundEnabled ? "Mute Terminal Audio" : "Aktifkan Audio SFX"}
            style={{
              padding: '6px 10px',
              color: soundEnabled ? 'var(--accent-primary)' : 'var(--text-muted)'
            }}
          >
            {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
          </button>

          {/* Overseer / Curator Admin Button */}
          <button
            onClick={() => {
              playSound('beep');
              onOpenAdmin();
            }}
            className="btn btn-sm"
            style={{
              borderColor: isCuratorMode ? 'var(--accent-secondary)' : 'var(--border-color)',
              background: isCuratorMode ? 'rgba(212, 175, 55, 0.15)' : 'var(--bg-secondary)',
              color: isCuratorMode ? 'var(--accent-secondary)' : 'var(--text-main)'
            }}
            title="Kelola Barang Toko (Admin Panel)"
          >
            <Settings size={15} />
            <span className="mono" style={{ fontSize: '0.75rem' }}>
              {isCuratorMode ? "OVERSEER [ON]" : "KELOLA BARANG"}
            </span>
          </button>

          {/* Requisition Cart Button */}
          <button
            onClick={() => {
              playSound('click');
              onOpenCart();
            }}
            className="btn btn-primary btn-sm"
            style={{ position: 'relative', padding: '6px 14px' }}
          >
            <ShoppingCart size={15} />
            <span>REQUISITION</span>
            {totalCartCount > 0 && (
              <span style={{
                position: 'absolute',
                top: '-7px',
                right: '-7px',
                background: '#ff2a44',
                color: '#fff',
                borderRadius: '50%',
                width: '18px',
                height: '18px',
                fontSize: '0.7rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 900,
                border: '2px solid var(--bg-primary)',
                boxShadow: '0 0 8px #ff2a44'
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
