import React, { useState } from 'react';
import { useCatalog } from '../context/CatalogContext';
import { THREAT_LEVELS } from '../data/defaultData';
import { 
  X, 
  ShieldAlert, 
  ShoppingCart, 
  Send, 
  MessageSquare, 
  Package, 
  Truck, 
  CheckCircle, 
  Copy, 
  Check,
  AlertTriangle
} from 'lucide-react';

export function ItemModal({ item, onClose, onOpenCart }) {
  const { merchantProfile, addToCart, playSound } = useCatalog();
  const [copied, setCopied] = useState(false);

  if (!item) return null;

  const threat = THREAT_LEVELS[item.threat] || {
    name: item.threat || 'SAFE',
    color: '#00f0ff',
    bg: 'rgba(0, 240, 255, 0.15)',
    border: 'rgba(0, 240, 255, 0.6)',
    desc: 'Prosedur Penanganan Anomali Standar'
  };

  const isOutOfStock = item.stock <= 0;

  const formatPrice = (price, currency = 'Rp') => {
    if (typeof price === 'number') {
      return `${currency} ${price.toLocaleString('id-ID')}`;
    }
    return `${currency} ${price}`;
  };

  const handleAddToCart = () => {
    if (isOutOfStock) {
      playSound('hazard');
      return;
    }
    addToCart(item);
  };

  const handleDirectWhatsApp = () => {
    playSound('beep');
    const waNumber = (merchantProfile.whatsapp || '').replace(/[^0-9]/g, '');
    const message = encodeURIComponent(
      `Halo Overseer / Merchant,\nSaya ingin order item anomali berikut:\n\n` +
      `📦 Item: ${item.name}\n` +
      `🎮 Game: ${item.game}\n` +
      `⚠️ Klasifikasi: ${item.threat}\n` +
      `💰 Harga: ${formatPrice(item.price, item.currency)}\n\n` +
      `Apakah item ini masih tersedia? Mohon info cara transaksi & pembayarannya. Terima kasih!`
    );
    window.open(`https://wa.me/${waNumber}?text=${message}`, '_blank');
  };

  const handleCopyManifest = () => {
    playSound('beep');
    const text = `[REQUISITION ORDER] ${item.name} (${item.game}) - ${formatPrice(item.price, item.currency)}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '850px' }}
      >
        {/* Modal Top Header */}
        <div style={{
          padding: '14px 20px',
          background: 'var(--bg-tertiary)',
          borderBottom: '1px solid var(--border-color)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{
              display: 'inline-block',
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: threat.color,
              boxShadow: `0 0 10px ${threat.color}`
            }} />
            <span className="mono" style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              CLASSIFIED DOSSIER FILE // {item.id}
            </span>
          </div>

          <button
            onClick={() => {
              playSound('click');
              onClose();
            }}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              padding: '4px'
            }}
            title="Tutup Dossier"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(280px, 350px) 1fr',
          gap: '24px',
          padding: '24px'
        }}
        className="modal-grid-responsive"
        >
          {/* Left Column: Image & Threat Details */}
          <div>
            <div style={{
              position: 'relative',
              borderRadius: 'var(--radius-sm)',
              overflow: 'hidden',
              border: `1px solid ${threat.border}`,
              background: '#050508'
            }}>
              <img
                src={item.image}
                alt={item.name}
                style={{
                  width: '100%',
                  height: '280px',
                  objectFit: 'cover',
                  display: 'block'
                }}
              />
              <div style={{
                position: 'absolute',
                top: 0, left: 0, right: 0, bottom: 0,
                background: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.4) 50%)',
                backgroundSize: '100% 3px',
                pointerEvents: 'none'
              }} />

              {/* Threat Stamp */}
              <div style={{
                position: 'absolute',
                top: '12px',
                right: '12px',
                background: threat.bg,
                border: `2px solid ${threat.color}`,
                color: threat.color,
                fontFamily: 'var(--font-mono)',
                fontWeight: 900,
                fontSize: '0.85rem',
                padding: '4px 10px',
                borderRadius: '2px',
                boxShadow: `0 0 14px ${threat.color}60`
              }}>
                {threat.name}
              </div>
            </div>

            {/* Threat Description Box */}
            <div style={{
              marginTop: '12px',
              background: threat.bg,
              border: `1px solid ${threat.border}`,
              padding: '10px 12px',
              borderRadius: 'var(--radius-sm)'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                color: threat.color,
                fontWeight: 700,
                fontFamily: 'var(--font-mono)',
                fontSize: '0.78rem',
                marginBottom: '4px'
              }}>
                <ShieldAlert size={14} />
                <span>KLASIFIKASI ANOMALI: {threat.name}</span>
              </div>
              <p style={{ fontSize: '0.74rem', color: 'var(--text-main)', lineHeight: '1.4' }}>
                {threat.desc}
              </p>
            </div>

            {/* Stock indicator */}
            <div style={{
              marginTop: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '8px 12px',
              background: 'var(--bg-tertiary)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.8rem',
              fontFamily: 'var(--font-mono)'
            }}>
              <span style={{ color: 'var(--text-muted)' }}>STATUS PERSEDIAAN:</span>
              <strong style={{ color: isOutOfStock ? '#ff2a44' : '#10b981' }}>
                {isOutOfStock ? "HABIS / OUT OF STOCK" : `TERSEDIA (${item.stock} UNIT)`}
              </strong>
            </div>

          </div>

          {/* Right Column: Information, Specs & Order */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            
            {/* Category & Tags */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <span className="badge" style={{
                background: 'var(--border-color)',
                color: 'var(--accent-primary)',
                border: '1px solid var(--accent-primary)'
              }}>
                {item.game}
              </span>
              {item.tag && (
                <span className="badge" style={{
                  background: 'var(--bg-tertiary)',
                  color: 'var(--text-muted)',
                  border: '1px solid var(--border-color)'
                }}>
                  {item.tag}
                </span>
              )}
            </div>

            {/* Title */}
            <h2 className="serif-title" style={{
              fontSize: '1.45rem',
              fontWeight: 800,
              color: 'var(--text-main)',
              lineHeight: '1.25'
            }}>
              {item.name}
            </h2>

            {/* Price Box */}
            <div style={{
              background: 'var(--bg-tertiary)',
              borderLeft: '4px solid var(--accent-primary)',
              padding: '12px 16px',
              borderRadius: '0 4px 4px 0',
              display: 'flex',
              alignItems: 'baseline',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '8px'
            }}>
              <div>
                <span className="mono" style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block' }}>
                  REQUISITION VALUE / HARGA
                </span>
                <span className="mono glow-text" style={{
                  fontSize: '1.6rem',
                  fontWeight: 900,
                  color: 'var(--accent-primary)'
                }}>
                  {formatPrice(item.price, item.currency)}
                </span>
              </div>

              <button
                onClick={handleCopyManifest}
                className="btn btn-sm"
                title="Salin rincian item ini"
              >
                {copied ? <Check size={12} color="#10b981" /> : <Copy size={12} />}
                <span>{copied ? "TERSALIN" : "SALIN FORMAT"}</span>
              </button>
            </div>

            {/* Description / Lore */}
            <div>
              <h4 className="mono" style={{ fontSize: '0.78rem', color: 'var(--accent-secondary)', marginBottom: '6px' }}>
                // PROSEDUR DAN DESKRIPSI ANOMALI:
              </h4>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-main)', lineHeight: '1.6' }}>
                {item.description}
              </p>
            </div>

            {/* Properties Grid if any */}
            {item.properties && item.properties.length > 0 && (
              <div>
                <h4 className="mono" style={{ fontSize: '0.78rem', color: 'var(--accent-secondary)', marginBottom: '8px' }}>
                  // SPESIFIKASI IN-GAME / METADATA:
                </h4>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                  gap: '8px'
                }}>
                  {item.properties.map((prop, idx) => (
                    <div key={idx} style={{
                      background: 'var(--bg-primary)',
                      border: '1px solid var(--border-color)',
                      padding: '8px 10px',
                      borderRadius: '2px'
                    }}>
                      <span className="mono" style={{ fontSize: '0.68rem', color: 'var(--text-muted)', display: 'block' }}>
                        {prop.label}
                      </span>
                      <strong style={{ fontSize: '0.82rem', color: 'var(--text-main)' }}>
                        {prop.value}
                      </strong>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Delivery Method Box */}
            <div style={{
              background: 'rgba(16, 185, 129, 0.08)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              padding: '10px 14px',
              borderRadius: 'var(--radius-sm)',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '10px'
            }}>
              <Truck size={18} color="#10b981" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <span className="mono" style={{ fontSize: '0.74rem', color: '#10b981', fontWeight: 700 }}>
                  METODE PENGIRIMAN:
                </span>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-main)', marginTop: '2px' }}>
                  {item.deliveryMethod || "Pengiriman instan via chat langsung setelah pembayaran diverifikasi."}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{
              marginTop: 'auto',
              paddingTop: '16px',
              borderTop: '1px solid var(--border-color)',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px'
            }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <button
                  onClick={handleAddToCart}
                  disabled={isOutOfStock}
                  className="btn"
                  style={{
                    borderColor: 'var(--accent-primary)',
                    color: 'var(--accent-primary)',
                    opacity: isOutOfStock ? 0.4 : 1
                  }}
                >
                  <ShoppingCart size={15} />
                  <span>TAMBAH KE KERANJANG</span>
                </button>

                <button
                  onClick={handleDirectWhatsApp}
                  disabled={isOutOfStock}
                  className="btn btn-primary"
                  style={{
                    background: '#25d366',
                    borderColor: '#25d366',
                    color: '#000',
                    fontWeight: 700,
                    opacity: isOutOfStock ? 0.4 : 1
                  }}
                >
                  <Send size={15} />
                  <span>PESAN VIA WHATSAPP</span>
                </button>
              </div>

              {merchantProfile.discord && (
                <div style={{
                  fontSize: '0.74rem',
                  fontFamily: 'var(--font-mono)',
                  color: 'var(--text-muted)',
                  textAlign: 'center'
                }}>
                  Atau order via Discord DM: <strong style={{ color: 'var(--text-main)' }}>{merchantProfile.discord}</strong>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
