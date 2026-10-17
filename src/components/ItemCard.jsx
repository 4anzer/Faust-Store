import React from 'react';
import { useCatalog } from '../context/CatalogContext';
import { THREAT_LEVELS } from '../data/defaultData';
import { ShoppingCart, Eye, Edit3, Trash2, ShieldAlert, Sparkles } from 'lucide-react';

export function ItemCard({ item, onInspect, onEdit, isCuratorMode }) {
  const { addToCart, deleteItem, playSound } = useCatalog();

  const threat = THREAT_LEVELS[item.threat] || {
    name: item.threat || 'SAFE',
    color: '#00f0ff',
    bg: 'rgba(0, 240, 255, 0.15)',
    border: 'rgba(0, 240, 255, 0.6)'
  };

  const isOutOfStock = item.stock <= 0;
  const isLowStock = item.stock > 0 && item.stock <= 2;

  const formatPrice = (price, currency = 'Rp') => {
    if (typeof price === 'number') {
      return `${currency} ${price.toLocaleString('id-ID')}`;
    }
    return `${currency} ${price}`;
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    if (isOutOfStock) {
      playSound('hazard');
      return;
    }
    addToCart(item);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    if (window.confirm(`Hapus item anomali: "${item.name}" dari inventaris?`)) {
      deleteItem(item.id);
    }
  };

  return (
    <div
      onClick={() => onInspect(item)}
      style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-sm)',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        cursor: 'pointer',
        transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
        overflow: 'hidden',
        boxShadow: '0 4px 15px rgba(0,0,0,0.4)'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-3px)';
        e.currentTarget.style.borderColor = threat.color;
        e.currentTarget.style.boxShadow = `0 8px 24px ${threat.color}25`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.borderColor = 'var(--border-color)';
        e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.4)';
      }}
    >
      {/* Top Header Strip: Threat Rating & Game Category */}
      <div style={{
        padding: '8px 12px',
        background: 'var(--bg-secondary)',
        borderBottom: '1px solid var(--border-color)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontSize: '0.72rem',
        fontFamily: 'var(--font-mono)'
      }}>
        {/* Threat Badge */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '5px',
          background: threat.bg,
          border: `1px solid ${threat.border}`,
          color: threat.color,
          padding: '2px 6px',
          borderRadius: '2px',
          fontWeight: 700,
          letterSpacing: '0.08em'
        }}>
          <ShieldAlert size={12} />
          <span>{threat.name}</span>
        </div>

        {/* Game Badge */}
        <span style={{ color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '140px' }}>
          {item.game}
        </span>
      </div>

      {/* Item Image / Hologram Preview Container */}
      <div style={{
        position: 'relative',
        width: '100%',
        height: '190px',
        background: '#050508',
        overflow: 'hidden'
      }}>
        <img
          src={item.image}
          alt={item.name}
          loading="lazy"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.4s ease',
            filter: isOutOfStock ? 'grayscale(80%) brightness(0.6)' : 'none'
          }}
          onMouseEnter={(e) => {
            if (!isOutOfStock) e.target.style.transform = 'scale(1.06)';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'scale(1)';
          }}
          onError={(e) => {
            // Fallback image if broken URL
            e.target.src = "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80";
          }}
        />

        {/* Scanline overlay over image */}
        <div style={{
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.4) 50%)',
          backgroundSize: '100% 3px',
          pointerEvents: 'none'
        }} />

        {/* Tag pill */}
        {item.tag && (
          <div style={{
            position: 'absolute',
            bottom: '8px',
            left: '8px',
            background: 'rgba(0,0,0,0.75)',
            border: '1px solid var(--border-color)',
            color: 'var(--text-main)',
            fontSize: '0.68rem',
            fontFamily: 'var(--font-mono)',
            padding: '2px 6px',
            borderRadius: '2px'
          }}>
            {item.tag}
          </div>
        )}

        {/* Featured Star */}
        {item.featured && (
          <div style={{
            position: 'absolute',
            top: '8px',
            right: '8px',
            background: 'rgba(212, 175, 55, 0.9)',
            color: '#000',
            fontSize: '0.65rem',
            fontFamily: 'var(--font-mono)',
            fontWeight: 800,
            padding: '2px 6px',
            borderRadius: '2px',
            display: 'flex',
            alignItems: 'center',
            gap: '3px'
          }}>
            <Sparkles size={10} />
            <span>FEATURED</span>
          </div>
        )}

        {/* Out of stock or low stock badge */}
        {isOutOfStock ? (
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%) rotate(-12deg)',
            background: '#ff2a44',
            color: '#fff',
            fontWeight: 900,
            fontFamily: 'var(--font-mono)',
            fontSize: '0.85rem',
            padding: '6px 16px',
            border: '2px solid #fff',
            boxShadow: '0 0 15px rgba(0,0,0,0.8)',
            letterSpacing: '0.1em',
            textTransform: 'uppercase'
          }}>
            [HABIS / CONTAINED]
          </div>
        ) : isLowStock ? (
          <div style={{
            position: 'absolute',
            top: '8px',
            left: '8px',
            background: 'rgba(245, 197, 24, 0.9)',
            color: '#000',
            fontSize: '0.65rem',
            fontFamily: 'var(--font-mono)',
            fontWeight: 800,
            padding: '2px 6px',
            borderRadius: '2px'
          }}>
            SISA {item.stock}!
          </div>
        ) : null}
      </div>

      {/* Item Body / Content */}
      <div style={{ padding: '14px', display: 'flex', flexDirection: 'column', flexGrow: 1, gap: '8px' }}>
        
        <h3 style={{
          fontSize: '1rem',
          fontWeight: 700,
          color: 'var(--text-main)',
          lineHeight: '1.3',
          fontFamily: 'var(--font-serif)',
          letterSpacing: '0.02em',
          minHeight: '2.6em'
        }}>
          {item.name}
        </h3>

        <p style={{
          fontSize: '0.8rem',
          color: 'var(--text-muted)',
          lineHeight: '1.4',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          textOverflow: 'ellipsis'
        }}>
          {item.description}
        </p>

        {/* Price and Stock row */}
        <div style={{
          marginTop: 'auto',
          paddingTop: '10px',
          borderTop: '1px solid var(--border-color)',
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '6px'
        }}>
          <div>
            <span className="mono" style={{ fontSize: '0.68rem', color: 'var(--text-muted)', display: 'block' }}>
              PRICE / NILAI REQUISITION
            </span>
            <span className="mono glow-text" style={{
              fontSize: '1.15rem',
              fontWeight: 800,
              color: 'var(--accent-primary)'
            }}>
              {formatPrice(item.price, item.currency)}
            </span>
          </div>

          <div className="mono" style={{ fontSize: '0.74rem', color: 'var(--text-muted)', textAlign: 'right' }}>
            <span>STOK: </span>
            <strong style={{ color: isOutOfStock ? '#ff2a44' : '#10b981' }}>
              {isOutOfStock ? "0" : item.stock}
            </strong>
          </div>
        </div>

        {/* Buttons / Actions */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '8px',
          marginTop: '10px'
        }}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onInspect(item);
            }}
            className="btn btn-sm"
            style={{ width: '100%' }}
          >
            <Eye size={13} />
            <span>DOSSIER</span>
          </button>

          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className="btn btn-sm btn-primary"
            style={{
              width: '100%',
              opacity: isOutOfStock ? 0.4 : 1,
              cursor: isOutOfStock ? 'not-allowed' : 'pointer'
            }}
          >
            <ShoppingCart size={13} />
            <span>BELI</span>
          </button>
        </div>

        {/* Curator Quick Actions (Admin mode) */}
        {isCuratorMode && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: '8px',
            paddingTop: '8px',
            borderTop: '1px dashed var(--accent-secondary)'
          }}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit(item);
              }}
              className="btn btn-sm"
              style={{
                background: 'rgba(212, 175, 55, 0.1)',
                borderColor: 'var(--accent-secondary)',
                color: 'var(--accent-secondary)',
                fontSize: '0.7rem',
                padding: '3px 8px'
              }}
            >
              <Edit3 size={11} />
              <span>EDIT</span>
            </button>

            <button
              onClick={handleDelete}
              className="btn btn-sm btn-danger"
              style={{ fontSize: '0.7rem', padding: '3px 8px' }}
            >
              <Trash2 size={11} />
              <span>HAPUS</span>
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
