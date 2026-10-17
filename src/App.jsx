import React, { useState, useMemo } from 'react';
import { CatalogProvider, useCatalog } from './context/CatalogContext';
import { Header } from './components/Header';
import { Banner } from './components/Banner';
import { FilterBar } from './components/FilterBar';
import { ItemCard } from './components/ItemCard';
import { ItemModal } from './components/ItemModal';
import { CartModal } from './components/CartModal';
import { AdminModal } from './components/AdminModal';
import { Footer } from './components/Footer';
import { ShieldAlert, PackageX, Sparkles, Plus } from 'lucide-react';

function CatalogApp() {
  const { items, playSound } = useCatalog();

  // Filters
  const [selectedGame, setSelectedGame] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedThreat, setSelectedThreat] = useState('ALL');
  const [sortBy, setSortBy] = useState('featured');
  const [inStockOnly, setInStockOnly] = useState(false);

  // Modals
  const [inspectedItem, setInspectedItem] = useState(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [isCuratorMode, setIsCuratorMode] = useState(false);

  // Filtered and Sorted Items Memo
  const filteredItems = useMemo(() => {
    return items
      .filter((item) => {
        // Game filter
        if (selectedGame !== 'ALL' && item.game !== selectedGame) {
          return false;
        }

        // Threat filter
        if (selectedThreat !== 'ALL' && item.threat !== selectedThreat) {
          return false;
        }

        // Stock filter
        if (inStockOnly && item.stock <= 0) {
          return false;
        }

        // Search query
        if (searchQuery.trim() !== '') {
          const q = searchQuery.toLowerCase().trim();
          const matchName = item.name?.toLowerCase().includes(q);
          const matchDesc = item.description?.toLowerCase().includes(q);
          const matchGame = item.game?.toLowerCase().includes(q);
          const matchTag = item.tag?.toLowerCase().includes(q);
          const matchThreat = item.threat?.toLowerCase().includes(q);
          if (!matchName && !matchDesc && !matchGame && !matchTag && !matchThreat) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') {
          return a.price - b.price;
        }
        if (sortBy === 'price-desc') {
          return b.price - a.price;
        }
        if (sortBy === 'stock') {
          return b.stock - a.stock;
        }
        if (sortBy === 'name') {
          return a.name.localeCompare(b.name);
        }
        // Featured default
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        return 0;
      });
  }, [items, selectedGame, selectedThreat, inStockOnly, searchQuery, sortBy]);

  const handleEditItem = (item) => {
    setEditingItem(item);
    setIsAdminOpen(true);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* Top Header */}
      <Header
        onOpenCart={() => setIsCartOpen(true)}
        onOpenAdmin={() => {
          setIsCuratorMode((prev) => !prev);
          setIsAdminOpen(true);
        }}
        isCuratorMode={isCuratorMode}
        setIsCuratorMode={setIsCuratorMode}
      />

      {/* Atmospheric Broadcast Banner */}
      <Banner />

      {/* Filtering and Search Controls */}
      <FilterBar
        selectedGame={selectedGame}
        setSelectedGame={setSelectedGame}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedThreat={selectedThreat}
        setSelectedThreat={setSelectedThreat}
        sortBy={sortBy}
        setSortBy={setSortBy}
        inStockOnly={inStockOnly}
        setInStockOnly={setInStockOnly}
        filteredCount={filteredItems.length}
      />

      {/* Main Catalog Grid */}
      <main style={{
        maxWidth: '1350px',
        margin: '0 auto',
        padding: '10px 20px 40px 20px',
        flex: 1,
        width: '100%'
      }}>
        {filteredItems.length === 0 ? (
          <div style={{
            background: 'var(--bg-secondary)',
            border: '1px dashed var(--border-color)',
            padding: '60px 20px',
            textAlign: 'center',
            borderRadius: 'var(--radius-sm)',
            margin: '20px 0'
          }}>
            <PackageX size={54} color="var(--accent-primary)" style={{ opacity: 0.6, margin: '0 auto 16px auto' }} />
            <h3 className="serif-title" style={{ fontSize: '1.25rem', color: 'var(--text-main)', marginBottom: '8px' }}>
              TIDAK ADA ANOMALI ATAU ITEM DITEMUKAN
            </h3>
            <p className="mono" style={{ fontSize: '0.85rem', color: 'var(--text-muted)', maxWidth: '500px', margin: '0 auto 20px auto' }}>
              Tidak ada data yang cocok dengan kriteria pencarian atau filter yang kamu pilih.
            </p>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
              <button
                onClick={() => {
                  playSound('glitch');
                  setSelectedGame('ALL');
                  setSelectedThreat('ALL');
                  setSearchQuery('');
                  setInStockOnly(false);
                }}
                className="btn btn-sm btn-primary"
              >
                RESET SEMUA FILTER
              </button>

              <button
                onClick={() => {
                  setEditingItem(null);
                  setIsAdminOpen(true);
                }}
                className="btn btn-sm"
              >
                <Plus size={14} />
                <span>TAMBAH ITEM KE GAME INI</span>
              </button>
            </div>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '20px'
          }}>
            {filteredItems.map((item) => (
              <ItemCard
                key={item.id}
                item={item}
                onInspect={(it) => {
                  playSound('click');
                  setInspectedItem(it);
                }}
                onEdit={handleEditItem}
                isCuratorMode={isCuratorMode}
              />
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <Footer />

      {/* Item Detail Dossier Modal */}
      {inspectedItem && (
        <ItemModal
          item={inspectedItem}
          onClose={() => setInspectedItem(null)}
          onOpenCart={() => {
            setInspectedItem(null);
            setIsCartOpen(true);
          }}
        />
      )}

      {/* Cart & Checkout Manifest Modal */}
      {isCartOpen && (
        <CartModal onClose={() => setIsCartOpen(false)} />
      )}

      {/* Merchant / Curator Overseer Modal */}
      {isAdminOpen && (
        <AdminModal
          onClose={() => setIsAdminOpen(false)}
          editingItem={editingItem}
          setEditingItem={setEditingItem}
        />
      )}

    </div>
  );
}

export default function App() {
  return (
    <CatalogProvider>
      <CatalogApp />
    </CatalogProvider>
  );
}
