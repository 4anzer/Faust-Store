import React from 'react';
import { useCatalog } from '../context/CatalogContext';
import { Search, ArrowUpDown, X } from 'lucide-react';

export function FilterBar({
  selectedGame,
  setSelectedGame,
  searchQuery,
  setSearchQuery,
  sortBy,
  setSortBy,
  inStockOnly,
  setInStockOnly,
  filteredCount
}) {
  const { games, playSound } = useCatalog();

  const handleGameSelect = (g) => {
    playSound('click');
    setSelectedGame(g);
  };

  const handleResetFilters = () => {
    playSound('glitch');
    setSelectedGame('ALL');
    setSearchQuery('');
    setSortBy('featured');
    setInStockOnly(false);
  };

  const hasActiveFilters =
    selectedGame !== 'ALL' ||
    searchQuery.trim() !== '' ||
    inStockOnly ||
    sortBy !== 'featured';

  return (
    <div style={{
      maxWidth: '1350px',
      margin: '20px auto 14px auto',
      padding: '0 20px',
      display: 'flex',
      flexDirection: 'column',
      gap: '14px'
    }}>
      {/* Category Pills / Game Tabs */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        overflowX: 'auto',
        paddingBottom: '8px',
        borderBottom: '1px solid var(--border-color)'
      }}>
        <button
          onClick={() => handleGameSelect('ALL')}
          className="btn btn-sm"
          style={{
            background: selectedGame === 'ALL' ? 'var(--accent-primary)' : 'var(--bg-secondary)',
            color: selectedGame === 'ALL' ? '#fff' : 'var(--text-main)',
            borderColor: selectedGame === 'ALL' ? 'var(--accent-primary)' : 'var(--border-color)',
            fontWeight: selectedGame === 'ALL' ? 700 : 500,
            whiteSpace: 'nowrap'
          }}
        >
          🎮 SEMUA GAME ({filteredCount})
        </button>

        {games.map((g) => {
          const isSelected = selectedGame === g;
          return (
            <button
              key={g}
              onClick={() => handleGameSelect(g)}
              className="btn btn-sm"
              style={{
                background: isSelected ? 'var(--accent-primary)' : 'var(--bg-secondary)',
                color: isSelected ? '#fff' : 'var(--text-main)',
                borderColor: isSelected ? 'var(--accent-primary)' : 'var(--border-color)',
                fontWeight: isSelected ? 700 : 500,
                whiteSpace: 'nowrap'
              }}
            >
              {g}
            </button>
          );
        })}
      </div>

      {/* Search and Sorting */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        {/* Search Box */}
        <div style={{ position: 'relative', flex: '1 1 300px', minWidth: '240px' }}>
          <Search size={16} color="var(--text-muted)" style={{
            position: 'absolute',
            left: '12px',
            top: '50%',
            transform: 'translateY(-50%)'
          }} />
          <input
            type="text"
            className="input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari nama item, senjata, akun, atau layanan..."
            style={{ paddingLeft: '36px' }}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              style={{
                position: 'absolute',
                right: '10px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'transparent',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer'
              }}
            >
              <X size={15} />
            </button>
          )}
        </div>

        {/* Sorting and Ready Stock */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <ArrowUpDown size={15} color="var(--text-muted)" />
            <select
              className="select"
              value={sortBy}
              onChange={(e) => {
                playSound('click');
                setSortBy(e.target.value);
              }}
              style={{ width: 'auto', minWidth: '160px', padding: '8px 12px' }}
            >
              <option value="featured">Rekomendasi / Populer</option>
              <option value="price-asc">Harga: Termurah</option>
              <option value="price-desc">Harga: Tertinggi</option>
              <option value="stock">Stok Terbanyak</option>
              <option value="name">Nama Item (A-Z)</option>
            </select>
          </div>

          <label style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '0.82rem',
            fontFamily: 'var(--font-mono)',
            cursor: 'pointer',
            userSelect: 'none',
            color: 'var(--text-main)',
            background: 'var(--bg-secondary)',
            padding: '8px 12px',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-sm)'
          }}>
            <input
              type="checkbox"
              checked={inStockOnly}
              onChange={(e) => {
                playSound('click');
                setInStockOnly(e.target.checked);
              }}
              style={{ accentColor: 'var(--accent-primary)', cursor: 'pointer' }}
            />
            <span>HANYA STOK READY</span>
          </label>

          {hasActiveFilters && (
            <button
              onClick={handleResetFilters}
              className="btn btn-sm btn-danger"
              title="Reset pencarian"
            >
              <X size={13} />
              <span>RESET</span>
            </button>
          )}

        </div>
      </div>
    </div>
  );
}
