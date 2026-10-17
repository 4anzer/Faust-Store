import React, { useState } from 'react';
import { useCatalog } from '../context/CatalogContext';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  Send, 
  Copy, 
  Check, 
  ShoppingCart, 
  CreditCard, 
  User, 
  FileText 
} from 'lucide-react';

export function CartModal({ onClose }) {
  const { 
    cart, 
    updateCartQuantity, 
    removeFromCart, 
    clearCart, 
    merchantProfile, 
    playSound 
  } = useCatalog();

  const [buyerName, setBuyerName] = useState('');
  const [buyerContact, setBuyerContact] = useState('');
  const [selectedPayment, setSelectedPayment] = useState(
    merchantProfile.paymentMethods?.[0] || 'QRIS'
  );
  const [notes, setNotes] = useState('');
  const [copied, setCopied] = useState(false);

  const formatPrice = (price, currency = 'Rp') => {
    if (typeof price === 'number') {
      return `${currency} ${price.toLocaleString('id-ID')}`;
    }
    return `${currency} ${price}`;
  };

  const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const totalItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Generate formatted order text
  const generateOrderMessage = () => {
    const itemList = cart
      .map(
        (i, idx) =>
          `${idx + 1}. ${i.name} [${i.game}] (x${i.quantity}) - ${formatPrice(i.price * i.quantity, i.currency)}`
      )
      .join('\n');

    return (
      `═════════════════════════════════\n` +
      `📋 FORM REQUISITION PEMESANAN ITEM\n` +
      `═════════════════════════════════\n` +
      `👤 Pembeli / Nick Game: ${buyerName.trim() || 'Tidak disertakan'}\n` +
      `📱 Kontak / Discord: ${buyerContact.trim() || 'Tidak disertakan'}\n` +
      `💳 Metode Pembayaran: ${selectedPayment}\n` +
      `📝 Catatan: ${notes.trim() || '-'}\n\n` +
      `📦 DAFTAR ITEM YANG DIPESAN:\n` +
      `${itemList}\n\n` +
      `💰 TOTAL REQUISITION: ${formatPrice(totalPrice, 'Rp')}\n` +
      `═════════════════════════════════\n` +
      `Halo Bang, saya mau order item-item di atas. Apakah ready? Mohon arahan pembayarannya ya!`
    );
  };

  const handleCheckoutWhatsApp = () => {
    playSound('beep');
    const waNumber = (merchantProfile.whatsapp || '').replace(/[^0-9]/g, '');
    const message = encodeURIComponent(generateOrderMessage());
    window.open(`https://wa.me/${waNumber}?text=${message}`, '_blank');
  };

  const handleCopyDiscord = () => {
    playSound('beep');
    const discordText = '```markdown\n' + generateOrderMessage() + '\n```';
    navigator.clipboard.writeText(discordText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '780px' }}
      >
        {/* Header */}
        <div style={{
          padding: '14px 20px',
          background: 'var(--bg-tertiary)',
          borderBottom: '1px solid var(--border-color)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShoppingCart size={18} color="var(--accent-primary)" />
            <span className="serif-title" style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)' }}>
              CONTAINMENT REQUISITION MANIFEST ({totalItemsCount} ITEM)
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

        {/* Content */}
        <div style={{ padding: '20px' }}>
          {cart.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '40px 20px',
              color: 'var(--text-muted)'
            }}>
              <ShoppingCart size={48} style={{ opacity: 0.3, margin: '0 auto 12px auto' }} />
              <h3 className="serif-title" style={{ color: 'var(--text-main)', marginBottom: '6px' }}>
                MANIFEST REQUISITION MASIH KOSONG
              </h3>
              <p style={{ fontSize: '0.85rem', marginBottom: '16px' }}>
                Pilih item anomali atau in-game gear dari etalase untuk mulai memesan.
              </p>
              <button onClick={onClose} className="btn btn-primary btn-sm">
                JELAJAHI ETALASE ITEM
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              
              {/* Item List Table */}
              <div style={{
                maxHeight: '260px',
                overflowY: 'auto',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-sm)',
                background: 'var(--bg-primary)'
              }}>
                {cart.map((item) => (
                  <div
                    key={item.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '10px 14px',
                      borderBottom: '1px solid var(--border-color)',
                      gap: '12px',
                      flexWrap: 'wrap'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: '1 1 200px' }}>
                      <img
                        src={item.image}
                        alt={item.name}
                        style={{
                          width: '42px',
                          height: '42px',
                          borderRadius: '2px',
                          objectFit: 'cover',
                          border: '1px solid var(--border-color)'
                        }}
                      />
                      <div>
                        <div style={{
                          fontSize: '0.86rem',
                          fontWeight: 700,
                          color: 'var(--text-main)'
                        }}>
                          {item.name}
                        </div>
                        <div className="mono" style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                          {item.game} | {item.threat}
                        </div>
                      </div>
                    </div>

                    {/* Quantity controls */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <button
                        onClick={() => updateCartQuantity(item.id, -1)}
                        className="btn btn-sm"
                        style={{ padding: '2px 8px' }}
                      >
                        <Minus size={12} />
                      </button>
                      <span className="mono" style={{ minWidth: '24px', textAlign: 'center', fontWeight: 700 }}>
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateCartQuantity(item.id, 1)}
                        className="btn btn-sm"
                        style={{ padding: '2px 8px' }}
                      >
                        <Plus size={12} />
                      </button>
                    </div>

                    {/* Subtotal */}
                    <div className="mono" style={{
                      minWidth: '100px',
                      textAlign: 'right',
                      fontWeight: 800,
                      color: 'var(--accent-primary)'
                    }}>
                      {formatPrice(item.price * item.quantity, item.currency)}
                    </div>

                    {/* Delete button */}
                    <button
                      onClick={() => removeFromCart(item.id)}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: 'var(--text-muted)',
                        cursor: 'pointer'
                      }}
                      title="Hapus dari keranjang"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>

              {/* Total Calculation Strip */}
              <div style={{
                background: 'var(--bg-tertiary)',
                padding: '12px 16px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-color)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '8px'
              }}>
                <button
                  onClick={clearCart}
                  className="btn btn-sm btn-danger"
                  style={{ fontSize: '0.72rem' }}
                >
                  <Trash2 size={12} />
                  <span>KOSONGKAN MANIFEST</span>
                </button>

                <div style={{ textAlign: 'right' }}>
                  <span className="mono" style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>
                    TOTAL BIAYA REQUISITION:
                  </span>
                  <span className="mono glow-text" style={{
                    fontSize: '1.45rem',
                    fontWeight: 900,
                    color: 'var(--accent-primary)'
                  }}>
                    {formatPrice(totalPrice, 'Rp')}
                  </span>
                </div>
              </div>

              {/* Checkout Form */}
              <div style={{
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-color)',
                padding: '16px',
                borderRadius: 'var(--radius-sm)',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px'
              }}>
                <h4 className="mono" style={{ fontSize: '0.8rem', color: 'var(--accent-secondary)' }}>
                  // RINCIAN DATA PEMBELI (OPSIONAL AGAR CEPAT DIPROSES):
                </h4>

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '12px'
                }}>
                  <div>
                    <label className="mono" style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                      NICKNAME GAME / UID AKUN:
                    </label>
                    <input
                      type="text"
                      className="input"
                      placeholder="Contoh: Dante#1234 / UID: 8129381"
                      value={buyerName}
                      onChange={(e) => setBuyerName(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="mono" style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                      NO. WHATSAPP / DISCORD KAMU:
                    </label>
                    <input
                      type="text"
                      className="input"
                      placeholder="Contoh: 08123456789 / user#0001"
                      value={buyerContact}
                      onChange={(e) => setBuyerContact(e.target.value)}
                    />
                  </div>
                </div>

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '12px'
                }}>
                  <div>
                    <label className="mono" style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                      METODE PEMBAYARAN DIPILIH:
                    </label>
                    <select
                      className="select"
                      value={selectedPayment}
                      onChange={(e) => setSelectedPayment(e.target.value)}
                    >
                      {merchantProfile.paymentMethods?.map((pm, i) => (
                        <option key={i} value={pm}>{pm}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="mono" style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                      CATATAN TAMBAHAN (OPSIONAL):
                    </label>
                    <input
                      type="text"
                      className="input"
                      placeholder="Contoh: Kirim via trade steam jam 8 malam"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Dispatch Action Buttons */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '12px'
              }}>
                <button
                  onClick={handleCheckoutWhatsApp}
                  className="btn btn-primary"
                  style={{
                    background: '#25d366',
                    borderColor: '#25d366',
                    color: '#000',
                    padding: '12px',
                    fontSize: '0.88rem'
                  }}
                >
                  <Send size={16} />
                  <span>KIRIM ORDER KE WHATSAPP</span>
                </button>

                <button
                  onClick={handleCopyDiscord}
                  className="btn"
                  style={{
                    borderColor: '#7289da',
                    color: '#7289da',
                    padding: '12px',
                    fontSize: '0.88rem'
                  }}
                >
                  {copied ? <Check size={16} color="#10b981" /> : <Copy size={16} />}
                  <span>{copied ? "FORMAT TERSALIN!" : "SALIN FORMAT DISCORD"}</span>
                </button>
              </div>

              <div style={{
                textAlign: 'center',
                fontSize: '0.72rem',
                color: 'var(--text-muted)',
                fontFamily: 'var(--font-mono)'
              }}>
                Setelah klik tombol WhatsApp, pesan otomatis akan terbuka di HP/PC kamu dan tinggal dikirim ke seller!
              </div>

            </div>
          )}
        </div>
      </div>
    </div>
  );
}
