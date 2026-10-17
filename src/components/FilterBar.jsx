import React from 'react';
import { useCatalog } from '../context/CatalogContext';
import { THREAT_LEVELS } from '../data/defaultData';
import { Search, Filter, ArrowUpDown, X, Tag } from 'lucide-react';

export function FilterBar({
  selectedGame,
  setSelectedGame,
  searchQuery,
  setSearchQuery,
  selectedThreat,
  setSelectedThreat,
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

  const handleThreatSelect = (e) => {
    playSound('click');
    setSelectedThreat(e.target.value);
  };

  const handleSortSelect = (e) => {
    playSound('click');
    setSortBy(e.target.value);
  };

  const handleResetFilters = () => {
    playSound('glitch');
    setSelectedGame('ALL');
    setSearchQuery('');
    setSelectedThreat('ALL');
    setSortBy('featured');
    setInStockOnly(false);
  };

  const hasActiveFilters =
    selectedGame !== 'ALL' ||
    searchQuery.trim() !== '' ||
    selectedThreat !== 'ALL' ||
    inStockOnly ||
    sortBy !== 'featured';

  return (
    <div style={{
      maxWidth: '1350px',
      margin: '24px auto 16px auto',
      padding: '0 20px',
      display: 'flex',
      flexDirection: 'column',
      gap: '16px'
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
            color: selectedGame === 'ALL' ? '#000' : 'var(--text-main)',
            borderColor: selectedGame === 'ALL' ? 'var(--accent-primary)' : 'var(--border-color)',
            fontWeight: selectedGame === 'ALL' ? 700 : 500,
            whiteSpace: 'nowrap'
          }}
        >
          SEMUA GAME & ANOMALI
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
                color: isSelected ? '#000' : 'var(--text-main)',
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

      {/* Search and Dropdowns Bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        {/* Search Input */}
        <div style={{ position: 'relative', flex: '1 1 280px', minWidth: '240px' }}>
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
            placeholder="Cari nama item, tag, kode anomali, senjata..."
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

        {/* Dropdown Filters */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          
          {/* Threat / Hazard Select */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Filter size={15} color="var(--text-muted)" />
            <select
              className="select"
              value={selectedThreat}
              onChange={handleThreatSelect}
              style={{ width: 'auto', minWidth: '130px', padding: '7px 10px' }}
            >
              <option value="ALL">Semua Threat (Rarity)</option>
              {Object.keys(THREAT_LEVELS).map((lvl) => (
                <option key={lvl} value={lvl}>
                  {lvl} - {THREAT_LEVELS[lvl].name}
                </option>
              ))}
            </select>
          </div>

          {/* Sort By Select */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <ArrowUpDown size={15} color="var(--text-muted)" />
            <select
              className="select"
              value={sortBy}
              onChange={handleSortSelect}
              style={{ width: 'auto', minWidth: '150px', padding: '7px 10px' }}
            >
              <option value="featured">Featured / Rekomendasi</option>
              <option value="price-asc">Harga: Terendah</option>
              <option value="price-desc">Harga: Tertinggi</option>
              <option value="stock">Stok Terbanyak</option>
              <option value="name">Nama Item (A-Z)</option>
            </select>
          </div>

          {/* In-Stock Only Toggle */}
          <label style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '0.8rem',
            fontFamily: 'var(--font-mono)',
            cursor: 'pointer',
            userSelect: 'none',
            color: 'var(--text-main)',
            background: 'var(--bg-secondary)',
            padding: '7px 12px',
            border: '1px solid var(--border-color)',
            borderRadius: '2px'
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
            <span>HANYA YANG READY</span>
          </label>

          {/* Reset Filters button if any active */}
          {hasActiveFilters && (
            <button
              onClick={handleResetFilters}
              className="btn btn-sm btn-danger"
              title="Reset semua filter"
            >
              <X size={13} />
              <span>RESET</span>
            </button>
          )}

        </div>
      </div>

      {/* Result Status Indicator */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontSize: '0.78rem',
        color: 'var(--text-muted)',
        fontFamily: 'var(--font-mono)',
        borderTop: '1px dashed var(--border-color)',
        paddingTop: '8px'
      }}>
        <span>
          TERDETEKSI: <strong style={{ color: 'var(--accent-primary)' }}>{filteredCount} ITEM</strong>
          {selectedGame !== 'ALL' && ` DALAM KATEGORI [${selectedGame}]`}
        </span>
        <span>KLASIFIKASI ANOMALI SIAP KIRIM // INSTANT DISPATCH</span>
      </div>
    </div>
  );
}
