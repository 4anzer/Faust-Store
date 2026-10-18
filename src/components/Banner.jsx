import React from 'react';
import { useCatalog } from '../context/CatalogContext';
import { useLanguage } from '../context/LanguageContext';
import { Radio, Send, MessageSquare, CheckCircle2, AlertOctagon } from 'lucide-react';

export function Banner() {
  const { merchantProfile, items, isStoreOpen } = useCatalog();
  const { language, t } = useLanguage();
  const inStockCount = items.filter(i => i.stock > 0).length;

  return (
    <section style={{
      background: 'linear-gradient(180deg, var(--bg-secondary) 0%, var(--bg-primary) 100%)',
      borderBottom: '1px solid var(--border-color)',
      padding: '18px 20px',
      position: 'relative',
      zIndex: 1
    }}>
      <div style={{ maxWidth: '1350px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
        
        {/* Simple Info Row */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
          marginBottom: '14px',
          fontSize: '0.8rem',
          fontFamily: 'var(--font-mono)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{
              display: 'inline-block',
              width: '9px',
              height: '9px',
              borderRadius: '50%',
              background: isStoreOpen ? '#10b981' : '#ff2a44',
              boxShadow: isStoreOpen ? '0 0 10px #10b981' : '0 0 10px #ff2a44'
            }} />
            <span style={{ color: 'var(--text-main)', fontWeight: 700 }}>
              {isStoreOpen ? (
                <span style={{ color: '#10b981' }}>{t('storeStatusOpen')}</span>
              ) : (
                <span style={{ color: '#ff2a44', fontWeight: 800 }}>{t('storeStatusClosed')}</span>
              )}
            </span>
            <span style={{ color: 'var(--border-color)' }}>•</span>
            <span style={{ color: 'var(--text-muted)' }}>
              {language === 'en' ? "Guest Direct Checkout" : "Tanpa Registrasi Akun"}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', color: 'var(--text-muted)' }}>
            <span>
              TOTAL ITEM: <strong style={{ color: 'var(--text-main)' }}>{items.length}</strong>
            </span>
            <span>
              {language === 'en' ? "IN STOCK:" : "SIAP KIRIM:"} <strong style={{ color: '#10b981' }}>{inStockCount}</strong>
            </span>
          </div>
        </div>

        {/* Store Closed Warning Banner */}
        {!isStoreOpen && (
          <div style={{
            background: 'rgba(255, 42, 68, 0.12)',
            border: '1px solid #ff2a44',
            padding: '10px 14px',
            borderRadius: 'var(--radius-sm)',
            marginBottom: '14px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            color: '#ff475e'
          }}>
            <AlertOctagon size={18} style={{ flexShrink: 0 }} />
            <span style={{ fontSize: '0.84rem', fontFamily: 'var(--font-mono)' }}>
              <strong>{language === 'en' ? "NOTICE:" : "PEMBERITAHUAN:"}</strong> {language === 'en' 
                ? "The store is currently CLOSED. You can still inspect catalog specs, but order submissions are temporarily paused." 
                : "Toko saat ini sedang TUTUP. Kamu tetap dapat melihat katalog dan spesifikasi item, namun pemesanan sementara tidak dapat dilakukan."}
            </span>
          </div>
        )}

        {/* Announcement Box */}
        <div style={{
          background: 'var(--bg-tertiary)',
          borderLeft: isStoreOpen ? '4px solid var(--accent-primary)' : '4px solid #ff2a44',
          borderTop: '1px solid var(--border-color)',
          borderRight: '1px solid var(--border-color)',
          borderBottom: '1px solid var(--border-color)',
          padding: '12px 16px',
          borderRadius: '0 4px 4px 0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Radio size={18} color={isStoreOpen ? "var(--accent-primary)" : "#ff2a44"} style={{ flexShrink: 0 }} />
            <div>
              <span className="mono" style={{
                fontSize: '0.74rem',
                color: isStoreOpen ? 'var(--accent-primary)' : '#ff2a44',
                fontWeight: 700,
                marginRight: '8px'
              }}>
                [{language === 'en' ? "BROADCAST" : "PENGUMUMAN"}]:
              </span>
              <span style={{ fontSize: '0.88rem', color: 'var(--text-main)' }}>
                {merchantProfile.announcement || t('defaultAnnouncement')}
              </span>
            </div>
          </div>

          {/* Quick Contact Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            {merchantProfile.whatsapp && (
              <a
                href={`https://wa.me/${merchantProfile.whatsapp.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noreferrer"
                className="btn btn-sm btn-success"
                style={{ textDecoration: 'none' }}
              >
                <Send size={13} />
                <span>Chat WhatsApp</span>
              </a>
            )}

            {merchantProfile.discord && (
              <div
                className="btn btn-sm"
                style={{
                  background: 'rgba(114, 137, 218, 0.15)',
                  borderColor: 'rgba(114, 137, 218, 0.4)',
                  color: '#99aab5',
                  cursor: 'default'
                }}
              >
                <MessageSquare size={13} />
                <span>Discord: {merchantProfile.discord}</span>
              </div>
            )}
          </div>
        </div>

        {/* Payment Channels & Guarantees */}
        <div style={{
          marginTop: '12px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          flexWrap: 'wrap',
          fontSize: '0.78rem',
          color: 'var(--text-muted)',
          fontFamily: 'var(--font-mono)'
        }}>
          <span style={{ color: 'var(--accent-secondary)' }}>
            {language === 'en' ? "ACCEPTED PAYMENTS:" : "PEMBAYARAN TERSEDIA:"}
          </span>
          {merchantProfile.paymentMethods?.map((pay, i) => (
            <span key={i} style={{
              background: 'var(--bg-tertiary)',
              border: '1px solid var(--border-color)',
              padding: '2px 8px',
              borderRadius: '2px',
              color: 'var(--text-main)',
              fontSize: '0.72rem'
            }}>
              {pay}
            </span>
          ))}
          <span style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '4px', color: '#10b981' }}>
            <CheckCircle2 size={14} /> {language === 'en' ? "100% SECURE & VERIFIED" : "100% AMAN & BERGARANSI"}
          </span>
        </div>

      </div>
    </section>
  );
}
