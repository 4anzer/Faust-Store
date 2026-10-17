import React, { useState } from 'react';
import { useCatalog } from '../context/CatalogContext';
import { createCartCheckoutWhatsAppUrl } from '../utils/whatsappHelper';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  Send, 
  ShoppingCart, 
  CheckCircle,
  AlertCircle
} from 'lucide-react';

export function CartModal({ onClose }) {
  const { 
    cart, 
    updateCartQuantity, 
    removeFromCart, 
    clearCart, 
    merchantProfile, 
    createOrder, 
    playSound 
  } = useCatalog();

  const [buyerName, setBuyerName] = useState('');
  const [buyerContact, setBuyerContact] = useState('');
  const [selectedPayment, setSelectedPayment] = useState(
    merchantProfile.paymentMethods?.[0] || 'QRIS'
  );
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(null);

  const formatPrice = (price, currency = 'Rp') => {
    if (typeof price === 'number') {
      return `${currency} ${price.toLocaleString('id-ID')}`;
    }
    return `${currency} ${price}`;
  };

  const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const totalItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    if (!buyerName.trim()) {
      alert("Mohon masukkan nama atau nickname game kamu!");
      return;
    }
    if (!buyerContact.trim()) {
      alert("Mohon masukkan nomor WhatsApp atau kontak kamu!");
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Save order into orders database & trigger Discord webhook
      const newOrder = await createOrder({
        buyerName: buyerName.trim(),
        buyerContact: buyerContact.trim(),
        paymentMethod: selectedPayment,
        notes: notes.trim(),
        items: [...cart],
        totalPrice: totalPrice
      });

      setOrderSuccess(newOrder);

      // 2. Open WhatsApp with dynamic checkout template
      const waUrl = createCartCheckoutWhatsAppUrl(merchantProfile.whatsapp, newOrder);
      window.open(waUrl, '_blank');

    } catch (err) {
      console.error(err);
      alert("Gagal memproses pesanan: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '750px' }}
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
            <span className="serif-title" style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-main)' }}>
              KERANJANG BELANJA ({totalItemsCount} ITEM)
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
          
          {/* Order Success Screen */}
          {orderSuccess ? (
            <div style={{ textAlign: 'center', padding: '30px 10px' }}>
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: 'rgba(37, 211, 102, 0.15)',
                border: '2px solid #25d366',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px auto'
              }}>
                <CheckCircle size={36} color="#25d366" />
              </div>

              <h3 className="serif-title" style={{ fontSize: '1.3rem', color: 'var(--text-main)', marginBottom: '8px' }}>
                PESANAN BERHASIL DISUBMIT!
              </h3>
              <p className="mono" style={{ fontSize: '0.88rem', color: '#10b981', marginBottom: '12px' }}>
                Kode Order: #{orderSuccess.id}
              </p>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', maxWidth: '480px', margin: '0 auto 20px auto', lineHeight: '1.5' }}>
                Pesanan kamu sudah masuk ke daftar antrean admin dan notifikasi otomatis sudah dikirimkan ke Discord. WhatsApp juga telah terbuka untuk konfirmasi transfer dengan admin!
              </p>

              <button
                onClick={() => {
                  setOrderSuccess(null);
                  onClose();
                }}
                className="btn btn-primary"
              >
                KEMBALI KE ETALASE
              </button>
            </div>
          ) : cart.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '40px 20px',
              color: 'var(--text-muted)'
            }}>
              <ShoppingCart size={46} style={{ opacity: 0.3, margin: '0 auto 12px auto' }} />
              <h3 className="serif-title" style={{ color: 'var(--text-main)', marginBottom: '6px' }}>
                KERANJANG BELANJA MASIH KOSONG
              </h3>
              <p style={{ fontSize: '0.85rem', marginBottom: '16px' }}>
                Silakan pilih item yang kamu inginkan dari etalase.
              </p>
              <button onClick={onClose} className="btn btn-primary btn-sm">
                LIHAT ETALASE BARANG
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmitOrder} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              
              {/* Item List */}
              <div style={{
                maxHeight: '220px',
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
                        <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-main)' }}>
                          {item.name}
                        </div>
                        <div className="mono" style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                          {item.game}
                        </div>
                      </div>
                    </div>

                    {/* Quantity controls */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <button
                        type="button"
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
                        type="button"
                        onClick={() => updateCartQuantity(item.id, 1)}
                        className="btn btn-sm"
                        style={{ padding: '2px 8px' }}
                      >
                        <Plus size={12} />
                      </button>
                    </div>

                    {/* Subtotal */}
                    <div className="mono" style={{
                      minWidth: '95px',
                      textAlign: 'right',
                      fontWeight: 800,
                      color: 'var(--accent-primary)'
                    }}>
                      {formatPrice(item.price * item.quantity, item.currency)}
                    </div>

                    {/* Remove */}
                    <button
                      type="button"
                      onClick={() => removeFromCart(item.id)}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: 'var(--text-muted)',
                        cursor: 'pointer'
                      }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>

              {/* Total Summary */}
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
                  type="button"
                  onClick={clearCart}
                  className="btn btn-sm btn-danger"
                  style={{ fontSize: '0.74rem' }}
                >
                  <Trash2 size={12} />
                  <span>KOSONGKAN</span>
                </button>

                <div style={{ textAlign: 'right' }}>
                  <span className="mono" style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>
                    TOTAL PEMBAYARAN:
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

              {/* Customer Form (No Login Needed) */}
              <div style={{
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-color)',
                padding: '16px',
                borderRadius: 'var(--radius-sm)',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-secondary)' }}>
                  <AlertCircle size={16} />
                  <span className="mono" style={{ fontSize: '0.82rem', fontWeight: 700 }}>
                    FORM PEMBELI (TANPA PERLU BUAT AKUN):
                  </span>
                </div>

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '12px'
                }}>
                  <div>
                    <label className="mono" style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                      NAMA / NICKNAME GAME *:
                    </label>
                    <input
                      type="text"
                      required
                      className="input"
                      placeholder="Contoh: Dante / Player1"
                      value={buyerName}
                      onChange={(e) => setBuyerName(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="mono" style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                      NOMOR WHATSAPP KAMU *:
                    </label>
                    <input
                      type="text"
                      required
                      className="input"
                      placeholder="Contoh: 08123456789"
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
                    <label className="mono" style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                      METODE PEMBAYARAN:
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
                    <label className="mono" style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                      CATATAN UNTUK PENJUAL (OPSIONAL):
                    </label>
                    <input
                      type="text"
                      className="input"
                      placeholder="Contoh: Tolong kirim sekarang ya min"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn btn-success"
                style={{
                  padding: '13px',
                  fontSize: '0.92rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
              >
                <Send size={18} />
                <span>{isSubmitting ? "MEMPROSES PESANAN..." : "KONFIRMASI PESANAN & LANJUT KE WHATSAPP"}</span>
              </button>

              <p style={{
                textAlign: 'center',
                fontSize: '0.74rem',
                color: 'var(--text-muted)',
                fontFamily: 'var(--font-mono)'
              }}>
                Pesanan akan otomatis tercatat di list admin dan terkirim notifikasinya ke Discord penjual.
              </p>

            </form>
          )}

        </div>
      </div>
    </div>
  );
}
