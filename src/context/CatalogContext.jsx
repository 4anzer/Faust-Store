import React, { createContext, useContext, useState, useEffect } from 'react';
import { DEFAULT_ITEMS, DEFAULT_GAMES, DEFAULT_MERCHANT_PROFILE } from '../data/defaultData';
import { soundEffects } from '../utils/soundEffects';

const CatalogContext = createContext(null);

const STORAGE_KEYS = {
  ITEMS: 'pm_scp_catalog_items_v2',
  GAMES: 'pm_scp_catalog_games_v2',
  PROFILE: 'pm_scp_catalog_profile_v2',
  CART: 'pm_scp_catalog_cart_v2',
  THEME: 'pm_scp_catalog_theme_v2',
  SOUND: 'pm_scp_catalog_sound_v2'
};

export function CatalogProvider({ children }) {
  // Items State
  const [items, setItems] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ITEMS);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return DEFAULT_ITEMS;
  });

  // Games/Categories State
  const [games, setGames] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.GAMES);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return DEFAULT_GAMES;
  });

  // Merchant Profile State
  const [merchantProfile, setMerchantProfile] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PROFILE);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return DEFAULT_MERCHANT_PROFILE;
  });

  // Cart State
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CART);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return [];
  });

  // Theme State ("limbus", "lobotomy", "ruina", "scp")
  const [theme, setTheme] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.THEME);
      if (saved) return saved;
    } catch {
      // ignore
    }
    return merchantProfile.activeTheme || 'limbus';
  });

  // Sound effects toggle
  const [soundEnabled, setSoundEnabled] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SOUND);
      if (saved !== null) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return true;
  });

  // Sync to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ITEMS, JSON.stringify(items));
    } catch (e) {
      console.warn("Storage quota exceeded or error", e);
    }
  }, [items]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.GAMES, JSON.stringify(games));
    } catch (e) {
      console.warn("Storage error", e);
    }
  }, [games]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(merchantProfile));
    } catch (e) {
      console.warn("Storage error", e);
    }
  }, [merchantProfile]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
    } catch (e) {
      console.warn("Storage error", e);
    }
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.THEME, theme);
      document.documentElement.setAttribute('data-theme', theme);
    } catch (e) {
      console.warn("Storage error", e);
    }
  }, [theme]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.SOUND, JSON.stringify(soundEnabled));
      soundEffects.enabled = soundEnabled;
    } catch (e) {
      console.warn("Storage error", e);
    }
  }, [soundEnabled]);

  // Audio helper
  const playSound = (type = 'click') => {
    if (!soundEnabled) return;
    if (type === 'click') soundEffects.playClick();
    if (type === 'beep') soundEffects.playBeep();
    if (type === 'hazard') soundEffects.playHazard();
    if (type === 'equip') soundEffects.playEquip();
    if (type === 'glitch') soundEffects.playGlitch();
  };

  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    soundEffects.enabled = next;
    if (next) soundEffects.playBeep();
  };

  // Switch Theme
  const changeTheme = (newTheme) => {
    playSound('hazard');
    setTheme(newTheme);
  };

  // Item Management (CRUD)
  const addItem = (itemData) => {
    const newItem = {
      ...itemData,
      id: `item-custom-${Date.now()}`
    };
    setItems((prev) => [newItem, ...prev]);
    playSound('equip');
    return newItem;
  };

  const updateItem = (id, updatedFields) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updatedFields } : item))
    );
    playSound('beep');
  };

  const deleteItem = (id) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
    setCart((prev) => prev.filter((c) => c.id !== id));
    playSound('glitch');
  };

  // Game/Category Management
  const addCategory = (categoryName) => {
    const trimmed = categoryName.trim();
    if (!trimmed || games.includes(trimmed)) return;
    setGames((prev) => [...prev, trimmed]);
    playSound('beep');
  };

  const deleteCategory = (categoryName) => {
    setGames((prev) => prev.filter((g) => g !== categoryName));
    playSound('glitch');
  };

  // Merchant Profile update
  const updateMerchantProfile = (newProfile) => {
    setMerchantProfile((prev) => ({ ...prev, ...newProfile }));
    playSound('beep');
  };

  // Cart Management
  const addToCart = (item) => {
    playSound('equip');
    setCart((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (id) => {
    playSound('glitch');
    setCart((prev) => prev.filter((i) => i.id !== id));
  };

  const updateCartQuantity = (id, delta) => {
    playSound('click');
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean)
    );
  };

  const clearCart = () => {
    playSound('glitch');
    setCart([]);
  };

  // Reset to factory defaults
  const resetToDefaults = () => {
    setItems(DEFAULT_ITEMS);
    setGames(DEFAULT_GAMES);
    setMerchantProfile(DEFAULT_MERCHANT_PROFILE);
    setCart([]);
    setTheme('limbus');
    playSound('hazard');
  };

  // Export database as JSON
  const exportDatabaseJSON = () => {
    const data = {
      items,
      games,
      merchantProfile,
      exportedAt: new Date().toISOString(),
      formatVersion: "2.0"
    };
    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `inventory_manifest_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    playSound('beep');
  };

  // Import database from JSON
  const importDatabaseJSON = (jsonString) => {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed.items && Array.isArray(parsed.items)) {
        setItems(parsed.items);
      }
      if (parsed.games && Array.isArray(parsed.games)) {
        setGames(parsed.games);
      }
      if (parsed.merchantProfile && typeof parsed.merchantProfile === 'object') {
        setMerchantProfile((prev) => ({ ...prev, ...parsed.merchantProfile }));
      }
      playSound('equip');
      return { success: true };
    } catch (err) {
      playSound('hazard');
      return { success: false, error: err.message };
    }
  };

  return (
    <CatalogContext.Provider
      value={{
        items,
        games,
        merchantProfile,
        cart,
        theme,
        soundEnabled,
        playSound,
        toggleSound,
        changeTheme,
        addItem,
        updateItem,
        deleteItem,
        addCategory,
        deleteCategory,
        updateMerchantProfile,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        resetToDefaults,
        exportDatabaseJSON,
        importDatabaseJSON
      }}
    >
      {children}
    </CatalogContext.Provider>
  );
}

export function useCatalog() {
  const context = useContext(CatalogContext);
  if (!context) {
    throw new Error('useCatalog must be used within a CatalogProvider');
  }
  return context;
}
