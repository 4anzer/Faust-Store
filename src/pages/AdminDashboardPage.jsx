import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCatalog } from '../context/CatalogContext';
import { THREAT_LEVELS } from '../data/defaultData';
import { testDiscordWebhook, CARMEN_AVATAR_URL } from '../utils/discordWebhook';
import { 
  ShieldAlert, 
  LogOut, 
  Store, 
  Inbox, 
  Package, 
  Plus, 
  Gamepad2, 
  Bell, 
  Save, 
  Trash2, 
  Edit3, 
  Upload, 
  Download, 
  RotateCcw, 
  Send, 
  ExternalLink,
  CheckCircle
} from 'lucide-react';

export function AdminDashboardPage() {
  const { adminUser, logout } = useAuth();
  const navigate = useNavigate();
  const { 
    items, 
    games, 
    orders,
    merchantProfile, 
    isStoreOpen,
    toggleStoreStatus,
    addItem, 
    updateItem, 
    deleteItem, 
    addCategory, 
    deleteCategory, 
    updateMerchantProfile, 
    updateOrderStatus,
    deleteOrder,
    resetToDefaults, 
    exportDatabaseJSON, 
    importDatabaseJSON, 
    playSound 
  } = useCatalog();

  const [activeTab, setActiveTab] = useState('orders');
  const [editingItem, setEditingItem] = useState(null);

  // Form State
  const initialFormState = {
    name: '',
    game: games[0] || 'Limbus Company',
    threat: 'HE',
    price: 50000,
    currency: 'Rp',
    stock: 1,
    tag: 'Item / Senjata',
    image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80',
    description: '',
    deliveryMethod: 'Pengiriman instan via chat langsung.',
    featured: false,
    properties: [{ label: 'Status', value: 'Ready' }]
  };

  const [formData, setFormData] = useState(initialFormState);
  const [newGameInput, setNewGameInput] = useState('');
  const [profileForm, setProfileForm] = useState({ ...merchantProfile });
  const [testingWebhook, setTestingWebhook] = useState(false);
  const [webhookTestResult, setWebhookTestResult] = useState(null);
  const [importStatus, setImportStatus] = useState(null);

  const handleLogout = () => {
    playSound('hazard');
    logout();
    navigate('/admin/login', { replace: true });
  };

  const handleImageFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("Ukuran file gambar maksimal 2MB!");
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        setFormData((prev) => ({ ...prev, image: event.target.result }));
        playSound('beep');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveItem = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      alert("Nama barang harus diisi!");
      return;
    }

    if (editingItem && editingItem.id) {
      updateItem(editingItem.id, formData);
      alert(`Barang "${formData.name}" berhasil diperbarui!`);
    } else {
      addItem(formData);
      alert(`Barang "${formData.name}" berhasil ditambahkan ke kategori ${formData.game}!`);
    }

    setFormData(initialFormState);
    setEditingItem(null);
    setActiveTab('items-list');
  };

  const handleAddGameCategory = (e) => {
    e.preventDefault();
    if (!newGameInput.trim()) return;
    addCategory(newGameInput.trim());
    setNewGameInput('');
  };

  React.useEffect(() => {
    setProfileForm({ ...merchantProfile });
  }, [merchantProfile]);

  const handleSaveProfile = (e) => {
    e.preventDefault();
    updateMerchantProfile(profileForm);
    alert("Pengaturan toko dan webhook berhasil disimpan!");
  };

  const handleTestWebhook = async () => {
    const webhookToTest = profileForm.discordWebhook?.trim() || merchantProfile.discordWebhook?.trim();
    if (!webhookToTest) {
      alert("Masukkan URL Discord Webhook terlebih dahulu!");
      return;
    }
    setTestingWebhook(true);
    setWebhookTestResult(null);
    const result = await testDiscordWebhook(webhookToTest);
    setWebhookTestResult(result);
    setTestingWebhook(false);
    if (result.success) {
      // Automatically persist verified webhook to merchant profile
      updateMerchantProfile({ ...profileForm, discordWebhook: webhookToTest });
      playSound('equip');
    } else {
      playSound('hazard');
    }
  };

  const formatPrice = (price, currency = 'Rp') => {
    if (typeof price === 'number') {
      return `${currency} ${price.toLocaleString('id-ID')}`;
    }
    return `${currency} ${price}`;
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg-primary)' }}>
      
      {/* Top Admin Navbar */}
      <nav style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        background: 'var(--bg-secondary)',
        borderBottom: '1px solid var(--border-color)',
        padding: '12px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '8px',
            border: '2px solid var(--accent-primary)',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 12px var(--accent-glow)',
            background: '#000'
          }}>
            <img 
              src="/logo.png" 
              alt="Faust Store" 
              style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
            />
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="serif-title" style={{ fontSize: '1.15rem', fontWeight: 900, color: 'var(--text-main)' }}>
                FAUST STORE // ADMIN DASHBOARD
              </span>
              <span className="badge" style={{ background: '#10b981', color: '#000', fontSize: '0.65rem', fontWeight: 800 }}>
                AUTHENTICATED
              </span>
            </div>
            <div className="mono" style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
              Logged in as: <strong style={{ color: 'var(--accent-secondary)' }}>{adminUser || 'Admin'}</strong>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          
          {/* Store Open / Closed Toggle Button */}
          <button
            onClick={() => {
              const nextState = toggleStoreStatus();
              alert(`Status toko berhasil diubah menjadi: ${nextState ? 'BUKA (Menerima Pesanan)' : 'TUTUP (Pemesanan Dinonaktifkan)'}`);
            }}
            className="btn btn-sm"
            style={{
              background: isStoreOpen ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255, 42, 68, 0.18)',
              borderColor: isStoreOpen ? '#10b981' : '#ff2a44',
              color: isStoreOpen ? '#10b981' : '#ff475e',
              fontWeight: 800
            }}
            title="Klik untuk mengubah status BUKA / TUTUP toko"
          >
            <span style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: isStoreOpen ? '#10b981' : '#ff2a44',
              boxShadow: isStoreOpen ? '0 0 8px #10b981' : '0 0 8px #ff2a44'
            }} />
            <span>STATUS TOKO: {isStoreOpen ? 'BUKA' : 'TUTUP'}</span>
          </button>

          <Link
            to="/"
            target="_blank"
            className="btn btn-sm"
            style={{ textDecoration: 'none' }}
            title="Lihat Tampilan Toko Publik di Tab Baru"
          >
            <Store size={14} />
            <span>LIHAT TOKO PUBLIK</span>
            <ExternalLink size={12} />
          </Link>

          <button
            onClick={handleLogout}
            className="btn btn-sm btn-danger"
            title="Keluar dari sesi admin"
          >
            <LogOut size={14} />
            <span>LOGOUT</span>
          </button>
        </div>
      </nav>

      {/* Main Container */}
      <div style={{
        maxWidth: '1250px',
        margin: '24px auto',
        padding: '0 20px',
        width: '100%',
        flex: 1
      }}>
        
        {/* Navigation Tabs */}
        <div style={{
          display: 'flex',
          borderBottom: '1px solid var(--border-color)',
          background: 'var(--bg-secondary)',
          borderRadius: 'var(--radius-sm) var(--radius-sm) 0 0',
          overflowX: 'auto'
        }}>
          <button
            onClick={() => { playSound('click'); setActiveTab('orders'); }}
            style={{
              padding: '12px 20px',
              background: activeTab === 'orders' ? 'var(--bg-card)' : 'transparent',
              border: 'none',
              borderBottom: activeTab === 'orders' ? '2px solid var(--accent-primary)' : '2px solid transparent',
              color: activeTab === 'orders' ? 'var(--accent-primary)' : 'var(--text-muted)',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.84rem',
              fontWeight: 700,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Inbox size={15} />
            <span>PESANAN MASUK ({orders.length})</span>
          </button>

          <button
            onClick={() => { playSound('click'); setActiveTab('items-list'); }}
            style={{
              padding: '12px 20px',
              background: activeTab === 'items-list' ? 'var(--bg-card)' : 'transparent',
              border: 'none',
              borderBottom: activeTab === 'items-list' ? '2px solid var(--accent-primary)' : '2px solid transparent',
              color: activeTab === 'items-list' ? 'var(--accent-primary)' : 'var(--text-muted)',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.84rem',
              fontWeight: 700,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Package size={15} />
            <span>DAFTAR BARANG ({items.length})</span>
          </button>

          <button
            onClick={() => { 
              playSound('click'); 
              if (activeTab !== 'item-form') {
                setEditingItem(null);
                setFormData(initialFormState);
              }
              setActiveTab('item-form'); 
            }}
            style={{
              padding: '12px 20px',
              background: activeTab === 'item-form' ? 'var(--bg-card)' : 'transparent',
              border: 'none',
              borderBottom: activeTab === 'item-form' ? '2px solid var(--accent-primary)' : '2px solid transparent',
              color: activeTab === 'item-form' ? 'var(--accent-primary)' : 'var(--text-muted)',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.84rem',
              fontWeight: 700,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Plus size={15} />
            <span>{editingItem ? 'EDIT BARANG' : 'TAMBAH BARANG'}</span>
          </button>

          <button
            onClick={() => { playSound('click'); setActiveTab('categories'); }}
            style={{
              padding: '12px 20px',
              background: activeTab === 'categories' ? 'var(--bg-card)' : 'transparent',
              border: 'none',
              borderBottom: activeTab === 'categories' ? '2px solid var(--accent-primary)' : '2px solid transparent',
              color: activeTab === 'categories' ? 'var(--accent-primary)' : 'var(--text-muted)',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.84rem',
              fontWeight: 700,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Gamepad2 size={15} />
            <span>KATEGORI GAME ({games.length})</span>
          </button>

          <button
            onClick={() => { playSound('click'); setActiveTab('profile'); }}
            style={{
              padding: '12px 20px',
              background: activeTab === 'profile' ? 'var(--bg-card)' : 'transparent',
              border: 'none',
              borderBottom: activeTab === 'profile' ? '2px solid var(--accent-primary)' : '2px solid transparent',
              color: activeTab === 'profile' ? 'var(--accent-primary)' : 'var(--text-muted)',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.84rem',
              fontWeight: 700,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Bell size={15} />
            <span>DISCORD WEBHOOK & KONTAK</span>
          </button>

          <button
            onClick={() => { playSound('click'); setActiveTab('backup'); }}
            style={{
              padding: '12px 20px',
              background: activeTab === 'backup' ? 'var(--bg-card)' : 'transparent',
              border: 'none',
              borderBottom: activeTab === 'backup' ? '2px solid var(--accent-primary)' : '2px solid transparent',
              color: activeTab === 'backup' ? 'var(--accent-primary)' : 'var(--text-muted)',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.84rem',
              fontWeight: 700,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Save size={15} />
            <span>BACKUP DATA</span>
          </button>
        </div>

        {/* Tab Body Card */}
        <div style={{
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border-color)',
          borderTop: 'none',
          borderRadius: '0 0 var(--radius-sm) var(--radius-sm)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.5)'
        }}>

          {/* TAB 1: ORDERS LIST */}
          {activeTab === 'orders' && (
            <div style={{ padding: '24px' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '20px',
                flexWrap: 'wrap',
                gap: '12px'
              }}>
                <div>
                  <h3 className="serif-title" style={{ fontSize: '1.2rem', color: 'var(--text-main)' }}>
                    DAFTAR PESANAN PELANGGAN (REAL-TIME)
                  </h3>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                    Pelanggan memesan tanpa registrasi akun. Rincian order langsung tercatat di sini & terkirim ke Discord.
                  </p>
                </div>

                {orders.length > 0 && (
                  <button
                    onClick={() => {
                      if (window.confirm("Hapus semua riwayat pesanan?")) {
                        orders.forEach(o => deleteOrder(o.id));
                      }
                    }}
                    className="btn btn-sm btn-danger"
                  >
                    <Trash2 size={13} />
                    <span>HAPUS SEMUA RIWAYAT</span>
                  </button>
                )}
              </div>

              {orders.length === 0 ? (
                <div style={{
                  textAlign: 'center',
                  padding: '50px 20px',
                  border: '1px dashed var(--border-color)',
                  borderRadius: 'var(--radius-sm)',
                  color: 'var(--text-muted)'
                }}>
                  <Inbox size={48} style={{ opacity: 0.3, margin: '0 auto 12px auto' }} />
                  <h4 style={{ color: 'var(--text-main)', marginBottom: '4px' }}>Belum Ada Pesanan Masuk</h4>
                  <p style={{ fontSize: '0.84rem' }}>Saat pelanggan melakukan pemesanan di toko, detailnya akan otomatis muncul di list ini.</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {orders.map((ord) => {
                    const cleanWA = (ord.buyerContact || '').replace(/[^0-9]/g, '');
                    const isPending = ord.status === 'Pending';
                    const isDone = ord.status === 'Selesai';

                    return (
                      <div
                        key={ord.id}
                        style={{
                          background: 'var(--bg-primary)',
                          border: '1px solid var(--border-color)',
                          padding: '16px',
                          borderRadius: 'var(--radius-sm)',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '12px'
                        }}
                      >
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          flexWrap: 'wrap',
                          gap: '8px',
                          borderBottom: '1px solid var(--border-color)',
                          paddingBottom: '10px'
                        }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <span className="mono" style={{ fontWeight: 800, color: 'var(--accent-primary)', fontSize: '0.95rem' }}>
                              #{ord.id}
                            </span>
                            <span className="mono" style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                              {new Date(ord.createdAt).toLocaleString('id-ID')}
                            </span>
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                            {isPending && (
                              <button
                                onClick={() => {
                                  updateOrderStatus(ord.id, 'Selesai');
                                }}
                                className="btn btn-sm btn-success"
                                style={{
                                  padding: '4px 10px',
                                  fontSize: '0.74rem',
                                  fontWeight: 800,
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '5px'
                                }}
                                title="Klik jika barang sudah dikirimkan ke pembeli"
                              >
                                <CheckCircle size={13} />
                                <span>BARANG SUDAH DIKIRIM</span>
                              </button>
                            )}

                            <a
                              href={`/order-status/${ord.id}`}
                              target="_blank"
                              rel="noreferrer"
                              className="btn btn-sm"
                              style={{ padding: '4px 8px', fontSize: '0.72rem', display: 'flex', alignItems: 'center', gap: '4px' }}
                              title="Buka halaman status & review pembeli"
                            >
                              <ExternalLink size={12} />
                              <span>Live Page</span>
                            </a>

                            <span className="mono" style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>Status:</span>
                            <select
                              className="select"
                              value={ord.status}
                              onChange={(e) => updateOrderStatus(ord.id, e.target.value)}
                              style={{
                                width: 'auto',
                                padding: '4px 10px',
                                fontSize: '0.75rem',
                                fontWeight: 700,
                                color: isDone ? '#10b981' : isPending ? '#f5c518' : '#ff2a44',
                                borderColor: isDone ? '#10b981' : isPending ? '#f5c518' : '#ff2a44'
                              }}
                            >
                              <option value="Pending">Pending (Menunggu)</option>
                              <option value="Selesai">Selesai (Sudah Dikirim)</option>
                              <option value="Dibatalkan">Dibatalkan</option>
                            </select>
                          </div>
                        </div>

                        {/* Order Info Grid */}
                        <div style={{
                          display: 'grid',
                          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                          gap: '12px',
                          fontSize: '0.85rem'
                        }}>
                          <div>
                            <div style={{ color: 'var(--text-muted)', fontSize: '0.72rem' }}>NAMA PEMBELI:</div>
                            <strong style={{ color: 'var(--text-main)' }}>{ord.buyerName}</strong>
                          </div>

                          <div>
                            <div style={{ color: 'var(--text-muted)', fontSize: '0.72rem' }}>KONTAK:</div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <span>{ord.buyerContact}</span>
                              {cleanWA && (
                                <a
                                  href={`https://wa.me/${cleanWA.startsWith('0') ? '62' + cleanWA.slice(1) : cleanWA}`}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="btn btn-sm btn-success"
                                  style={{ padding: '3px 8px', fontSize: '0.72rem', textDecoration: 'none' }}
                                >
                                  Chat WhatsApp
                                </a>
                              )}
                            </div>
                          </div>

                          <div>
                            <div style={{ color: 'var(--text-muted)', fontSize: '0.72rem' }}>METODE PEMBAYARAN:</div>
                            <strong style={{ color: 'var(--accent-secondary)' }}>{ord.paymentMethod}</strong>
                          </div>

                          <div>
                            <div style={{ color: 'var(--text-muted)', fontSize: '0.72rem' }}>TOTAL PEMBAYARAN:</div>
                            <strong style={{ color: 'var(--accent-primary)', fontSize: '1.05rem' }}>
                              {formatPrice(ord.totalPrice, 'Rp')}
                            </strong>
                          </div>
                        </div>

                        {/* Items ordered */}
                        <div style={{
                          background: 'var(--bg-tertiary)',
                          padding: '12px',
                          borderRadius: 'var(--radius-sm)',
                          fontSize: '0.82rem'
                        }}>
                          <div style={{ color: 'var(--text-muted)', fontSize: '0.72rem', marginBottom: '6px' }}>
                            RINCIAN BARANG:
                          </div>
                          {ord.items.map((it, idx) => (
                            <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '3px 0' }}>
                              <span>• {it.name} [{it.game}] ({it.quantity}x)</span>
                              <span className="mono" style={{ color: 'var(--accent-primary)', fontWeight: 700 }}>
                                {formatPrice(it.price * it.quantity, 'Rp')}
                              </span>
                            </div>
                          ))}
                        </div>

                        {ord.notes && (
                          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                            <strong>Catatan Pembeli:</strong> <em>"{ord.notes}"</em>
                          </div>
                        )}

                        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                          <button
                            onClick={() => {
                              if (window.confirm("Hapus pesanan ini dari riwayat?")) deleteOrder(ord.id);
                            }}
                            className="btn btn-sm btn-danger"
                            style={{ padding: '3px 10px', fontSize: '0.72rem' }}
                          >
                            <Trash2 size={12} />
                            <span>Hapus Pesanan</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: ITEMS LIST */}
          {activeTab === 'items-list' && (
            <div style={{ padding: '24px' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '16px',
                flexWrap: 'wrap',
                gap: '10px'
              }}>
                <div>
                  <h3 className="serif-title" style={{ fontSize: '1.15rem', color: 'var(--text-main)' }}>
                    DAFTAR SELURUH BARANG TOKO
                  </h3>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    Ubah nama, harga, stok, atau upload foto barang baru.
                  </p>
                </div>

                <button
                  onClick={() => {
                    setEditingItem(null);
                    setFormData(initialFormState);
                    setActiveTab('item-form');
                  }}
                  className="btn btn-primary btn-sm"
                >
                  <Plus size={14} />
                  <span>TAMBAH BARANG BARU</span>
                </button>
              </div>

              <div style={{
                maxHeight: '480px',
                overflowY: 'auto',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-sm)'
              }}>
                {items.map((it) => (
                  <div
                    key={it.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '12px 16px',
                      borderBottom: '1px solid var(--border-color)',
                      background: 'var(--bg-primary)',
                      gap: '12px',
                      flexWrap: 'wrap'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: '1 1 240px' }}>
                      <img
                        src={it.image}
                        alt={it.name}
                        style={{
                          width: '46px',
                          height: '46px',
                          objectFit: 'cover',
                          borderRadius: '4px',
                          border: '1px solid var(--border-color)'
                        }}
                      />
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-main)' }}>
                          {it.name}
                        </div>
                        <div className="mono" style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                          {it.game} | Stok: <strong style={{ color: it.stock > 0 ? '#10b981' : '#ff2a44' }}>{it.stock}</strong>
                        </div>
                      </div>
                    </div>

                    <div className="mono" style={{
                      minWidth: '100px',
                      textAlign: 'right',
                      fontWeight: 800,
                      color: 'var(--accent-primary)',
                      fontSize: '0.95rem'
                    }}>
                      {formatPrice(it.price, it.currency)}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <button
                        onClick={() => {
                          setEditingItem(it);
                          setFormData({
                            ...initialFormState,
                            ...it,
                            properties: it.properties || []
                          });
                          setActiveTab('item-form');
                        }}
                        className="btn btn-sm"
                        style={{ padding: '5px 12px' }}
                      >
                        <Edit3 size={13} />
                        <span>EDIT</span>
                      </button>

                      <button
                        onClick={() => {
                          if (window.confirm(`Hapus barang: "${it.name}"?`)) {
                            deleteItem(it.id);
                          }
                        }}
                        className="btn btn-sm btn-danger"
                        style={{ padding: '5px 8px' }}
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: ADD / EDIT ITEM FORM */}
          {activeTab === 'item-form' && (
            <form onSubmit={handleSaveItem} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderBottom: '1px solid var(--border-color)',
                paddingBottom: '10px'
              }}>
                <h3 className="serif-title" style={{ fontSize: '1.15rem', color: 'var(--text-main)' }}>
                  {editingItem ? `EDIT BARANG: ${editingItem.name}` : 'TAMBAH BARANG BARU'}
                </h3>
                {editingItem && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingItem(null);
                      setFormData(initialFormState);
                    }}
                    className="btn btn-sm"
                  >
                    Batal Edit
                  </button>
                )}
              </div>

              {/* Name & Game */}
              <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '12px' }}>
                <div>
                  <label className="mono" style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                    NAMA BARANG *:
                  </label>
                  <input
                    type="text"
                    required
                    className="input"
                    placeholder="Contoh: Faust 000 Identity / Primogems / Akun Starter"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div>
                  <label className="mono" style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                    KATEGORI GAME *:
                  </label>
                  <select
                    className="select"
                    value={formData.game}
                    onChange={(e) => setFormData({ ...formData, game: e.target.value })}
                  >
                    {games.map((g) => (
                      <option key={g} value={g}>{g}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Price, Stock, Threat, Tag */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '12px' }}>
                <div>
                  <label className="mono" style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                    HARGA BARANG (RP) *:
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    className="input"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                  />
                </div>

                <div>
                  <label className="mono" style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                    JUMLAH STOK:
                  </label>
                  <input
                    type="number"
                    min="0"
                    className="input"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                  />
                </div>

                <div>
                  <label className="mono" style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                    TIER / KELANGKAAN:
                  </label>
                  <select
                    className="select"
                    value={formData.threat}
                    onChange={(e) => setFormData({ ...formData, threat: e.target.value })}
                  >
                    {Object.keys(THREAT_LEVELS).map((lvl) => (
                      <option key={lvl} value={lvl}>{lvl} - {THREAT_LEVELS[lvl].name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mono" style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                    TAG / TIPE:
                  </label>
                  <input
                    type="text"
                    className="input"
                    placeholder="Akun, Senjata, Topup, Jasa"
                    value={formData.tag}
                    onChange={(e) => setFormData({ ...formData, tag: e.target.value })}
                  />
                </div>
              </div>

              {/* Image Input */}
              <div>
                <label className="mono" style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                  GAMBAR BARANG (PASTE LINK URL ATAU UPLOAD DARI HP/PC):
                </label>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <input
                    type="text"
                    className="input"
                    placeholder="https://... link gambar atau klik tombol upload di kanan"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  />
                  <label className="btn btn-sm" style={{ cursor: 'pointer', whiteSpace: 'nowrap' }}>
                    <Upload size={14} />
                    <span>UPLOAD FOTO</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageFileUpload}
                      style={{ display: 'none' }}
                    />
                  </label>
                </div>

                {formData.image && (
                  <div style={{ marginTop: '8px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <img
                      src={formData.image}
                      alt="Preview"
                      style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '4px', border: '1px solid var(--border-color)' }}
                    />
                    <span className="mono" style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                      Preview Gambar Siap Digunakan
                    </span>
                  </div>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="mono" style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                  DESKRIPSI / RINCIAN BARANG:
                </label>
                <textarea
                  className="textarea"
                  rows="3"
                  placeholder="Jelaskan spesifikasi, kelebihan, efek item, atau ketentuan akun..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              {/* Delivery method */}
              <div>
                <label className="mono" style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                  CARA PENGIRIMAN:
                </label>
                <input
                  type="text"
                  className="input"
                  placeholder="Contoh: Pengiriman data akun via WhatsApp setelah transfer"
                  value={formData.deliveryMethod}
                  onChange={(e) => setFormData({ ...formData, deliveryMethod: e.target.value })}
                />
              </div>

              {/* Submit button */}
              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ padding: '10px 24px', flex: 1 }}
                >
                  <Save size={16} />
                  <span>{editingItem ? 'SIMPAN PERUBAHAN BARANG' : 'SIMPAN BARANG KE KATALOG'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('items-list')}
                  className="btn"
                >
                  KEMBALI
                </button>
              </div>
            </form>
          )}

          {/* TAB 4: CATEGORIES */}
          {activeTab === 'categories' && (
            <div style={{ padding: '24px' }}>
              <h3 className="serif-title" style={{ fontSize: '1.15rem', color: 'var(--text-main)', marginBottom: '6px' }}>
                KELOLA KATEGORI GAME
              </h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
                Admin dapat menambah kategori game baru (misal: Roblox, Valorant, Genshin, dll) atau menghapus kategori game.
              </p>

              <form onSubmit={handleAddGameCategory} style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                <input
                  type="text"
                  className="input"
                  placeholder="Ketik nama game baru (contoh: Roblox / Valorant / CS2)..."
                  value={newGameInput}
                  onChange={(e) => setNewGameInput(e.target.value)}
                  style={{ flex: 1 }}
                />
                <button type="submit" className="btn btn-primary">
                  <Plus size={16} />
                  <span>TAMBAH KATEGORI</span>
                </button>
              </form>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                gap: '10px'
              }}>
                {games.map((g) => {
                  const count = items.filter(it => it.game === g).length;
                  return (
                    <div
                      key={g}
                      style={{
                        background: 'var(--bg-primary)',
                        border: '1px solid var(--border-color)',
                        padding: '12px 16px',
                        borderRadius: 'var(--radius-sm)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                      }}
                    >
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-main)' }}>
                          🎮 {g}
                        </div>
                        <div className="mono" style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                          {count} item terdaftar
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          if (count > 0) {
                            if (!window.confirm(`Ada ${count} item di dalam kategori "${g}". Tetap ingin menghapus kategori ini?`)) {
                              return;
                            }
                          }
                          deleteCategory(g);
                        }}
                        className="btn btn-sm btn-danger"
                        title={`Hapus kategori ${g}`}
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 5: DISCORD WEBHOOK & PROFILE */}
          {activeTab === 'profile' && (
            <form onSubmit={handleSaveProfile} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <h3 className="serif-title" style={{ fontSize: '1.15rem', color: 'var(--text-main)', marginBottom: '4px' }}>
                  DISCORD WEBHOOK & PENGATURAN TOKO
                </h3>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                  Setiap kali pembeli melakukan checkout pesanan, notifikasi otomatis akan dikirim ke server Discord kamu.
                </p>
              </div>

              {/* Webhook Box */}
              <div style={{
                background: 'rgba(114, 137, 218, 0.06)',
                border: '1px solid rgba(114, 137, 218, 0.35)',
                padding: '18px',
                borderRadius: 'var(--radius-md)',
                display: 'flex',
                flexDirection: 'column',
                gap: '14px',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.25)'
              }}>
                {/* Bot Profile Card */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                  background: 'rgba(0, 0, 0, 0.35)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '12px 14px'
                }}>
                  <div style={{ position: 'relative' }}>
                    <img
                      src="/carmen.png"
                      alt="Carmen Project Moon"
                      onError={(e) => { e.target.src = CARMEN_AVATAR_URL; }}
                      style={{
                        width: '52px',
                        height: '52px',
                        objectFit: 'cover',
                        objectPosition: 'top center',
                        borderRadius: '50%',
                        border: '2px solid #C41E3A',
                        boxShadow: '0 0 12px rgba(196, 30, 58, 0.5)',
                        background: '#1a1820'
                      }}
                    />
                    <span style={{
                      position: 'absolute',
                      bottom: 0,
                      right: 0,
                      width: '12px',
                      height: '12px',
                      borderRadius: '50%',
                      background: '#10b981',
                      border: '2px solid #000'
                    }} />
                  </div>

                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                      <span style={{ fontWeight: 800, fontSize: '0.95rem', color: '#fff', letterSpacing: '0.5px' }}>
                        CARMEN
                      </span>
                      <span style={{
                        background: 'rgba(196, 30, 58, 0.25)',
                        color: '#ff6b81',
                        border: '1px solid rgba(196, 30, 58, 0.5)',
                        fontSize: '0.68rem',
                        padding: '2px 8px',
                        borderRadius: '10px',
                        fontFamily: 'var(--font-mono)',
                        fontWeight: 700
                      }}>
                        PROJECT MOON NOTIFIER
                      </span>
                    </div>
                    <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '3px', lineHeight: '1.3' }}>
                      Bot notifikasi aktif yang akan mengirimkan rincian pesanan pelanggan baru ke Discord dengan embed visual lengkap (identitas pembeli, link WhatsApp, rincian item, dan nominal tagihan).
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#7289da' }}>
                  <Bell size={18} />
                  <span className="mono" style={{ fontWeight: 700, fontSize: '0.86rem' }}>
                    DISCORD WEBHOOK URL (NOTIFIKASI ORDER):
                  </span>
                </div>

                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <input
                    type="text"
                    className="input"
                    placeholder="https://discord.com/api/webhooks/..."
                    value={profileForm.discordWebhook || ''}
                    onChange={(e) => setProfileForm({ ...profileForm, discordWebhook: e.target.value })}
                    style={{ flex: 1, fontFamily: 'var(--font-mono)', fontSize: '0.82rem' }}
                  />
                  <button
                    type="button"
                    onClick={handleTestWebhook}
                    disabled={testingWebhook}
                    className="btn btn-sm"
                    style={{
                      borderColor: '#7289da',
                      color: '#fff',
                      background: testingWebhook ? 'rgba(114, 137, 218, 0.3)' : 'rgba(114, 137, 218, 0.2)',
                      whiteSpace: 'nowrap',
                      minWidth: '135px',
                      justifyContent: 'center'
                    }}
                  >
                    <Send size={13} />
                    <span>{testingWebhook ? "MENGIRIM..." : "TES WEBHOOK"}</span>
                  </button>
                </div>

                {webhookTestResult && (
                  <div style={{
                    fontSize: '0.8rem',
                    fontFamily: 'var(--font-mono)',
                    color: webhookTestResult.success ? '#10b981' : '#ff4d6d',
                    padding: '8px 12px',
                    borderRadius: 'var(--radius-sm)',
                    background: webhookTestResult.success ? 'rgba(16, 185, 129, 0.1)' : 'rgba(255, 77, 109, 0.1)',
                    border: `1px solid ${webhookTestResult.success ? 'rgba(16, 185, 129, 0.3)' : 'rgba(255, 77, 109, 0.3)'}`,
                    lineHeight: '1.4'
                  }}>
                    {webhookTestResult.message}
                  </div>
                )}
              </div>

              {/* Store Name & Subtitle */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label className="mono" style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                    NAMA TOKO:
                  </label>
                  <input
                    type="text"
                    className="input"
                    value={profileForm.shopName}
                    onChange={(e) => setProfileForm({ ...profileForm, shopName: e.target.value })}
                  />
                </div>

                <div>
                  <label className="mono" style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                    SLOGAN / SUBTITLE:
                  </label>
                  <input
                    type="text"
                    className="input"
                    value={profileForm.subtitle}
                    onChange={(e) => setProfileForm({ ...profileForm, subtitle: e.target.value })}
                  />
                </div>
              </div>

              {/* WhatsApp & Discord */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label className="mono" style={{ fontSize: '0.75rem', color: '#25d366', display: 'block', marginBottom: '4px' }}>
                    NOMOR WHATSAPP PENERIMA ORDER *:
                  </label>
                  <input
                    type="text"
                    className="input"
                    placeholder="Contoh: 628123456789 (Gunakan kode 62)"
                    value={profileForm.whatsapp}
                    onChange={(e) => setProfileForm({ ...profileForm, whatsapp: e.target.value })}
                  />
                </div>

                <div>
                  <label className="mono" style={{ fontSize: '0.75rem', color: '#7289da', display: 'block', marginBottom: '4px' }}>
                    USERNAME DISCORD:
                  </label>
                  <input
                    type="text"
                    className="input"
                    placeholder="Contoh: faust_store#0001"
                    value={profileForm.discord}
                    onChange={(e) => setProfileForm({ ...profileForm, discord: e.target.value })}
                  />
                </div>
              </div>

              {/* Announcement */}
              <div>
                <label className="mono" style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                  PENGUMUMAN TOKO:
                </label>
                <input
                  type="text"
                  className="input"
                  value={profileForm.announcement}
                  onChange={(e) => setProfileForm({ ...profileForm, announcement: e.target.value })}
                />
              </div>

              {/* Payment methods */}
              <div>
                <label className="mono" style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                  METODE PEMBAYARAN (PISAH DENGAN KOMA):
                </label>
                <input
                  type="text"
                  className="input"
                  value={profileForm.paymentMethods?.join(', ')}
                  onChange={(e) => setProfileForm({
                    ...profileForm,
                    paymentMethods: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                  })}
                />
              </div>

              {/* Store Open / Closed Status Selector */}
              <div>
                <label className="mono" style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                  STATUS OPERASIONAL TOKO:
                </label>
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                  <label style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 16px',
                    background: profileForm.isOpen !== false ? 'rgba(16, 185, 129, 0.15)' : 'var(--bg-primary)',
                    border: profileForm.isOpen !== false ? '1px solid #10b981' : '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-sm)',
                    cursor: 'pointer',
                    color: profileForm.isOpen !== false ? '#10b981' : 'var(--text-muted)',
                    fontWeight: 700,
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.82rem'
                  }}>
                    <input
                      type="radio"
                      name="storeStatus"
                      checked={profileForm.isOpen !== false}
                      onChange={() => setProfileForm({ ...profileForm, isOpen: true })}
                      style={{ accentColor: '#10b981' }}
                    />
                    <span>🟢 BUKA (Menerima Pesanan)</span>
                  </label>

                  <label style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 16px',
                    background: profileForm.isOpen === false ? 'rgba(255, 42, 68, 0.15)' : 'var(--bg-primary)',
                    border: profileForm.isOpen === false ? '1px solid #ff2a44' : '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-sm)',
                    cursor: 'pointer',
                    color: profileForm.isOpen === false ? '#ff475e' : 'var(--text-muted)',
                    fontWeight: 700,
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.82rem'
                  }}>
                    <input
                      type="radio"
                      name="storeStatus"
                      checked={profileForm.isOpen === false}
                      onChange={() => setProfileForm({ ...profileForm, isOpen: false })}
                      style={{ accentColor: '#ff2a44' }}
                    />
                    <span>🔴 TUTUP (Pemesanan Dinonaktifkan)</span>
                  </label>
                </div>
              </div>

              <button type="submit" className="btn btn-primary" style={{ marginTop: '6px' }}>
                <Save size={16} />
                <span>SIMPAN PENGATURAN TOKO</span>
              </button>
            </form>
          )}

          {/* TAB 6: BACKUP */}
          {activeTab === 'backup' && (
            <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <h3 className="serif-title" style={{ fontSize: '1.15rem', color: 'var(--text-main)' }}>
                BACKUP & RESTORE DATA
              </h3>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                gap: '14px'
              }}>
                <div style={{
                  background: 'var(--bg-primary)',
                  border: '1px solid var(--border-color)',
                  padding: '16px',
                  borderRadius: 'var(--radius-sm)'
                }}>
                  <h4 className="mono" style={{ color: 'var(--accent-primary)', marginBottom: '8px' }}>
                    💾 EXPORT DATABASE
                  </h4>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '12px' }}>
                    Unduh seluruh data barang, kategori, pesanan, dan profil toko sebagai file JSON.
                  </p>
                  <button
                    type="button"
                    onClick={exportDatabaseJSON}
                    className="btn btn-sm btn-primary"
                    style={{ width: '100%' }}
                  >
                    <Download size={14} />
                    <span>UNDUH FILE BACKUP (.JSON)</span>
                  </button>
                </div>

                <div style={{
                  background: 'var(--bg-primary)',
                  border: '1px solid var(--border-color)',
                  padding: '16px',
                  borderRadius: 'var(--radius-sm)'
                }}>
                  <h4 className="mono" style={{ color: '#10b981', marginBottom: '8px' }}>
                    📥 RESTORE DATABASE
                  </h4>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '12px' }}>
                    Upload file backup JSON untuk memulihkan seluruh data.
                  </p>
                  <label className="btn btn-sm" style={{ width: '100%', cursor: 'pointer', textAlign: 'center' }}>
                    <Upload size={14} />
                    <span>UPLOAD FILE JSON</span>
                    <input
                      type="file"
                      accept=".json"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (ev) => {
                            const res = importDatabaseJSON(ev.target.result);
                            if (res.success) {
                              setImportStatus("Import database berhasil!");
                              setTimeout(() => setImportStatus(null), 3000);
                            } else {
                              setImportStatus(`Gagal: ${res.error}`);
                            }
                          };
                          reader.readAsText(file);
                        }
                      }}
                      style={{ display: 'none' }}
                    />
                  </label>
                  {importStatus && (
                    <div style={{ fontSize: '0.74rem', color: '#10b981', marginTop: '6px' }}>
                      {importStatus}
                    </div>
                  )}
                </div>

                <div style={{
                  background: 'var(--bg-primary)',
                  border: '1px solid var(--border-color)',
                  padding: '16px',
                  borderRadius: 'var(--radius-sm)'
                }}>
                  <h4 className="mono" style={{ color: '#ff2a44', marginBottom: '8px' }}>
                    ⚠️ RESET KE DEFAULT
                  </h4>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '12px' }}>
                    Kembalikan toko ke pengaturan dan barang bawaan awal.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      if (window.confirm("Yakin ingin mereset seluruh database toko ke versi awal?")) {
                        resetToDefaults();
                      }
                    }}
                    className="btn btn-sm btn-danger"
                    style={{ width: '100%' }}
                  >
                    <RotateCcw size={14} />
                    <span>RESET KE DEFAULT</span>
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
