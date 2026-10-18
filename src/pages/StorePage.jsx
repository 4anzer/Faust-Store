import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useCatalog } from '../context/CatalogContext';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { Header } from '../components/Header';
import { Banner } from '../components/Banner';
import { FilterBar } from '../components/FilterBar';
import { ItemCard } from '../components/ItemCard';
import { ItemModal } from '../components/ItemModal';
import { CartModal } from '../components/CartModal';
import { Footer } from '../components/Footer';
import { ProeliumLoadingScreen } from '../components/ProeliumLoadingScreen';
import { FloatingEmbers } from '../components/FloatingEmbers';
import { PackageX, Plus } from 'lucide-react';

export function StorePage() {
  const { items, playSound } = useCatalog();
  const { isAuthenticated } = useAuth();
  const { t } = useLanguage();

  // Proelium Fatale Loading Screen Intro State (plays when visitor enters the store)
  const [showIntro, setShowIntro] = useState(() => {
    try {
      const seen = sessionStorage.getItem('faust_proelium_seen');
      return !seen;
    } catch {
      return true;
    }
  });

  const handleFinishIntro = () => {
    try {
      sessionStorage.setItem('faust_proelium_seen', 'true');
    } catch {
      // ignore
    }
    setShowIntro(false);
  };

  // Filters
  const [selectedGame, setSelectedGame] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('featured');
  const [inStockOnly, setInStockOnly] = useState(false);

  // Modals
  const [inspectedItem, setInspectedItem] = useState(null);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Filtered and Sorted Items
  const filteredItems = useMemo(() => {
    return items
      .filter((item) => {
        // Game filter
        if (selectedGame !== 'ALL' && item.game !== selectedGame) {
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
          if (!matchName && !matchDesc && !matchGame && !matchTag) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        if (sortBy === 'stock') return b.stock - a.stock;
        if (sortBy === 'name') return a.name.localeCompare(b.name);
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        return 0;
      });
  }, [items, selectedGame, inStockOnly, searchQuery, sortBy]);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', position: 'relative' }}>
      
      {/* Ambient Floating Anomaly Embers Background Effect */}
      <FloatingEmbers />

      {/* Proelium Fatale Loading Screen Intro */}
      {showIntro && (
        <ProeliumLoadingScreen onFinish={handleFinishIntro} />
      )}

      {/* Header */}
      <Header
        onOpenCart={() => setIsCartOpen(true)}
      />

      {/* Broadcast Banner */}
      <Banner />

      {/* Filter and Search Bar */}
      <FilterBar
        selectedGame={selectedGame}
        setSelectedGame={setSelectedGame}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
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
        width: '100%',
        position: 'relative',
        zIndex: 1
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
            <PackageX size={52} color="var(--accent-primary)" style={{ opacity: 0.6, margin: '0 auto 16px auto' }} />
            <h3 className="serif-title" style={{ fontSize: '1.25rem', color: 'var(--text-main)', marginBottom: '8px' }}>
              {t('noItemsTitle')}
            </h3>
            <p className="mono" style={{ fontSize: '0.85rem', color: 'var(--text-muted)', maxWidth: '480px', margin: '0 auto 20px auto' }}>
              {t('noItemsDesc')}
            </p>
            <button
              onClick={() => {
                playSound('glitch');
                setSelectedGame('ALL');
                setSearchQuery('');
                setInStockOnly(false);
              }}
              className="btn btn-sm btn-primary"
            >
              {t('resetFilterBtn')}
            </button>
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
              />
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <Footer />

      {/* Product Detail Modal */}
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

      {/* Cart Modal */}
      {isCartOpen && (
        <CartModal onClose={() => setIsCartOpen(false)} />
      )}

    </div>
  );
}
