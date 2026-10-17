import React from 'react';
import { useCatalog } from '../context/CatalogContext';
import { ShieldCheck, ArrowUp, AlertTriangle, Send, MessageSquare } from 'lucide-react';

export function Footer() {
  const { merchantProfile, theme, playSound } = useCatalog();

  const scrollToTop = () => {
    playSound('beep');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer style={{
      background: 'var(--bg-secondary)',
      borderTop: '1px solid var(--border-color)',
      marginTop: '60px',
      position: 'relative'
    }}>
      {/* Caution stripe */}
      <div className="hazard-stripe" style={{ height: '4px', width: '100%' }} />

      <div style={{
        maxWidth: '1350px',
        margin: '0 auto',
        padding: '36px 20px 24px 20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '24px'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '20px'
        }}>
          {/* Brand & Lore disclaimer */}
          <div style={{ maxWidth: '520px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <ShieldCheck size={20} color="var(--accent-primary)" />
              <span className="serif-title" style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-main)' }}>
                {merchantProfile.shopName}
              </span>
            </div>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>
              Platform katalog dan perantara item in-game lintas semesta: Limbus Company, Library of Ruina, Lobotomy Corp, dan SCP Foundation. Seluruh transaksi dienkripsi dan dijamin keamanannya oleh protokol pengawasan.
            </p>
          </div>

          {/* Contact and Support */}
          <div>
            <h4 className="mono" style={{ fontSize: '0.82rem', color: 'var(--accent-secondary)', marginBottom: '10px' }}>
              // SALURAN TRANSMISI ORDER:
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.84rem' }}>
              {merchantProfile.whatsapp && (
                <a
                  href={`https://wa.me/${merchantProfile.whatsapp.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    color: '#25d366',
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <Send size={14} />
                  <span>WhatsApp: +{merchantProfile.whatsapp}</span>
                </a>
              )}
              {merchantProfile.discord && (
                <div style={{ color: '#99aab5', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <MessageSquare size={14} />
                  <span>Discord ID: {merchantProfile.discord}</span>
                </div>
              )}
              <div className="mono" style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                Jam Operasional: 24/7 Fast Response
              </div>
            </div>
          </div>

          {/* Scroll to top */}
          <div>
            <button
              onClick={scrollToTop}
              className="btn btn-sm"
              title="Kembali ke atas"
            >
              <ArrowUp size={14} />
              <span>KEMBALI KE ATAS</span>
            </button>
          </div>
        </div>

        {/* Bottom copyright & classification bar */}
        <div style={{
          borderTop: '1px solid var(--border-color)',
          paddingTop: '18px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '10px',
          fontSize: '0.72rem',
          color: 'var(--text-muted)',
          fontFamily: 'var(--font-mono)'
        }}>
          <div>
            SECURE. CONTAIN. PROTECT. // ALL TRANSACTIONS MONITORED UNDER CITY HEAD LAW.
          </div>
          <div>
            DEPOLY READY ON <span style={{ color: 'var(--accent-primary)', fontWeight: 700 }}>VERCEL</span> // POWERED BY VITE & REACT
          </div>
        </div>
      </div>
    </footer>
  );
}
