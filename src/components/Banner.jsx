import React from 'react';
import { useCatalog } from '../context/CatalogContext';
import { Radio, MessageSquare, Send, CheckCircle2, AlertOctagon, Terminal } from 'lucide-react';

export function Banner() {
  const { merchantProfile, items, theme } = useCatalog();

  const totalAleph = items.filter(i => i.threat === 'ALEPH' || i.threat === 'KETER').length;
  const inStockCount = items.filter(i => i.stock > 0).length;

  return (
    <section style={{
      background: 'linear-gradient(180deg, var(--bg-secondary) 0%, var(--bg-primary) 100%)',
      borderBottom: '1px solid var(--border-color)',
      padding: '24px 20px',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Decorative background watermark */}
      <div className="serif-title" style={{
        position: 'absolute',
        right: '2%',
        top: '50%',
        transform: 'translateY(-50%)',
        fontSize: '6.5rem',
        fontWeight: 900,
        opacity: 0.03,
        userSelect: 'none',
        pointerEvents: 'none',
        whiteSpace: 'nowrap'
      }}>
        {theme === 'limbus' && "LIMBUS COMPANY"}
        {theme === 'lobotomy' && "LOBOTOMY CORP"}
        {theme === 'ruina' && "LIBRARY RUINA"}
        {theme === 'scp' && "SCP FOUNDATION"}
      </div>

      <div style={{ maxWidth: '1350px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
        
        {/* Terminal Status Row */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
          marginBottom: '16px',
          fontSize: '0.76rem',
          fontFamily: 'var(--font-mono)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{
              display: 'inline-block',
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: '#10b981',
              boxShadow: '0 0 10px #10b981'
            }} />
            <span style={{ color: 'var(--accent-primary)', fontWeight: 700 }}>
              TERMINAL PROTOCOL // ONLINE
            </span>
            <span style={{ color: 'var(--border-color)' }}>|</span>
            <span style={{ color: 'var(--text-muted)' }}>
              REGISTRY NODE: <span className="redacted">SECTOR-04-CITY</span>
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', color: 'var(--text-muted)' }}>
            <span>
              TOTAL ANOMALIES: <strong style={{ color: 'var(--text-main)' }}>{items.length}</strong>
            </span>
            <span>
              CONTAINED IN-STOCK: <strong style={{ color: '#10b981' }}>{inStockCount}</strong>
            </span>
            <span>
              ALEPH/KETER THREATS: <strong style={{ color: '#ff2a44' }}>{totalAleph}</strong>
            </span>
          </div>
        </div>

        {/* Announcement Ticker Box */}
        <div style={{
          background: 'var(--bg-tertiary)',
          borderLeft: '4px solid var(--accent-primary)',
          borderTop: '1px solid var(--border-color)',
          borderRight: '1px solid var(--border-color)',
          borderBottom: '1px solid var(--border-color)',
          padding: '12px 16px',
          borderRadius: '0 4px 4px 0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
          boxShadow: 'inset 0 0 15px rgba(0,0,0,0.5)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Radio size={18} color="var(--accent-primary)" style={{ flexShrink: 0 }} />
            <div>
              <span className="mono" style={{
                fontSize: '0.72rem',
                color: 'var(--accent-primary)',
                fontWeight: 700,
                textTransform: 'uppercase',
                marginRight: '8px'
              }}>
                [TRANSMISI OVERSEER]:
              </span>
              <span style={{ fontSize: '0.88rem', color: 'var(--text-main)' }}>
                {merchantProfile.announcement || "Pemesanan instan aktif 24 jam. Kirim tiket melalui WhatsApp atau Discord."}
              </span>
            </div>
          </div>

          {/* Quick Contact Badges */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            {merchantProfile.whatsapp && (
              <a
                href={`https://wa.me/${merchantProfile.whatsapp.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noreferrer"
                className="btn btn-sm"
                style={{
                  background: 'rgba(37, 211, 102, 0.15)',
                  borderColor: 'rgba(37, 211, 102, 0.4)',
                  color: '#25d366',
                  textDecoration: 'none'
                }}
              >
                <Send size={13} />
                <span>WA: {merchantProfile.whatsapp}</span>
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
                <span>DC: {merchantProfile.discord}</span>
              </div>
            )}
          </div>
        </div>

        {/* Accepted payment methods ticker */}
        <div style={{
          marginTop: '12px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          flexWrap: 'wrap',
          fontSize: '0.75rem',
          color: 'var(--text-muted)',
          fontFamily: 'var(--font-mono)'
        }}>
          <span style={{ color: 'var(--accent-secondary)' }}>PAYMENT CHANNELS:</span>
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
            <CheckCircle2 size={13} /> GARANSI TRANSAKSI AMAN 100%
          </span>
        </div>

      </div>
    </section>
  );
}
