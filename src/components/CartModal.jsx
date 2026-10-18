import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCatalog } from '../context/CatalogContext';
import { useLanguage } from '../context/LanguageContext';
import { createCartCheckoutWhatsAppUrl } from '../utils/whatsappHelper';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  Send, 
  ShoppingCart, 
  CheckCircle,
  AlertCircle,
  Shuffle
} from 'lucide-react';

function generateAnonymousName() {
  // Pre-assigned random identifier format: Customer#664631713
  const randomDigits = Math.floor(100000000 + Math.random() * 900000000);
  return `Customer#${randomDigits}`;
}

export function CartModal({ onClose }) {
  const navigate = useNavigate();
  const { 
    cart, 
    updateCartQuantity, 
    removeFromCart, 
    clearCart, 
    merchantProfile, 
    createOrder, 
    playSound,
    isStoreOpen 
  } = useCatalog();

  const { t } = useLanguage();

  const [buyerName, setBuyerName] = useState(() => generateAnonymousName());
  const [buyerContact, setBuyerContact] = useState('');
  const [robloxUsername, setRobloxUsername] = useState('');
  const [steamTradeUrl, setSteamTradeUrl] = useState('');
  const [selectedPayment, setSelectedPayment] = useState(
    merchantProfile.paymentMethods?.[0] || 'QRIS'
  );
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(null);

  const hasRoblox = cart.some(item => item.game?.toLowerCase().includes('roblox'));
  const hasSteam = cart.some(item => 
    item.game?.toLowerCase().includes('steam') || 
    item.game?.toLowerCase().includes('cs2') ||
    item.game?.toLowerCase().includes('counter')
  );

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
    if (!isStoreOpen) {
      playSound('hazard');
      alert("Sorry, the store is temporarily CLOSED. Orders cannot be processed right now.");
      return;
    }
    if (!buyerName.trim()) {
      alert("Please enter your customer codename!");
      return;
    }
    if (hasRoblox && !robloxUsername.trim()) {
      alert("Please enter your Roblox Username for delivery!");
      return;
    }
    if (hasSteam && !steamTradeUrl.trim()) {
      alert("Please enter your Steam Trade URL to receive your item!");
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Save order into orders database & trigger Discord webhook
      const newOrder = await createOrder({
        buyerName: buyerName.trim(),
        buyerContact: buyerContact.trim() || 'In-App Live Chat (No WhatsApp)',
        robloxUsername: robloxUsername.trim(),
        steamTradeUrl: steamTradeUrl.trim(),
        paymentMethod: selectedPayment,
        notes: notes.trim(),
        items: [...cart],
        totalPrice: totalPrice
      });

      // 2. Direct navigation to waiting status page (WhatsApp chat is accessible there)
      onClose();
      navigate(`/order-status/${newOrder.id}`);

    } catch (err) {
      console.error(err);
      alert("Failed to submit order: " + err.message);
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
              {t('cartTitle')} ({totalItemsCount} {t('itemsCount')})
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
                ORDER SUBMITTED SUCCESSFULLY!
              </h3>
              <p className="mono" style={{ fontSize: '0.88rem', color: '#10b981', marginBottom: '12px' }}>
                Order ID: #{orderSuccess.id}
              </p>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', maxWidth: '480px', margin: '0 auto 20px auto', lineHeight: '1.5' }}>
                Your order has been recorded into the dispatch queue and notifications have been sent to Discord. WhatsApp is opening for merchant payment confirmation & instant delivery!
              </p>

              <button
                onClick={() => {
                  setOrderSuccess(null);
                  onClose();
                }}
                className="btn btn-primary"
              >
                BACK TO CATALOG
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
                YOUR CART IS EMPTY
              </h3>
              <p style={{ fontSize: '0.85rem', marginBottom: '16px' }}>
                Select in-stock items from our catalog to proceed with checkout.
              </p>
              <button onClick={onClose} className="btn btn-primary btn-sm">
                BROWSE CATALOG
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
                  <span>{t('clearCartBtn')}</span>
                </button>

                <div style={{ textAlign: 'right' }}>
                  <span className="mono" style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>
                    {t('totalOrderLabel')}
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
                    CUSTOMER DETAILS (NO ACCOUNT REQUIRED):
                  </span>
                </div>

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '12px'
                }}>
                  <div>
                    <label className="mono" style={{ fontSize: '0.74rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                      ASSIGNED ANONYMOUS CODENAME
                    </label>
                    <input
                      type="text"
                      readOnly
                      className="input"
                      value={buyerName}
                      style={{
                        background: 'var(--bg-tertiary)',
                        color: 'var(--accent-secondary)',
                        fontWeight: 700,
                        cursor: 'default',
                        letterSpacing: '0.5px'
                      }}
                    />
                    <span className="mono" style={{ fontSize: '0.66rem', color: 'var(--text-muted)', marginTop: '2px', display: 'block' }}>
                      🔒 Pre-assigned system ID. Kept anonymous for security & verified review showcase.
                    </span>
                  </div>

                  <div>
                    <label className="mono" style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                      WHATSAPP NUMBER (OPTIONAL)
                    </label>
                    <input
                      type="text"
                      className="input"
                      placeholder="e.g. 08123456789 (leave blank for In-App Live Chat)"
                      value={buyerContact}
                      onChange={(e) => setBuyerContact(e.target.value)}
                    />
                    <span className="mono" style={{ fontSize: '0.66rem', color: '#00b4d8', marginTop: '2px', display: 'block' }}>
                      💬 Don't have WhatsApp? You can chat with the seller directly in-app on the waiting page!
                    </span>
                  </div>
                </div>

                {/* Conditional Roblox Username Field */}
                {hasRoblox && (
                  <div style={{
                    background: 'rgba(245, 197, 24, 0.06)',
                    border: '1px solid rgba(245, 197, 24, 0.35)',
                    padding: '10px 12px',
                    borderRadius: 'var(--radius-sm)'
                  }}>
                    <label className="mono" style={{ fontSize: '0.75rem', color: '#f5c518', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                      🎮 ROBLOX USERNAME * (REQUIRED FOR ROBLOX ITEMS)
                    </label>
                    <input
                      type="text"
                      required
                      className="input"
                      placeholder="e.g. RobloxPlayer_99"
                      value={robloxUsername}
                      onChange={(e) => setRobloxUsername(e.target.value)}
                      style={{ borderColor: 'rgba(245, 197, 24, 0.5)' }}
                    />
                    <span className="mono" style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '4px', display: 'block' }}>
                      ℹ️ We will add/join your Roblox username to trade or deliver the items.
                    </span>
                  </div>
                )}

                {/* Conditional Steam Trade URL Field */}
                {hasSteam && (
                  <div style={{
                    background: 'rgba(0, 180, 216, 0.06)',
                    border: '1px solid rgba(0, 180, 216, 0.35)',
                    padding: '10px 12px',
                    borderRadius: 'var(--radius-sm)'
                  }}>
                    <label className="mono" style={{ fontSize: '0.75rem', color: '#00b4d8', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                      🔗 STEAM TRADE URL * (REQUIRED FOR STEAM ITEMS)
                    </label>
                    <input
                      type="url"
                      required
                      className="input"
                      placeholder="https://steamcommunity.com/tradeoffer/new/?partner=...&token=..."
                      value={steamTradeUrl}
                      onChange={(e) => setSteamTradeUrl(e.target.value)}
                      style={{ borderColor: 'rgba(0, 180, 216, 0.5)' }}
                    />
                    <span className="mono" style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '4px', display: 'block' }}>
                      ℹ️ Find your link in Steam: Inventory → Trade Offers → Who can send me Trade Offers?
                    </span>
                  </div>
                )}

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '12px'
                }}>
                  <div>
                    <label className="mono" style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                      PAYMENT METHOD
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
                      ADDITIONAL NOTES (OPTIONAL)
                    </label>
                    <input
                      type="text"
                      className="input"
                      placeholder="UID, server name, or delivery notes..."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {!isStoreOpen && (
                <div style={{
                  background: 'rgba(255, 42, 68, 0.12)',
                  border: '1px solid #ff2a44',
                  color: '#ff475e',
                  padding: '10px 14px',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.84rem',
                  fontFamily: 'var(--font-mono)',
                  textAlign: 'center'
                }}>
                  ⚠️ <strong>STATUS: TEMPORARILY CLOSED. Orders are paused.</strong>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting || !isStoreOpen}
                className="btn btn-success"
                style={{
                  padding: '13px',
                  fontSize: '0.92rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  opacity: (!isStoreOpen || isSubmitting) ? 0.4 : 1,
                  cursor: (!isStoreOpen || isSubmitting) ? 'not-allowed' : 'pointer',
                  background: !isStoreOpen ? 'var(--bg-tertiary)' : undefined,
                  borderColor: !isStoreOpen ? 'var(--border-color)' : undefined,
                  color: !isStoreOpen ? 'var(--text-muted)' : undefined
                }}
              >
                <Send size={18} />
                <span>
                  {!isStoreOpen 
                    ? "STORE CLOSED" 
                    : isSubmitting 
                    ? "PROCESSING ORDER..." 
                    : "SUBMIT ORDER & TRACK STATUS"}
                </span>
              </button>

              <p style={{
                textAlign: 'center',
                fontSize: '0.74rem',
                color: 'var(--text-muted)',
                fontFamily: 'var(--font-mono)'
              }}>
                Orders are queued instantly. You will be taken to the tracking page where you can live chat with the seller or open WhatsApp.
              </p>

            </form>
          )}

        </div>
      </div>
    </div>
  );
}
