import React from 'react';
import { useCatalog } from '../context/CatalogContext';
import { useLanguage } from '../context/LanguageContext';
import { ArrowUp, Send, MessageSquare } from 'lucide-react';

export function Footer() {
  const { merchantProfile, playSound } = useCatalog();
  const { t } = useLanguage();

  const scrollToTop = () => {
    playSound('beep');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer style={{
      background: 'var(--bg-secondary)',
      borderTop: '1px solid var(--border-color)',
      marginTop: '50px',
      position: 'relative',
      zIndex: 10
    }}>
      <div className="hazard-stripe" style={{ height: '3px', width: '100%' }} />

      <div style={{
        maxWidth: '1350px',
        margin: '0 auto',
        padding: '30px 20px 20px 20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '20px'
        }}>
          {/* Brand info with enlarged logo */}
          <div style={{ maxWidth: '480px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
              <div style={{
                width: '46px',
                height: '46px',
                borderRadius: '8px',
                overflow: 'hidden',
                border: '2px solid var(--accent-primary)',
                boxShadow: '0 0 12px var(--accent-glow)',
                background: '#000',
                flexShrink: 0
              }}>
                <img 
                  src="/logo.png" 
                  alt="Faust Store" 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                />
              </div>
              <div>
                <span className="serif-title" style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--text-main)' }}>
                  {merchantProfile.shopName || "Faust Store"}
                </span>
                <div className="mono" style={{ fontSize: '0.7rem', color: 'var(--accent-primary)' }}>
                  {t('anomalySafe')}
                </div>
              </div>
            </div>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>
              {t('footerDesc')}
            </p>
          </div>

          {/* Contact channels */}
          <div>
            <h4 className="mono" style={{ fontSize: '0.82rem', color: 'var(--accent-secondary)', marginBottom: '8px' }}>
              {t('contactTitle')}
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.84rem' }}>
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
                  <span>Discord: {merchantProfile.discord}</span>
                </div>
              )}
              <div className="mono" style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                {t('supportHours')}
              </div>
            </div>
          </div>

          {/* Back to top */}
          <div>
            <button
              onClick={scrollToTop}
              className="btn btn-sm"
              title="Back to Top"
            >
              <ArrowUp size={14} />
              <span>{t('backToTop')}</span>
            </button>
          </div>
        </div>

        {/* Bottom copyright */}
        <div style={{
          borderTop: '1px solid var(--border-color)',
          paddingTop: '14px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '10px',
          fontSize: '0.74rem',
          color: 'var(--text-muted)',
          fontFamily: 'var(--font-mono)'
        }}>
          <div>
            © {new Date().getFullYear()} {merchantProfile.shopName || "Faust Store"}. {t('allRightsReserved')}
          </div>
          <div>
            HOSTED ON <strong style={{ color: 'var(--accent-primary)' }}>VERCEL</strong>
          </div>
        </div>
      </div>
    </footer>
  );
}
