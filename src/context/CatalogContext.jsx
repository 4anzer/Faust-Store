import React, { createContext, useContext, useState, useEffect } from 'react';
import { DEFAULT_ITEMS, DEFAULT_GAMES, DEFAULT_MERCHANT_PROFILE, DEFAULT_ORDERS } from '../data/defaultData';
import { soundEffects } from '../utils/soundEffects';
import { sendDiscordOrderNotification } from '../utils/discordWebhook';

const CatalogContext = createContext(null);

const STORAGE_KEYS = {
  ITEMS: 'faust_store_items_v3',
  GAMES: 'faust_store_games_v3',
  PROFILE: 'faust_store_profile_v3',
  CART: 'faust_store_cart_v3',
  ORDERS: 'faust_store_orders_v3',
  SOUND: 'faust_store_sound_v3'
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

  // Merchant Profile State (includes WhatsApp, Discord webhook, etc.)
  const [merchantProfile, setMerchantProfile] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PROFILE);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return DEFAULT_MERCHANT_PROFILE;
  });

  // Customer Orders List (Visible to Admin, no customer login required)
  const [orders, setOrders] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ORDERS);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return DEFAULT_ORDERS;
  });

  // Shopping Cart State
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CART);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return [];
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
      console.warn("Storage quota error", e);
    }
  }, [items]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.GAMES, JSON.stringify(games));
    } catch (e) {
      console.warn("Storage quota error", e);
    }
  }, [games]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(merchantProfile));
    } catch (e) {
      console.warn("Storage quota error", e);
    }
  }, [merchantProfile]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
    } catch (e) {
      console.warn("Storage quota error", e);
    }
  }, [orders]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
    } catch (e) {
      console.warn("Storage quota error", e);
    }
  }, [cart]);

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

  // Item Management (CRUD)
  const addItem = (itemData) => {
    const newItem = {
      ...itemData,
      id: `item-${Date.now()}`
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

  // Orders Management (Customer checkout & Admin inspection)
  const createOrder = async (orderPayload) => {
    const newOrder = {
      ...orderPayload,
      id: `ORD-${Math.floor(100000 + Math.random() * 900000)}`,
      status: 'Pending',
      createdAt: new Date().toISOString()
    };

    // Save to orders state
    setOrders((prev) => [newOrder, ...prev]);
    clearCart();
    playSound('equip');

    // Trigger Discord Webhook Notification if configured
    if (merchantProfile.discordWebhook) {
      sendDiscordOrderNotification(merchantProfile.discordWebhook, newOrder)
        .catch((err) => console.error("Error sending webhook:", err));
    }

    return newOrder;
  };

  const updateOrderStatus = (orderId, status) => {
    setOrders((prev) =>
      prev.map((ord) => (ord.id === orderId ? { ...ord, status } : ord))
    );
    playSound('beep');
  };

  const deleteOrder = (orderId) => {
    setOrders((prev) => prev.filter((ord) => ord.id !== orderId));
    playSound('glitch');
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
    setCart([]);
  };

  // Reset to factory defaults
  const resetToDefaults = () => {
    setItems(DEFAULT_ITEMS);
    setGames(DEFAULT_GAMES);
    setMerchantProfile(DEFAULT_MERCHANT_PROFILE);
    setOrders(DEFAULT_ORDERS);
    setCart([]);
    playSound('hazard');
  };

  // Export database as JSON
  const exportDatabaseJSON = () => {
    const data = {
      items,
      games,
      merchantProfile,
      orders,
      exportedAt: new Date().toISOString()
    };
    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `faust_store_backup_${Date.now()}.json`;
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
      if (parsed.orders && Array.isArray(parsed.orders)) {
        setOrders(parsed.orders);
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
        orders,
        cart,
        soundEnabled,
        playSound,
        toggleSound,
        addItem,
        updateItem,
        deleteItem,
        addCategory,
        deleteCategory,
        updateMerchantProfile,
        createOrder,
        updateOrderStatus,
        deleteOrder,
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
