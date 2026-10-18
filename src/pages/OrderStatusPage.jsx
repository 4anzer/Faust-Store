import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useCatalog } from '../context/CatalogContext';
import { 
  CheckCircle2, 
  Clock, 
  Send, 
  Star, 
  ArrowLeft, 
  ShieldCheck, 
  Package, 
  Gamepad2, 
  Sparkles,
  ExternalLink,
  MessageSquare
} from 'lucide-react';

export function OrderStatusPage() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { 
    orders, 
    merchantProfile, 
    addReview, 
    playSound,
    orderChats,
    sendOrderChatMessage 
  } = useCatalog();

  // Find target order
  const [currentOrder, setCurrentOrder] = useState(() => {
    const found = orders.find((o) => o.id === orderId);
    if (found) return found;
    try {
      const stored = localStorage.getItem('faust_store_orders_v3');
      if (stored) {
        const parsed = JSON.parse(stored);
        return parsed.find((o) => o.id === orderId) || null;
      }
    } catch {
      // ignore
    }
    return null;
  });

  // Review form states
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  // Chat input state
  const [customerChatInput, setCustomerChatInput] = useState('');
  const chatEndRef = useRef(null);

  // Auto-scroll chat to bottom
  const chatMessages = (orderChats && currentOrder && orderChats[currentOrder.id]) || [];
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages.length]);

  // Poll for status updates (e.g., when admin clicks "MARK AS DELIVERED")
  useEffect(() => {
    const checkStatus = () => {
      try {
        const stored = localStorage.getItem('faust_store_orders_v3');
        if (stored) {
          const parsed = JSON.parse(stored);
          const updated = parsed.find((o) => o.id === orderId);
          if (updated) {
            setCurrentOrder((prev) => {
              if (prev && prev.status !== updated.status) {
                if (updated.status === 'Selesai' || updated.status === 'Delivered') {
                  playSound('equip');
                }
              }
              return updated;
            });
          }
        }
      } catch {
        // ignore
      }
    };

    // Poll every 2 seconds
    const interval = setInterval(checkStatus, 2000);
    window.addEventListener('storage', checkStatus);

    return () => {
      clearInterval(interval);
      window.removeEventListener('storage', checkStatus);
    };
  }, [orderId, playSound]);

  if (!currentOrder) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'var(--bg-primary)',
        color: 'var(--text-main)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        textAlign: 'center'
      }}>
        <Package size={52} color="var(--accent-primary)" style={{ opacity: 0.5, marginBottom: '16px' }} />
        <h2 className="serif-title" style={{ fontSize: '1.4rem', marginBottom: '8px' }}>
          ORDER NOT FOUND
        </h2>
        <p className="mono" style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '24px' }}>
          Could not locate order ID #{orderId}. It may have been cleared or does not exist.
        </p>
        <button onClick={() => navigate('/')} className="btn btn-primary">
          <ArrowLeft size={16} />
          <span>RETURN TO STORE</span>
        </button>
      </div>
    );
  }

  const isDelivered = currentOrder.status === 'Selesai' || currentOrder.status === 'Delivered';

  const formatPrice = (price) => {
    if (typeof price === 'number') {
      return `Rp ${price.toLocaleString('id-ID')}`;
    }
    return `Rp ${price}`;
  };

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (!comment.trim()) {
      alert("Please write a short comment about your experience!");
      return;
    }

    const reviewPayload = {
      orderId: currentOrder.id,
      customerName: currentOrder.buyerName || 'Anonymous Operative',
      rating: rating,
      comment: comment.trim(),
      game: currentOrder.items?.[0]?.game || 'In-Game Item',
      items: (currentOrder.items || []).map((it) => it.name)
    };

    addReview(reviewPayload);
    setReviewSubmitted(true);
  };

  const handleSendCustomerChat = (e) => {
    e.preventDefault();
    if (!customerChatInput.trim()) return;
    sendOrderChatMessage(
      currentOrder.id,
      'customer',
      customerChatInput.trim(),
      currentOrder.buyerName || 'Customer'
    );
    setCustomerChatInput('');
  };

  const whatsappUrl = merchantProfile.whatsapp 
    ? `https://wa.me/${merchantProfile.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
        `Halo Admin Faust Store! Saya ${currentOrder.buyerName} ingin konfirmasi pesanan #${currentOrder.id}.\nTotal: ${formatPrice(currentOrder.totalPrice)}\nMohon segera diproses ya!`
      )}`
    : null;

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg-primary)',
      color: 'var(--text-main)',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Top Header */}
      <header style={{
        background: 'rgba(13, 11, 17, 0.95)',
        borderBottom: '1px solid var(--border-color)',
        padding: '14px 20px',
        backdropFilter: 'blur(10px)',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <div style={{
          maxWidth: '1000px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <button
            onClick={() => navigate('/')}
            className="btn btn-sm"
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <ArrowLeft size={14} />
            <span>BACK TO STORE</span>
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span className="mono" style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              LIVE ORDER DISPATCH
            </span>
            <span className="mono" style={{
              fontSize: '0.82rem',
              fontWeight: 800,
              color: 'var(--accent-primary)',
              background: 'rgba(255, 42, 68, 0.1)',
              padding: '2px 8px',
              borderRadius: '2px',
              border: '1px solid var(--accent-primary)'
            }}>
              #{currentOrder.id}
            </span>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main style={{
        maxWidth: '850px',
        margin: '30px auto',
        padding: '0 20px 60px 20px',
        width: '100%',
        flex: 1
      }}>
        
        {/* Status Tracker Banner */}
        <div style={{
          background: isDelivered ? 'rgba(16, 185, 129, 0.08)' : 'rgba(245, 197, 24, 0.08)',
          border: `1.5px solid ${isDelivered ? '#10b981' : 'rgba(245, 197, 24, 0.5)'}`,
          borderRadius: '8px',
          padding: '24px',
          marginBottom: '24px',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: isDelivered ? '0 0 25px rgba(16, 185, 129, 0.2)' : '0 0 25px rgba(245, 197, 24, 0.15)'
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', flexWrap: 'wrap' }}>
            <div style={{
              width: '54px',
              height: '54px',
              borderRadius: '50%',
              background: isDelivered ? 'rgba(16, 185, 129, 0.2)' : 'rgba(245, 197, 24, 0.2)',
              border: `2px solid ${isDelivered ? '#10b981' : '#f5c518'}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              {isDelivered ? (
                <CheckCircle2 size={30} color="#10b981" />
              ) : (
                <Clock size={28} color="#f5c518" style={{ animation: 'spin 12s linear infinite' }} />
              )}
            </div>

            <div style={{ flex: 1, minWidth: '260px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <span className="badge" style={{
                  background: isDelivered ? '#10b981' : '#f5c518',
                  color: '#000',
                  fontWeight: 900,
                  fontSize: '0.72rem'
                }}>
                  {isDelivered ? "STATUS: DELIVERED (SELESAI)" : "STATUS: AWAITING DISPATCH"}
                </span>
                {!isDelivered && (
                  <span className="mono" style={{ fontSize: '0.72rem', color: '#f5c518', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#f5c518', display: 'inline-block' }} />
                    Live Sync Active
                  </span>
                )}
              </div>

              <h2 className="serif-title" style={{ fontSize: '1.4rem', color: 'var(--text-main)', margin: '6px 0' }}>
                {isDelivered 
                  ? "YOUR ITEM HAS BEEN DELIVERED!" 
                  : "WAITING FOR MERCHANT TO DISPATCH YOUR ORDER"}
              </h2>

              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.5', margin: 0 }}>
                {isDelivered
                  ? "The merchant has confirmed fulfillment and sent the items to your account / Steam trade offer. Please rate your experience below!"
                  : "Your order is queued in the merchant terminal. Once the merchant clicks the delivery confirmation, this page will instantly update and unlock the review form."}
              </p>
            </div>
          </div>
        </div>

        {/* MERCHANT COMMUNICATION & LIVE IN-APP CHAT (FOR CUSTOMERS WITH OR WITHOUT WHATSAPP) */}
        <div style={{
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border-color)',
          borderRadius: '8px',
          padding: '20px',
          marginBottom: '24px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '16px',
            flexWrap: 'wrap',
            gap: '12px',
            borderBottom: '1px solid var(--border-color)',
            paddingBottom: '12px'
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <MessageSquare size={18} color="var(--accent-secondary)" />
                <h3 className="serif-title" style={{ fontSize: '1.15rem', margin: 0, color: 'var(--text-main)' }}>
                  CHAT PENJUAL & LIVE SUPPORT
                </h3>
              </div>
              <p className="mono" style={{ fontSize: '0.74rem', color: 'var(--text-muted)', margin: '4px 0 0 0' }}>
                Gunakan tombol WhatsApp di samping, atau chat langsung di bawah jika tidak memiliki WhatsApp.
              </p>
            </div>

            {/* WhatsApp direct chat button */}
            {whatsappUrl && (
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="btn btn-success"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  textDecoration: 'none',
                  padding: '9px 18px',
                  fontSize: '0.82rem',
                  fontWeight: 800,
                  boxShadow: '0 0 15px rgba(16, 185, 129, 0.2)'
                }}
              >
                <Send size={15} />
                <span>CHAT PENJUAL VIA WHATSAPP</span>
              </a>
            )}
          </div>

          {/* Live In-App Chat Container */}
          <div style={{
            background: 'var(--bg-primary)',
            border: '1px solid var(--border-color)',
            borderRadius: '6px',
            overflow: 'hidden'
          }}>
            <div style={{
              background: 'var(--bg-tertiary)',
              padding: '8px 14px',
              borderBottom: '1px solid var(--border-color)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '0.74rem'
            }}>
              <span className="mono" style={{ color: 'var(--accent-secondary)', fontWeight: 700 }}>
                // SISTEM CHAT LANGSUNG DENGAN PENJUAL / ADMIN
              </span>
              <span className="mono" style={{ color: '#10b981', display: 'flex', alignItems: 'center', gap: '5px' }}>
                <span style={{
                  width: '7px',
                  height: '7px',
                  borderRadius: '50%',
                  background: '#10b981',
                  display: 'inline-block',
                  boxShadow: '0 0 6px #10b981'
                }} />
                Online Real-Time
              </span>
            </div>

            {/* Message Feed */}
            <div style={{
              height: '220px',
              overflowY: 'auto',
              padding: '14px',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
              background: 'rgba(0,0,0,0.2)'
            }}>
              {chatMessages.length === 0 ? (
                <div style={{
                  margin: 'auto',
                  textAlign: 'center',
                  color: 'var(--text-muted)',
                  fontSize: '0.8rem',
                  padding: '16px'
                }}>
                  <p className="mono" style={{ marginBottom: '4px' }}>💬 Belum ada percakapan untuk pesanan #{currentOrder.id}.</p>
                  <p style={{ margin: 0, fontSize: '0.75rem' }}>
                    Ketik pesan di bawah ini jika kamu tidak punya WhatsApp atau ingin langsung bertanya ke admin. Admin dapat membalas chat ini langsung dari terminal admin!
                  </p>
                </div>
              ) : (
                chatMessages.map((msg) => {
                  const isAdmin = msg.sender === 'admin';
                  return (
                    <div
                      key={msg.id}
                      style={{
                        alignSelf: isAdmin ? 'flex-start' : 'flex-end',
                        maxWidth: '82%',
                        background: isAdmin ? 'rgba(16, 185, 129, 0.12)' : 'rgba(255, 42, 68, 0.14)',
                        border: `1px solid ${isAdmin ? '#10b981' : 'var(--accent-primary)'}`,
                        borderRadius: '8px',
                        padding: '10px 14px',
                        boxShadow: isAdmin ? '0 0 10px rgba(16, 185, 129, 0.1)' : '0 0 10px rgba(255, 42, 68, 0.1)'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                        <span className="badge" style={{
                          background: isAdmin ? '#10b981' : 'var(--accent-primary)',
                          color: '#000',
                          fontSize: '0.64rem',
                          fontWeight: 900
                        }}>
                          {isAdmin ? '🛡️ PENJUAL / ADMIN' : (msg.senderName || currentOrder.buyerName)}
                        </span>
                        <span className="mono" style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>
                          {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <div style={{ fontSize: '0.86rem', color: 'var(--text-main)', wordBreak: 'break-word', whiteSpace: 'pre-wrap', lineHeight: '1.4' }}>
                        {msg.text}
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Input message form */}
            <form
              onSubmit={handleSendCustomerChat}
              style={{
                padding: '10px 14px',
                background: 'var(--bg-tertiary)',
                borderTop: '1px solid var(--border-color)',
                display: 'flex',
                gap: '8px'
              }}
            >
              <input
                type="text"
                className="input"
                placeholder="Ketik pesan atau konfirmasi untuk admin toko di sini..."
                value={customerChatInput}
                onChange={(e) => setCustomerChatInput(e.target.value)}
                style={{ flex: 1, fontSize: '0.84rem' }}
              />
              <button
                type="submit"
                className="btn btn-primary"
                style={{
                  padding: '8px 18px',
                  fontSize: '0.84rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <Send size={14} />
                <span>KIRIM</span>
              </button>
            </form>
          </div>
        </div>

        {/* REVIEW FORM SECTION (Unlocks automatically when delivered!) */}
        {isDelivered && (
          <div style={{
            background: 'var(--bg-secondary)',
            border: '2px solid #f5c518',
            borderRadius: '8px',
            padding: '24px',
            marginBottom: '28px',
            boxShadow: '0 0 30px rgba(245, 197, 24, 0.25)'
          }}>
            {reviewSubmitted ? (
              <div style={{ textAlign: 'center', padding: '20px 10px' }}>
                <div style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  background: 'rgba(16, 185, 129, 0.15)',
                  border: '2px solid #10b981',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 14px auto'
                }}>
                  <CheckCircle2 size={32} color="#10b981" />
                </div>
                <h3 className="serif-title" style={{ fontSize: '1.35rem', color: '#10b981', marginBottom: '6px' }}>
                  THANK YOU FOR YOUR REVIEW!
                </h3>
                <p className="mono" style={{ fontSize: '0.84rem', color: 'var(--text-muted)', maxWidth: '480px', margin: '0 auto 20px auto' }}>
                  Your rating and feedback have been published to the Faust Store live customer review carousel.
                </p>
                <button
                  onClick={() => navigate('/')}
                  className="btn btn-primary"
                >
                  <ArrowLeft size={16} />
                  <span>BACK TO STORE CATALOG</span>
                </button>
              </div>
            ) : (
              <form onSubmit={handleReviewSubmit}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <Sparkles size={18} color="#f5c518" />
                  <span className="mono" style={{ fontSize: '0.84rem', fontWeight: 800, color: '#f5c518' }}>
                    RATE & REVIEW YOUR TRANSACTION:
                  </span>
                </div>

                <h3 className="serif-title" style={{ fontSize: '1.25rem', marginBottom: '14px' }}>
                  How was your shopping experience, {currentOrder.buyerName}?
                </h3>

                {/* 5-Star Rating Selector */}
                <div style={{ marginBottom: '18px' }}>
                  <div className="mono" style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
                    SELECT RATING:
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => {
                          playSound('click');
                          setRating(star);
                        }}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          cursor: 'pointer',
                          padding: '4px',
                          transform: (hoverRating || rating) >= star ? 'scale(1.15)' : 'scale(1)',
                          transition: 'transform 0.15s ease'
                        }}
                      >
                        <Star
                          size={32}
                          fill={(hoverRating || rating) >= star ? '#f5c518' : 'none'}
                          color={(hoverRating || rating) >= star ? '#f5c518' : 'var(--text-muted)'}
                          style={{
                            filter: (hoverRating || rating) >= star ? 'drop-shadow(0 0 8px rgba(245, 197, 24, 0.8))' : 'none'
                          }}
                        />
                      </button>
                    ))}
                    <span className="mono" style={{ marginLeft: '12px', fontSize: '0.88rem', fontWeight: 800, color: '#f5c518' }}>
                      {rating} / 5 STARS
                    </span>
                  </div>
                </div>

                {/* Comment Box */}
                <div style={{ marginBottom: '18px' }}>
                  <label className="mono" style={{ fontSize: '0.74rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                    CUSTOMER FEEDBACK / TESTIMONIAL:
                  </label>
                  <textarea
                    rows={4}
                    required
                    className="input"
                    placeholder="Fast delivery, safe trade, great seller communication..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    style={{
                      width: '100%',
                      resize: 'vertical',
                      fontFamily: 'inherit',
                      fontSize: '0.88rem'
                    }}
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{
                    padding: '12px 24px',
                    fontSize: '0.9rem',
                    fontWeight: 800,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  <Star size={16} fill="#000" />
                  <span>SUBMIT RATING & REVIEW</span>
                </button>
              </form>
            )}
          </div>
        )}

        {/* Order Details Grid */}
        <div style={{
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border-color)',
          borderRadius: '8px',
          overflow: 'hidden'
        }}>
          {/* Header */}
          <div style={{
            padding: '14px 18px',
            background: 'var(--bg-tertiary)',
            borderBottom: '1px solid var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '10px'
          }}>
            <span className="mono" style={{ fontSize: '0.84rem', fontWeight: 800 }}>
              ORDER SPECIFICATIONS
            </span>
            <span className="mono" style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
              Placed: {new Date(currentOrder.createdAt).toLocaleString()}
            </span>
          </div>

          <div style={{ padding: '18px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Customer & Delivery Information */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '14px',
              padding: '14px',
              background: 'var(--bg-primary)',
              border: '1px solid var(--border-color)',
              borderRadius: '4px',
              fontSize: '0.84rem'
            }}>
              <div>
                <span className="mono" style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block' }}>
                  CUSTOMER CODENAME:
                </span>
                <strong style={{ color: 'var(--text-main)' }}>{currentOrder.buyerName}</strong>
              </div>

              <div>
                <span className="mono" style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block' }}>
                  CONTACT / WHATSAPP:
                </span>
                <strong style={{ color: 'var(--text-main)' }}>{currentOrder.buyerContact}</strong>
              </div>

              {currentOrder.robloxUsername && (
                <div>
                  <span className="mono" style={{ fontSize: '0.7rem', color: '#f5c518', display: 'block' }}>
                    🎮 ROBLOX USERNAME:
                  </span>
                  <strong style={{ color: '#f5c518' }}>{currentOrder.robloxUsername}</strong>
                </div>
              )}

              {currentOrder.steamTradeUrl && (
                <div>
                  <span className="mono" style={{ fontSize: '0.7rem', color: '#00b4d8', display: 'block' }}>
                    🔗 STEAM TRADE URL:
                  </span>
                  <a
                    href={currentOrder.steamTradeUrl}
                    target="_blank"
                    rel="noreferrer"
                    style={{ color: '#00b4d8', fontSize: '0.78rem', wordBreak: 'break-all' }}
                  >
                    View Trade URL ↗
                  </a>
                </div>
              )}

              <div>
                <span className="mono" style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block' }}>
                  PAYMENT METHOD:
                </span>
                <strong style={{ color: 'var(--accent-primary)' }}>{currentOrder.paymentMethod}</strong>
              </div>
            </div>

            {/* Ordered Items List */}
            <div>
              <div className="mono" style={{ fontSize: '0.76rem', color: 'var(--accent-secondary)', marginBottom: '8px' }}>
                // PURCHASED ITEMS:
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {currentOrder.items?.map((it, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '10px 14px',
                      background: 'var(--bg-primary)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '4px',
                      gap: '12px'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      {it.image && (
                        <img
                          src={it.image}
                          alt={it.name}
                          style={{ width: '38px', height: '38px', borderRadius: '4px', objectFit: 'cover' }}
                        />
                      )}
                      <div>
                        <div style={{ fontSize: '0.86rem', fontWeight: 700 }}>{it.name}</div>
                        <div className="mono" style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                          {it.game} • {it.quantity}x @ {formatPrice(it.price)}
                        </div>
                      </div>
                    </div>

                    <div className="mono" style={{ fontSize: '0.92rem', fontWeight: 800, color: 'var(--accent-primary)' }}>
                      {formatPrice(it.price * it.quantity)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Total Payment */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px 16px',
              background: 'var(--bg-tertiary)',
              border: '1px solid var(--border-color)',
              borderRadius: '4px'
            }}>
              <span className="mono" style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                TOTAL AMOUNT:
              </span>
              <span className="mono glow-text" style={{ fontSize: '1.35rem', fontWeight: 900, color: 'var(--accent-primary)' }}>
                {formatPrice(currentOrder.totalPrice)}
              </span>
            </div>

            {/* Contact WhatsApp Button */}
            {merchantProfile.whatsapp && (
              <a
                href={`https://wa.me/${merchantProfile.whatsapp.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noreferrer"
                className="btn btn-success"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  textDecoration: 'none',
                  padding: '12px'
                }}
              >
                <Send size={16} />
                <span>CHAT MERCHANT ON WHATSAPP FOR IMMEDIATE SUPPORT</span>
              </a>
            )}

          </div>
        </div>

      </main>
    </div>
  );
}
