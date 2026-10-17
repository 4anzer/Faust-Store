import React, { useState, useEffect } from 'react';
import { useCatalog } from '../context/CatalogContext';
import { THREAT_LEVELS } from '../data/defaultData';
import { 
  X, 
  Plus, 
  Trash2, 
  Edit3, 
  Upload, 
  Download, 
  RotateCcw, 
  Save, 
  Gamepad2, 
  Settings, 
  Layers, 
  Database,
  CheckCircle,
  HelpCircle,
  Sparkles
} from 'lucide-react';

export function AdminModal({ onClose, editingItem, setEditingItem }) {
  const { 
    items, 
    games, 
    merchantProfile, 
    addItem, 
    updateItem, 
    deleteItem, 
    addCategory, 
    deleteCategory, 
    updateMerchantProfile, 
    resetToDefaults, 
    exportDatabaseJSON, 
    importDatabaseJSON, 
    playSound 
  } = useCatalog();

  const [activeTab, setActiveTab] = useState(editingItem ? 'item-form' : 'items-list');

  // New or Edited Item State
  const initialFormState = {
    name: '',
    game: games[0] || 'Limbus Company',
    threat: 'HE',
    price: 50000,
    currency: 'Rp',
    stock: 1,
    tag: 'E.G.O / Weapon',
    image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80',
    description: '',
    deliveryMethod: 'Pengiriman instan via chat langsung.',
    featured: false,
    properties: [
      { label: 'Tipe', value: 'Tradeable' },
      { label: 'Garansi', value: '30 Hari Full' }
    ]
  };

  const [formData, setFormData] = useState(initialFormState);
  const [newGameInput, setNewGameInput] = useState('');
  const [profileForm, setProfileForm] = useState({ ...merchantProfile });
  const [importStatus, setImportStatus] = useState(null);
  const [newPropKey, setNewPropKey] = useState('');
  const [newPropVal, setNewPropVal] = useState('');

  // Sync edit item if provided
  useEffect(() => {
    if (editingItem) {
      setFormData({
        ...initialFormState,
        ...editingItem,
        properties: editingItem.properties || []
      });
      setActiveTab('item-form');
    }
  }, [editingItem]);

  const handleImageFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("Ukuran gambar maksimal 2MB!");
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
      alert("Nama item harus diisi!");
      return;
    }

    if (editingItem && editingItem.id) {
      updateItem(editingItem.id, formData);
      alert(`Item "${formData.name}" berhasil diperbarui!`);
    } else {
      addItem(formData);
      alert(`Item baru "${formData.name}" berhasil ditambahkan ke kategori ${formData.game}!`);
    }

    setFormData(initialFormState);
    setEditingItem(null);
    setActiveTab('items-list');
  };

  const handleAddProperty = () => {
    if (!newPropKey.trim() || !newPropVal.trim()) return;
    setFormData((prev) => ({
      ...prev,
      properties: [...(prev.properties || []), { label: newPropKey.trim(), value: newPropVal.trim() }]
    }));
    setNewPropKey('');
    setNewPropVal('');
  };

  const handleRemoveProperty = (index) => {
    setFormData((prev) => ({
      ...prev,
      properties: prev.properties.filter((_, i) => i !== index)
    }));
  };

  const handleAddGameCategory = (e) => {
    e.preventDefault();
    if (!newGameInput.trim()) return;
    addCategory(newGameInput.trim());
    setNewGameInput('');
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    updateMerchantProfile(profileForm);
    alert("Profil toko & kontak berhasil diperbarui!");
  };

  const handleImportFile = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const res = importDatabaseJSON(event.target.result);
        if (res.success) {
          setImportStatus("Import database berhasil dipulihkan!");
          setTimeout(() => setImportStatus(null), 3000);
        } else {
          setImportStatus(`Gagal import: ${res.error}`);
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '950px' }}
      >
        {/* Modal Header */}
        <div style={{
          padding: '14px 20px',
          background: 'var(--bg-tertiary)',
          borderBottom: '1px solid var(--border-color)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Settings size={18} color="var(--accent-secondary)" />
            <span className="serif-title" style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-main)' }}>
              OVERSEER CONSOLE // KELOLA INVENTARIS TOKO
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

        {/* Navigation Tabs */}
        <div style={{
          display: 'flex',
          borderBottom: '1px solid var(--border-color)',
          background: 'var(--bg-secondary)',
          overflowX: 'auto'
        }}>
          <button
            onClick={() => { playSound('click'); setActiveTab('items-list'); }}
            style={{
              padding: '12px 18px',
              background: activeTab === 'items-list' ? 'var(--bg-card)' : 'transparent',
              border: 'none',
              borderBottom: activeTab === 'items-list' ? '2px solid var(--accent-primary)' : '2px solid transparent',
              color: activeTab === 'items-list' ? 'var(--accent-primary)' : 'var(--text-muted)',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.82rem',
              fontWeight: 700,
              cursor: 'pointer',
              whiteSpace: 'nowrap'
            }}
          >
            📋 DAFTAR ITEM ({items.length})
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
              padding: '12px 18px',
              background: activeTab === 'item-form' ? 'var(--bg-card)' : 'transparent',
              border: 'none',
              borderBottom: activeTab === 'item-form' ? '2px solid var(--accent-primary)' : '2px solid transparent',
              color: activeTab === 'item-form' ? 'var(--accent-primary)' : 'var(--text-muted)',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.82rem',
              fontWeight: 700,
              cursor: 'pointer',
              whiteSpace: 'nowrap'
            }}
          >
            ➕ {editingItem ? 'EDIT ITEM' : 'TAMBAH ITEM BARU'}
          </button>

          <button
            onClick={() => { playSound('click'); setActiveTab('categories'); }}
            style={{
              padding: '12px 18px',
              background: activeTab === 'categories' ? 'var(--bg-card)' : 'transparent',
              border: 'none',
              borderBottom: activeTab === 'categories' ? '2px solid var(--accent-primary)' : '2px solid transparent',
              color: activeTab === 'categories' ? 'var(--accent-primary)' : 'var(--text-muted)',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.82rem',
              fontWeight: 700,
              cursor: 'pointer',
              whiteSpace: 'nowrap'
            }}
          >
            🎮 KELOLA GAME ({games.length})
          </button>

          <button
            onClick={() => { playSound('click'); setActiveTab('profile'); }}
            style={{
              padding: '12px 18px',
              background: activeTab === 'profile' ? 'var(--bg-card)' : 'transparent',
              border: 'none',
              borderBottom: activeTab === 'profile' ? '2px solid var(--accent-primary)' : '2px solid transparent',
              color: activeTab === 'profile' ? 'var(--accent-primary)' : 'var(--text-muted)',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.82rem',
              fontWeight: 700,
              cursor: 'pointer',
              whiteSpace: 'nowrap'
            }}
          >
            ⚙️ PENGATURAN TOKO & WA
          </button>

          <button
            onClick={() => { playSound('click'); setActiveTab('backup'); }}
            style={{
              padding: '12px 18px',
              background: activeTab === 'backup' ? 'var(--bg-card)' : 'transparent',
              border: 'none',
              borderBottom: activeTab === 'backup' ? '2px solid var(--accent-primary)' : '2px solid transparent',
              color: activeTab === 'backup' ? 'var(--accent-primary)' : 'var(--text-muted)',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.82rem',
              fontWeight: 700,
              cursor: 'pointer',
              whiteSpace: 'nowrap'
            }}
          >
            💾 BACKUP & VERCEL
          </button>
        </div>

        {/* Tab 1: ITEMS LIST */}
        {activeTab === 'items-list' && (
          <div style={{ padding: '20px' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '16px',
              flexWrap: 'wrap',
              gap: '10px'
            }}>
              <div>
                <h3 className="serif-title" style={{ fontSize: '1.1rem', color: 'var(--text-main)' }}>
                  DAFTAR SELURUH ITEM INVENTARIS
                </h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Klik Edit untuk mengubah harga/stok, atau Tambah Item Baru untuk memasukkan item game lain.
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
                <span>TAMBAH ITEM BARU</span>
              </button>
            </div>

            <div style={{
              maxHeight: '420px',
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
                    padding: '10px 14px',
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
                        borderRadius: '2px',
                        border: '1px solid var(--border-color)'
                      }}
                    />
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-main)' }}>
                        {it.name}
                      </div>
                      <div className="mono" style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                        {it.game} | Threat: <strong style={{ color: THREAT_LEVELS[it.threat]?.color || '#fff' }}>{it.threat}</strong> | Stok: {it.stock}
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
                    {it.currency} {typeof it.price === 'number' ? it.price.toLocaleString('id-ID') : it.price}
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
                      style={{ padding: '4px 10px' }}
                    >
                      <Edit3 size={13} />
                      <span>EDIT</span>
                    </button>

                    <button
                      onClick={() => {
                        if (window.confirm(`Hapus item: "${it.name}"?`)) {
                          deleteItem(it.id);
                        }
                      }}
                      className="btn btn-sm btn-danger"
                      style={{ padding: '4px 8px' }}
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 2: ITEM FORM (ADD / EDIT) */}
        {activeTab === 'item-form' && (
          <form onSubmit={handleSaveItem} style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderBottom: '1px solid var(--border-color)',
              paddingBottom: '10px'
            }}>
              <h3 className="serif-title" style={{ fontSize: '1.1rem', color: 'var(--text-main)' }}>
                {editingItem ? `EDIT ITEM: ${editingItem.name}` : 'TAMBAH ITEM INVENTARIS BARU'}
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
                  Batal Edit / Tambah Baru
                </button>
              )}
            </div>

            {/* Row 1: Name and Category */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '12px' }}>
              <div>
                <label className="mono" style={{ fontSize: '0.74rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                  NAMA ITEM / ANOMALI *:
                </label>
                <input
                  type="text"
                  required
                  className="input"
                  placeholder="Contoh: The Red Mist Key Page / Primogems 5000 / Roblox Robux"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div>
                <label className="mono" style={{ fontSize: '0.74rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
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

            {/* Row 2: Threat Level, Price, Currency, Stock */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '12px' }}>
              <div>
                <label className="mono" style={{ fontSize: '0.74rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                  THREAT LEVEL / RARITY:
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
                <label className="mono" style={{ fontSize: '0.74rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                  HARGA / VALUE *:
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
                <label className="mono" style={{ fontSize: '0.74rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                  MATA UANG:
                </label>
                <input
                  type="text"
                  className="input"
                  placeholder="Rp / Lunacy / $"
                  value={formData.currency}
                  onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                />
              </div>

              <div>
                <label className="mono" style={{ fontSize: '0.74rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                  STOK UNIT:
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
                <label className="mono" style={{ fontSize: '0.74rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                  TAG / TIPE:
                </label>
                <input
                  type="text"
                  className="input"
                  placeholder="E.G.O, Akun, Jasa, Skin"
                  value={formData.tag}
                  onChange={(e) => setFormData({ ...formData, tag: e.target.value })}
                />
              </div>
            </div>

            {/* Row 3: Image URL or File Upload */}
            <div>
              <label className="mono" style={{ fontSize: '0.74rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                GAMBAR ITEM (URL ATAU UPLOAD LANGSUNG DARI PERANGKAT):
              </label>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <input
                  type="text"
                  className="input"
                  placeholder="https://... atau paste link gambar"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                />
                <label className="btn btn-sm" style={{ cursor: 'pointer', whiteSpace: 'nowrap' }}>
                  <Upload size={14} />
                  <span>UPLOAD FILE</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageFileUpload}
                    style={{ display: 'none' }}
                  />
                </label>
              </div>

              {formData.image && (
                <div style={{ marginTop: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <img
                    src={formData.image}
                    alt="Preview"
                    style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '2px', border: '1px solid var(--border-color)' }}
                  />
                  <span className="mono" style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                    Preview Gambar Siap Tampil
                  </span>
                </div>
              )}
            </div>

            {/* Row 4: Description */}
            <div>
              <label className="mono" style={{ fontSize: '0.74rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                DESKRIPSI / LORE / KETERANGAN ITEM:
              </label>
              <textarea
                className="textarea"
                rows="3"
                placeholder="Jelaskan spesifikasi item, kelebihan, efek pertarungan, atau detail akun..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            {/* Row 5: Delivery Method */}
            <div>
              <label className="mono" style={{ fontSize: '0.74rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                CARA PENGIRIMAN KE PEMBELI:
              </label>
              <input
                type="text"
                className="input"
                placeholder="Contoh: Login via UID tanpa password / Trade in-game Steam / Data akun via chat"
                value={formData.deliveryMethod}
                onChange={(e) => setFormData({ ...formData, deliveryMethod: e.target.value })}
              />
            </div>

            {/* Row 6: Custom Properties Key-Value Pairs */}
            <div style={{
              background: 'var(--bg-primary)',
              border: '1px solid var(--border-color)',
              padding: '12px',
              borderRadius: 'var(--radius-sm)'
            }}>
              <label className="mono" style={{ fontSize: '0.74rem', color: 'var(--accent-secondary)', display: 'block', marginBottom: '6px' }}>
                // SPESIFIKASI TAMBAHAN (METADATA):
              </label>
              
              <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                <input
                  type="text"
                  className="input"
                  placeholder="Label (contoh: Faction)"
                  value={newPropKey}
                  onChange={(e) => setNewPropKey(e.target.value)}
                  style={{ flex: 1 }}
                />
                <input
                  type="text"
                  className="input"
                  placeholder="Nilai (contoh: N Corp. / Level 5)"
                  value={newPropVal}
                  onChange={(e) => setNewPropVal(e.target.value)}
                  style={{ flex: 1 }}
                />
                <button
                  type="button"
                  onClick={handleAddProperty}
                  className="btn btn-sm"
                >
                  <Plus size={14} />
                  <span>TAMBAH</span>
                </button>
              </div>

              {formData.properties && formData.properties.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {formData.properties.map((p, idx) => (
                    <span
                      key={idx}
                      style={{
                        background: 'var(--bg-tertiary)',
                        border: '1px solid var(--border-color)',
                        padding: '3px 8px',
                        fontSize: '0.72rem',
                        borderRadius: '2px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                    >
                      <strong style={{ color: 'var(--accent-primary)' }}>{p.label}:</strong> {p.value}
                      <button
                        type="button"
                        onClick={() => handleRemoveProperty(idx)}
                        style={{ background: 'transparent', border: 'none', color: '#ff2a44', cursor: 'pointer' }}
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Featured toggle */}
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={formData.featured}
                onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                style={{ accentColor: 'var(--accent-primary)' }}
              />
              <span className="mono" style={{ fontSize: '0.8rem' }}>
                Tandai sebagai Item Unggulan (Featured Highlight)
              </span>
            </label>

            {/* Save Buttons */}
            <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
              <button
                type="submit"
                className="btn btn-primary"
                style={{ padding: '10px 24px', flex: 1 }}
              >
                <Save size={16} />
                <span>{editingItem ? 'SIMPAN PERUBAHAN ITEM' : 'SIMPAN ITEM KE INVENTARIS'}</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('items-list')}
                className="btn"
              >
                KEMBALI KE DAFTAR
              </button>
            </div>
          </form>
        )}

        {/* Tab 3: CATEGORIES / GAMES MANAGER */}
        {activeTab === 'categories' && (
          <div style={{ padding: '20px' }}>
            <h3 className="serif-title" style={{ fontSize: '1.1rem', color: 'var(--text-main)', marginBottom: '8px' }}>
              KELOLA KATEGORI GAME YANG DIMAINKAN
            </h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
              Kamu bisa menambahkan game baru apa saja (misal: Valorant, Genshin Impact, Roblox, Steam, dll).
            </p>

            {/* Add New Game Form */}
            <form onSubmit={handleAddGameCategory} style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
              <input
                type="text"
                className="input"
                placeholder="Ketik nama game baru (contoh: Roblox / CS2 / Blue Archive)..."
                value={newGameInput}
                onChange={(e) => setNewGameInput(e.target.value)}
                style={{ flex: 1 }}
              />
              <button type="submit" className="btn btn-primary">
                <Plus size={16} />
                <span>TAMBAH GAME</span>
              </button>
            </form>

            {/* Game List */}
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
                      padding: '12px',
                      borderRadius: 'var(--radius-sm)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-main)' }}>
                        {g}
                      </div>
                      <div className="mono" style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                        {count} item terdaftar
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        if (count > 0) {
                          if (!window.confirm(`Ada ${count} item dalam kategori "${g}". Tetap ingin menghapus kategori ini?`)) {
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

        {/* Tab 4: STORE PROFILE & CONTACT SETTINGS */}
        {activeTab === 'profile' && (
          <form onSubmit={handleSaveProfile} style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <h3 className="serif-title" style={{ fontSize: '1.1rem', color: 'var(--text-main)' }}>
              PENGATURAN INFORMASI TOKO & KONTAK PENJUAL
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label className="mono" style={{ fontSize: '0.74rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                  NAMA TOKO / MERCHANT:
                </label>
                <input
                  type="text"
                  className="input"
                  value={profileForm.shopName}
                  onChange={(e) => setProfileForm({ ...profileForm, shopName: e.target.value })}
                />
              </div>

              <div>
                <label className="mono" style={{ fontSize: '0.74rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                  SUBTITLE / SLOGAN:
                </label>
                <input
                  type="text"
                  className="input"
                  value={profileForm.subtitle}
                  onChange={(e) => setProfileForm({ ...profileForm, subtitle: e.target.value })}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label className="mono" style={{ fontSize: '0.74rem', color: '#25d366', display: 'block', marginBottom: '4px' }}>
                  NOMOR WHATSAPP (UNTUK MENERIMA ORDER):
                </label>
                <input
                  type="text"
                  className="input"
                  placeholder="Contoh: 6281234567890 (Gunakan kode 62)"
                  value={profileForm.whatsapp}
                  onChange={(e) => setProfileForm({ ...profileForm, whatsapp: e.target.value })}
                />
              </div>

              <div>
                <label className="mono" style={{ fontSize: '0.74rem', color: '#7289da', display: 'block', marginBottom: '4px' }}>
                  USERNAME DISCORD / SERVER:
                </label>
                <input
                  type="text"
                  className="input"
                  placeholder="Contoh: username#0001"
                  value={profileForm.discord}
                  onChange={(e) => setProfileForm({ ...profileForm, discord: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="mono" style={{ fontSize: '0.74rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                PESAN PENGUMUMAN OVERSEER / TICKER TOKO:
              </label>
              <input
                type="text"
                className="input"
                placeholder="Pemberitahuan darurat / jam online / jaminan..."
                value={profileForm.announcement}
                onChange={(e) => setProfileForm({ ...profileForm, announcement: e.target.value })}
              />
            </div>

            <div>
              <label className="mono" style={{ fontSize: '0.74rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                METODE PEMBAYARAN YANG DITERIMA (PISAH DENGAN KOMA):
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

            <button type="submit" className="btn btn-primary" style={{ marginTop: '10px' }}>
              <Save size={16} />
              <span>SIMPAN PENGATURAN TOKO</span>
            </button>
          </form>
        )}

        {/* Tab 5: BACKUP & VERCEL HOSTING */}
        {activeTab === 'backup' && (
          <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h3 className="serif-title" style={{ fontSize: '1.1rem', color: 'var(--text-main)' }}>
              MANAJEMEN DATA & PANDUAN HOSTING DI VERCEL
            </h3>

            {/* Quick Export / Import Buttons */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '12px'
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
                  Unduh seluruh item dan pengaturan toko kamu sebagai file JSON untuk backup.
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
                  📥 RESTORE / IMPORT DATABASE
                </h4>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '12px' }}>
                  Pulihkan inventaris dari file backup JSON yang pernah diunduh.
                </p>
                <label className="btn btn-sm" style={{ width: '100%', cursor: 'pointer', textAlign: 'center' }}>
                  <Upload size={14} />
                  <span>UPLOAD FILE JSON</span>
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleImportFile}
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
                  ⚠️ RESET DEFAULT
                </h4>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '12px' }}>
                  Kembalikan toko ke data awal (Limbus Company, Ruina, Lobotomy, SCP).
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
                  <span>RESET KE FACTORY DEFAULT</span>
                </button>
              </div>
            </div>

            {/* Vercel Hosting Tutorial Card */}
            <div style={{
              background: 'var(--bg-tertiary)',
              borderLeft: '4px solid var(--accent-secondary)',
              borderTop: '1px solid var(--border-color)',
              borderRight: '1px solid var(--border-color)',
              borderBottom: '1px solid var(--border-color)',
              padding: '16px',
              borderRadius: '0 4px 4px 0'
            }}>
              <h4 className="serif-title" style={{ color: 'var(--accent-secondary)', marginBottom: '8px' }}>
                🚀 CARA DEPLOY KE VERCEL (GRATIS & KILAT)
              </h4>
              <ol style={{ fontSize: '0.84rem', color: 'var(--text-main)', paddingLeft: '20px', lineHeight: '1.7' }}>
                <li>
                  Push folder proyek ini ke <strong>GitHub</strong> kamu (bisa via GitHub Desktop atau git push).
                </li>
                <li>
                  Buka website <a href="https://vercel.com" target="_blank" rel="noreferrer" style={{ color: 'var(--accent-primary)' }}>vercel.com</a> dan login dengan akun GitHub kamu.
                </li>
                <li>
                  Klik tombol <strong>"Add New Project"</strong>, lalu pilih repository GitHub toko ini.
                </li>
                <li>
                  Framework Preset akan otomatis terdeteksi sebagai <strong>Vite</strong>. Cukup klik tombol <strong>"Deploy"</strong>!
                </li>
                <li>
                  Dalam 1 menit, website toko kamu sudah live dengan domain gratis seperti <code>nama-toko.vercel.app</code> dan siap dibagikan ke calon pembeli!
                </li>
              </ol>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
