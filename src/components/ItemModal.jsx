import React, { useState } from 'react';
import { useCatalog } from '../context/CatalogContext';
import { THREAT_LEVELS } from '../data/defaultData';
import { createDirectItemWhatsAppUrl } from '../utils/whatsappHelper';
import { 
  X, 
  ShoppingCart, 
  Send, 
  Truck, 
  ShieldCheck 
} from 'lucide-react';

export function ItemModal({ item, onClose, onOpenCart }) {
  const { merchantProfile, addToCart, playSound, isStoreOpen } = useCatalog();

  if (!item) return null;

  const threat = THREAT_LEVELS[item.threat] || {
    name: item.threat || 'SAFE',
    color: '#00f0ff',
    bg: 'rgba(0, 240, 255, 0.15)',
    border: 'rgba(0, 240, 255, 0.6)',
    desc: 'Item Standar'
  };

  const isOutOfStock = item.stock <= 0;

  const formatPrice = (price, currency = 'Rp') => {
    if (typeof price === 'number') {
      return `${currency} ${price.toLocaleString('id-ID')}`;
    }
    return `${currency} ${price}`;
  };

  const handleAddToCart = () => {
    if (!isStoreOpen) {
      playSound('hazard');
      alert("Maaf, toko sedang TUTUP sementara. Pemesanan tidak dapat dilakukan saat ini.");
      return;
    }
    if (isOutOfStock) {
      playSound('hazard');
      return;
    }
    addToCart(item);
  };

  const handleDirectWhatsApp = () => {
    if (!isStoreOpen) {
      playSound('hazard');
      alert("Maaf, toko sedang TUTUP sementara. Pemesanan tidak dapat dilakukan saat ini.");
      return;
    }
    playSound('beep');
    const waUrl = createDirectItemWhatsAppUrl(merchantProfile.whatsapp, item);
    window.open(waUrl, '_blank');
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '820px' }}
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{
              display: 'inline-block',
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: threat.color,
              boxShadow: `0 0 10px ${threat.color}`
            }} />
            <span className="mono" style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              DETAIL ITEM // {item.game}
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
              cursor: 'pointer'
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(260px, 340px) 1fr',
          gap: '24px',
          padding: '24px'
        }}
        className="modal-grid-responsive"
        >
          {/* Left Column: Image & Stock */}
          <div>
            <div style={{
              position: 'relative',
              borderRadius: 'var(--radius-sm)',
              overflow: 'hidden',
              border: '1px solid var(--border-color)',
              background: '#07060a'
            }}>
              <img
                src={item.image}
                alt={item.name}
                style={{
                  width: '100%',
                  height: '260px',
                  objectFit: 'cover',
                  display: 'block'
                }}
              />
              <div style={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                background: threat.bg,
                border: `1px solid ${threat.color}`,
                color: threat.color,
                fontFamily: 'var(--font-mono)',
                fontWeight: 800,
                fontSize: '0.78rem',
                padding: '3px 8px',
                borderRadius: '2px'
              }}>
                {threat.name}
              </div>
            </div>

            {/* Stock status */}
            <div style={{
              marginTop: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '10px 14px',
              background: 'var(--bg-tertiary)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.82rem',
              fontFamily: 'var(--font-mono)'
            }}>
              <span style={{ color: 'var(--text-muted)' }}>Status Ketersediaan:</span>
              <strong style={{ color: isOutOfStock ? '#ff2a44' : '#10b981' }}>
                {isOutOfStock ? "STOK HABIS" : `TERSEDIA (${item.stock} Unit)`}
              </strong>
            </div>

            {/* Seller Guarantee */}
            <div style={{
              marginTop: '10px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.75rem',
              color: 'var(--text-muted)'
            }}>
              <ShieldCheck size={15} color="#10b981" />
              <span>Transaksi Dijamin Aman & Bergaransi</span>
            </div>
          </div>

          {/* Right Column: Info & Action */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            
            {/* Category badge */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
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
              fontSize: '1.4rem',
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
              justifyContent: 'space-between'
            }}>
              <div>
                <span className="mono" style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block' }}>
                  HARGA
                </span>
                <span className="mono glow-text" style={{
                  fontSize: '1.5rem',
                  fontWeight: 900,
                  color: 'var(--accent-primary)'
                }}>
                  {formatPrice(item.price, item.currency)}
                </span>
              </div>
            </div>

            {/* Description */}
            <div>
              <h4 className="mono" style={{ fontSize: '0.78rem', color: 'var(--accent-secondary)', marginBottom: '4px' }}>
                // DESKRIPSI & KETERANGAN:
              </h4>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-main)', lineHeight: '1.5' }}>
                {item.description}
              </p>
            </div>

            {/* Properties */}
            {item.properties && item.properties.length > 0 && (
              <div>
                <h4 className="mono" style={{ fontSize: '0.78rem', color: 'var(--accent-secondary)', marginBottom: '6px' }}>
                  // SPESIFIKASI:
                </h4>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
                  gap: '6px'
                }}>
                  {item.properties.map((prop, idx) => (
                    <div key={idx} style={{
                      background: 'var(--bg-primary)',
                      border: '1px solid var(--border-color)',
                      padding: '6px 10px',
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

            {/* Delivery Method */}
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
                  CARA PENGIRIMAN:
                </span>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-main)', marginTop: '2px' }}>
                  {item.deliveryMethod || "Pengiriman via chat langsung setelah pembayaran diverifikasi."}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{
              marginTop: 'auto',
              paddingTop: '16px',
              borderTop: '1px solid var(--border-color)',
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '10px'
            }}>
              <button
                onClick={handleAddToCart}
                disabled={isOutOfStock || !isStoreOpen}
                className="btn"
                style={{
                  borderColor: 'var(--accent-primary)',
                  color: 'var(--accent-primary)',
                  opacity: (isOutOfStock || !isStoreOpen) ? 0.4 : 1,
                  cursor: (isOutOfStock || !isStoreOpen) ? 'not-allowed' : 'pointer'
                }}
              >
                <ShoppingCart size={15} />
                <span>{!isStoreOpen ? 'TOKO TUTUP' : '+ KERANJANG'}</span>
              </button>

              <button
                onClick={handleDirectWhatsApp}
                disabled={isOutOfStock || !isStoreOpen}
                className="btn btn-success"
                style={{
                  opacity: (isOutOfStock || !isStoreOpen) ? 0.4 : 1,
                  cursor: (isOutOfStock || !isStoreOpen) ? 'not-allowed' : 'pointer',
                  background: !isStoreOpen ? 'var(--bg-tertiary)' : undefined,
                  borderColor: !isStoreOpen ? 'var(--border-color)' : undefined,
                  color: !isStoreOpen ? 'var(--text-muted)' : undefined
                }}
              >
                <Send size={15} />
                <span>{!isStoreOpen ? 'TOKO SEDANG TUTUP' : 'BELI VIA WHATSAPP'}</span>
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
