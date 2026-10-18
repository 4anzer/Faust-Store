import React, { createContext, useContext, useState, useEffect } from 'react';
import { DEFAULT_ITEMS, DEFAULT_GAMES, DEFAULT_MERCHANT_PROFILE, DEFAULT_ORDERS, DEFAULT_REVIEWS } from '../data/defaultData';
import { soundEffects } from '../utils/soundEffects';
import { sendDiscordOrderNotification } from '../utils/discordWebhook';

const CatalogContext = createContext(null);

const STORAGE_KEYS = {
  ITEMS: 'faust_store_items_v3',
  GAMES: 'faust_store_games_v3',
  PROFILE: 'faust_store_profile_v3',
  CART: 'faust_store_cart_v3',
  ORDERS: 'faust_store_orders_v3',
  REVIEWS: 'faust_store_reviews_v3',
  CHATS: 'faust_store_order_chats_v1',
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
    const fallbackWebhook = import.meta.env.VITE_DISCORD_WEBHOOK_URL || DEFAULT_MERCHANT_PROFILE.discordWebhook;
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PROFILE);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (!parsed.discordWebhook || parsed.discordWebhook.trim() === '') {
          parsed.discordWebhook = fallbackWebhook;
        }
        return parsed;
      }
    } catch {
      // ignore
    }
    return {
      ...DEFAULT_MERCHANT_PROFILE,
      discordWebhook: fallbackWebhook
    };
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

  // Customer Reviews State
  const [reviews, setReviews] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.REVIEWS);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return DEFAULT_REVIEWS;
  });

  // Order Live Chat Messages State (Keyed by orderId)
  const [orderChats, setOrderChats] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CHATS);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return {};
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
      localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(reviews));
    } catch (e) {
      console.warn("Storage quota error", e);
    }
  }, [reviews]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CHATS, JSON.stringify(orderChats));
    } catch (e) {
      console.warn("Storage quota error", e);
    }
  }, [orderChats]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.SOUND, JSON.stringify(soundEnabled));
      soundEffects.enabled = soundEnabled;
    } catch (e) {
      console.warn("Storage error", e);
    }
  }, [soundEnabled]);

  // Cross-tab real-time sync for orders, chats, and reviews
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === STORAGE_KEYS.ORDERS && e.newValue) {
        try {
          setOrders(JSON.parse(e.newValue));
        } catch {}
      } else if (e.key === STORAGE_KEYS.CHATS && e.newValue) {
        try {
          setOrderChats(JSON.parse(e.newValue));
        } catch {}
      } else if (e.key === STORAGE_KEYS.REVIEWS && e.newValue) {
        try {
          setReviews(JSON.parse(e.newValue));
        } catch {}
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Audio helper
  const playSound = (type = 'click') => {
    if (!soundEnabled) return;
    if (type === 'click') soundEffects.playClick();
    if (type === 'beep') soundEffects.playBeep();
    if (type === 'hazard') soundEffects.playHazard();
    if (type === 'equip') soundEffects.playEquip();
    if (type === 'glitch') soundEffects.playGlitch();
    if (type === 'proelium') soundEffects.playProeliumIntro();
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
      stockDeducted: true,
      createdAt: new Date().toISOString()
    };

    // 1. Deduct stock IMMEDIATELY when the customer places an order
    setItems((prevItems) =>
      prevItems.map((item) => {
        const purchasedItem = orderPayload.items?.find(
          (it) => it.id === item.id || it.name?.trim().toLowerCase() === item.name?.trim().toLowerCase()
        );
        if (purchasedItem) {
          const currentStock = typeof item.stock === 'number' ? item.stock : 0;
          const newStock = Math.max(0, currentStock - (purchasedItem.quantity || 1));
          return { ...item, stock: newStock };
        }
        return item;
      })
    );

    // 2. Save to orders state
    setOrders((prev) => [newOrder, ...prev]);
    clearCart();
    playSound('equip');

    // Trigger Discord Webhook Notification if configured
    const activeWebhook = (merchantProfile.discordWebhook && merchantProfile.discordWebhook.trim()) 
      ? merchantProfile.discordWebhook.trim() 
      : (import.meta.env.VITE_DISCORD_WEBHOOK_URL || DEFAULT_MERCHANT_PROFILE.discordWebhook);

    if (activeWebhook) {
      sendDiscordOrderNotification(activeWebhook, newOrder)
        .then((res) => {
          if (res?.success) {
            console.log("Discord notification successfully sent by Carmen!");
          } else {
            console.warn("Discord notification notice:", res?.reason);
          }
        })
        .catch((err) => console.error("Error sending webhook:", err));
    }

    return newOrder;
  };

  // Store Open / Closed Status
  const isStoreOpen = merchantProfile.isOpen !== false;

  const toggleStoreStatus = () => {
    const nextState = !isStoreOpen;
    updateMerchantProfile({ isOpen: nextState });
    if (nextState) {
      playSound('equip');
    } else {
      playSound('hazard');
    }
    return nextState;
  };

  const updateOrderStatus = (orderId, status) => {
    const targetOrder = orders.find((o) => o.id === orderId);
    if (!targetOrder) return;

    // If order was cancelled ('Dibatalkan') by admin and had stock deducted, restore the stock:
    if (status === 'Dibatalkan' && targetOrder.status !== 'Dibatalkan' && targetOrder.stockDeducted) {
      setItems((prevItems) =>
        prevItems.map((item) => {
          const purchasedItem = targetOrder.items?.find(
            (it) => it.id === item.id || it.name?.trim().toLowerCase() === item.name?.trim().toLowerCase()
          );
          if (purchasedItem) {
            const currentStock = typeof item.stock === 'number' ? item.stock : 0;
            return { ...item, stock: currentStock + (purchasedItem.quantity || 1) };
          }
          return item;
        })
      );
    }
    // If order is uncancelled back to Pending / Selesai from Dibatalkan:
    else if (status !== 'Dibatalkan' && targetOrder.status === 'Dibatalkan' && targetOrder.stockDeducted) {
      setItems((prevItems) =>
        prevItems.map((item) => {
          const purchasedItem = targetOrder.items?.find(
            (it) => it.id === item.id || it.name?.trim().toLowerCase() === item.name?.trim().toLowerCase()
          );
          if (purchasedItem) {
            const currentStock = typeof item.stock === 'number' ? item.stock : 0;
            return { ...item, stock: Math.max(0, currentStock - (purchasedItem.quantity || 1)) };
          }
          return item;
        })
      );
    }

    // Update order record
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId) {
          return {
            ...ord,
            status
          };
        }
        return ord;
      })
    );
    playSound('beep');
  };

  const deleteOrder = (orderId) => {
    setOrders((prev) => prev.filter((ord) => ord.id !== orderId));
    playSound('glitch');
  };

  // Review System Functions
  const addReview = (reviewPayload) => {
    const newReview = {
      id: `REV-${Date.now().toString(36).toUpperCase()}`,
      createdAt: new Date().toISOString(),
      ...reviewPayload
    };
    setReviews((prev) => [newReview, ...prev]);
    playSound('equip');
    return newReview;
  };

  const deleteReview = (reviewId) => {
    setReviews((prev) => prev.filter((r) => r.id !== reviewId));
    playSound('beep');
  };

  // Order Live Chat Functions
  const sendOrderChatMessage = (orderId, sender, text, senderName) => {
    if (!orderId || !text || !text.trim()) return null;
    const msg = {
      id: `MSG-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      sender, // 'customer' | 'admin'
      senderName: senderName || (sender === 'admin' ? 'Merchant Admin' : 'Customer'),
      text: text.trim(),
      timestamp: new Date().toISOString()
    };

    setOrderChats((prev) => {
      const currentList = prev[orderId] || [];
      return {
        ...prev,
        [orderId]: [...currentList, msg]
      };
    });
    playSound('beep');
    return msg;
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
        isStoreOpen,
        toggleStoreStatus,
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
        reviews,
        addReview,
        deleteReview,
        orderChats,
        sendOrderChatMessage,
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
