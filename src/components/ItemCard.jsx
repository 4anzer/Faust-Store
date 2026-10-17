import React from 'react';
import { useCatalog } from '../context/CatalogContext';
import { THREAT_LEVELS } from '../data/defaultData';
import { ShoppingCart, Eye, Edit3, Trash2, Sparkles, Check, Package } from 'lucide-react';

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
    if (window.confirm(`Hapus item: "${item.name}"?`)) {
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
        transition: 'all 0.2s ease',
        overflow: 'hidden',
        boxShadow: '0 4px 16px rgba(0,0,0,0.5)'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-3px)';
        e.currentTarget.style.borderColor = 'var(--accent-primary)';
        e.currentTarget.style.boxShadow = '0 8px 24px rgba(255, 42, 68, 0.25)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.borderColor = 'var(--border-color)';
        e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.5)';
      }}
    >
      {/* Top Strip */}
      <div style={{
        padding: '8px 12px',
        background: 'var(--bg-secondary)',
        borderBottom: '1px solid var(--border-color)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontSize: '0.74rem',
        fontFamily: 'var(--font-mono)'
      }}>
        {/* Game category */}
        <span style={{ color: 'var(--accent-secondary)', fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '160px' }}>
          🎮 {item.game}
        </span>

        {/* Threat / Rarity Badge */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          background: threat.bg,
          border: `1px solid ${threat.border}`,
          color: threat.color,
          padding: '2px 6px',
          borderRadius: '2px',
          fontWeight: 700,
          fontSize: '0.68rem'
        }}>
          <span>{threat.name}</span>
        </div>
      </div>

      {/* Item Image */}
      <div style={{
        position: 'relative',
        width: '100%',
        height: '190px',
        background: '#07060a',
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
            transition: 'transform 0.3s ease',
            filter: isOutOfStock ? 'grayscale(80%) brightness(0.6)' : 'none'
          }}
          onMouseEnter={(e) => {
            if (!isOutOfStock) e.target.style.transform = 'scale(1.05)';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'scale(1)';
          }}
          onError={(e) => {
            e.target.src = "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80";
          }}
        />

        {/* Tag pill */}
        {item.tag && (
          <div style={{
            position: 'absolute',
            bottom: '8px',
            left: '8px',
            background: 'rgba(0,0,0,0.8)',
            border: '1px solid var(--border-color)',
            color: 'var(--text-main)',
            fontSize: '0.7rem',
            fontFamily: 'var(--font-mono)',
            padding: '2px 8px',
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
            background: 'rgba(212, 175, 55, 0.95)',
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
            <span>POPULER</span>
          </div>
        )}

        {/* Out of Stock Ribbon */}
        {isOutOfStock ? (
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%) rotate(-10deg)',
            background: '#ff2a44',
            color: '#fff',
            fontWeight: 900,
            fontFamily: 'var(--font-mono)',
            fontSize: '0.82rem',
            padding: '6px 16px',
            border: '2px solid #fff',
            boxShadow: '0 0 15px rgba(0,0,0,0.8)',
            letterSpacing: '0.08em'
          }}>
            STOK HABIS
          </div>
        ) : isLowStock ? (
          <div style={{
            position: 'absolute',
            top: '8px',
            left: '8px',
            background: '#f5c518',
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

      {/* Item Body */}
      <div style={{ padding: '14px', display: 'flex', flexDirection: 'column', flexGrow: 1, gap: '8px' }}>
        
        {/* Title */}
        <h3 style={{
          fontSize: '1rem',
          fontWeight: 700,
          color: 'var(--text-main)',
          lineHeight: '1.3',
          fontFamily: 'var(--font-serif)',
          minHeight: '2.6em'
        }}>
          {item.name}
        </h3>

        {/* Short description */}
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
              HARGA ITEM
            </span>
            <span className="mono glow-text" style={{
              fontSize: '1.2rem',
              fontWeight: 800,
              color: 'var(--accent-primary)'
            }}>
              {formatPrice(item.price, item.currency)}
            </span>
          </div>

          <div className="mono" style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
            <span>Stok: </span>
            <strong style={{ color: isOutOfStock ? '#ff2a44' : '#10b981' }}>
              {isOutOfStock ? "Habis" : `${item.stock} Ready`}
            </strong>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '8px',
          marginTop: '8px'
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
            <span>DETAIL</span>
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

        {/* Admin quick actions */}
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
                borderColor: 'var(--accent-secondary)',
                color: 'var(--accent-secondary)',
                fontSize: '0.72rem',
                padding: '3px 8px'
              }}
            >
              <Edit3 size={11} />
              <span>EDIT</span>
            </button>

            <button
              onClick={handleDelete}
              className="btn btn-sm btn-danger"
              style={{ fontSize: '0.72rem', padding: '3px 8px' }}
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
