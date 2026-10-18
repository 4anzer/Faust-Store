import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext(null);

const STORAGE_KEY = 'faust_store_lang_v1';

export const TRANSLATIONS = {
  id: {
    // Header
    officialBadge: "RESMI",
    cartButton: "KERANJANG",
    bgmTitle: "Musik Latar: SCP Sector 17 Ambient",
    bgmPlay: "Putar Musik Latar",
    bgmPause: "Jeda Musik",
    soundMute: "Bisukan Efek Suara",
    soundUnmute: "Nyalakan Efek Suara",
    onlineStatus: "Online",
    adminDirectNotice: "Portal Admin Terpisah",

    // Banner
    broadcastLabel: "PENGUMUMAN RESMI // FAUST TERMINAL",
    storeStatusOpen: "STATUS: BUKA (MENERIMA PESANAN)",
    storeStatusClosed: "STATUS: TUTUP SEMENTARA",
    defaultAnnouncement: "📢 Selamat datang di Faust Store! Pemesanan langsung tanpa perlu buat akun. Terhubung ke Discord & WhatsApp.",

    // FilterBar
    searchPlaceholder: "Cari item, ID, E.G.O, atau kata kunci...",
    allGames: "SEMUA GAME",
    inStockOnly: "Hanya yang Tersedia",
    sortByLabel: "Urutkan:",
    sortFeatured: "Paling Populer",
    sortPriceAsc: "Harga Terendah",
    sortPriceDesc: "Harga Tertinggi",
    sortStock: "Stok Terbanyak",
    sortName: "Nama (A-Z)",
    showingItems: "Menampilkan",
    itemsCount: "item",

    // ItemCard
    threatClass: "TINGKAT BAHAYA",
    stockLabel: "Stok:",
    unitPcs: "unit",
    outOfStockBadge: "HABIS",
    buyBtn: "BELI",
    closedBtn: "TUTUP",
    inspectBtn: "DETAIL",
    verifiedItem: "TERVERIFIKASI",

    // ItemModal
    itemDetailsTitle: "DETAIL BARANG & SPESIFIKASI",
    threatAssessment: "KLASIFIKASI ANOMALI / BAHAYA:",
    priceLabel: "Harga:",
    deliveryMethodTitle: "METODE PENGIRIMAN & PROSES:",
    propertiesTitle: "SPESIFIKASI ITEM:",
    addToCartBtn: "TAMBAH KE KERANJANG",
    buyNowBtn: "BELI SEKARANG (CHECKOUT)",
    itemAddedNotice: "Item telah ditambahkan ke keranjang!",
    outOfStockNotice: "Maaf, stok item ini sedang habis.",
    storeClosedNotice: "Toko sedang tutup sementara.",

    // CartModal
    cartTitle: "KERANJANG BELANJA",
    cartEmpty: "Keranjang Belanja Kosong",
    cartEmptyDesc: "Kamu belum memilih barang apapun. Silakan pilih item dari etalase Faust Store.",
    clearCartBtn: "KOSONGKAN KERANJANG",
    buyerNameLabel: "NAMA LENGKAP / NICKNAME GAME:",
    buyerNamePlaceholder: "Contoh: Dante / Roland...",
    buyerContactLabel: "NOMOR WHATSAPP / KONTAK:",
    buyerContactPlaceholder: "Contoh: 081234567890",
    paymentMethodLabel: "PILIH METODE PEMBAYARAN:",
    notesLabel: "CATATAN TAMBAHAN (OPSIONAL):",
    notesPlaceholder: "Catatan khusus, UID game, instruksi pengiriman...",
    totalOrderLabel: "TOTAL PEMBAYARAN:",
    orderNowBtn: "SUBMIT PESANAN & CHAT WHATSAPP",
    processingBtn: "MEMPROSES PESANAN...",
    orderSuccessTitle: "PESANAN BERHASIL DIBUAT!",
    orderSuccessId: "ID PESANAN:",
    orderSuccessDesc: "Data pesanan telah dicatat dan terkirim ke sistem Faust Store. Halaman WhatsApp akan terbuka untuk konfirmasi admin.",
    openWhatsAppAgain: "BUKA WHATSAPP LAGI",
    closeBtn: "TUTUP",

    // Footer
    footerDesc: "Platform toko dan merchant in-game item terpercaya bertema Project Moon & SCP Foundation.",
    contactTitle: "// KONTAK & LAYANAN:",
    supportHours: "Pelayanan: 24 Jam Online",
    backToTop: "KE ATAS",
    allRightsReserved: "Hak cipta dilindungi undang-undang.",
    
    // Anomaly status
    anomalySafe: "KONDISI FASILITAS: STABIL // PROTOKOL NORMAL",

    // Catalog Empty State
    noItemsTitle: "TIDAK ADA BARANG DITEMUKAN",
    noItemsDesc: "Tidak ada barang yang cocok dengan kata kunci pencarian atau filter yang dipilih.",
    resetFilterBtn: "RESET FILTER",

    // Lang toggle
    langLabel: "BAHASA"
  },

  en: {
    // Header
    officialBadge: "OFFICIAL",
    cartButton: "CART",
    bgmTitle: "Background Music: SCP Sector 17 Ambient",
    bgmPlay: "Play Background Music",
    bgmPause: "Pause Music",
    soundMute: "Mute Sound FX",
    soundUnmute: "Enable Sound FX",
    onlineStatus: "Online",
    adminDirectNotice: "Separate Admin Portal",

    // Banner
    broadcastLabel: "OFFICIAL BROADCAST // FAUST TERMINAL",
    storeStatusOpen: "STATUS: OPEN (ACCEPTING ORDERS)",
    storeStatusClosed: "STATUS: TEMPORARILY CLOSED",
    defaultAnnouncement: "📢 Welcome to Faust Store! Direct checkout without creating an account. Integrated with Discord & WhatsApp.",

    // FilterBar
    searchPlaceholder: "Search items, IDs, E.G.O, or keywords...",
    allGames: "ALL GAMES",
    inStockOnly: "In Stock Only",
    sortByLabel: "Sort by:",
    sortFeatured: "Most Popular",
    sortPriceAsc: "Price: Low to High",
    sortPriceDesc: "Price: High to Low",
    sortStock: "Highest Stock",
    sortName: "Name (A-Z)",
    showingItems: "Showing",
    itemsCount: "items",

    // ItemCard
    threatClass: "THREAT CLASS",
    stockLabel: "Stock:",
    unitPcs: "pcs",
    outOfStockBadge: "SOLD OUT",
    buyBtn: "BUY",
    closedBtn: "CLOSED",
    inspectBtn: "DETAILS",
    verifiedItem: "VERIFIED",

    // ItemModal
    itemDetailsTitle: "ITEM SPECIFICATIONS & DETAILS",
    threatAssessment: "ANOMALY / THREAT CLASSIFICATION:",
    priceLabel: "Price:",
    deliveryMethodTitle: "DELIVERY METHOD & FULFILLMENT:",
    propertiesTitle: "ITEM PROPERTIES:",
    addToCartBtn: "ADD TO CART",
    buyNowBtn: "BUY NOW (CHECKOUT)",
    itemAddedNotice: "Item has been added to your cart!",
    outOfStockNotice: "Sorry, this item is currently out of stock.",
    storeClosedNotice: "The store is temporarily closed.",

    // CartModal
    cartTitle: "SHOPPING CART",
    cartEmpty: "Your Cart is Empty",
    cartEmptyDesc: "You haven't selected any items yet. Please pick an item from the Faust Store catalog.",
    clearCartBtn: "CLEAR CART",
    buyerNameLabel: "FULL NAME / IN-GAME NICKNAME:",
    buyerNamePlaceholder: "e.g. Dante / Roland...",
    buyerContactLabel: "WHATSAPP NUMBER / CONTACT:",
    buyerContactPlaceholder: "e.g. +6281234567890",
    paymentMethodLabel: "SELECT PAYMENT METHOD:",
    notesLabel: "ADDITIONAL NOTES (OPTIONAL):",
    notesPlaceholder: "Special requests, in-game UID, delivery notes...",
    totalOrderLabel: "TOTAL PAYMENT:",
    orderNowBtn: "SUBMIT ORDER & OPEN WHATSAPP",
    processingBtn: "PROCESSING ORDER...",
    orderSuccessTitle: "ORDER SUBMITTED SUCCESSFULLY!",
    orderSuccessId: "ORDER ID:",
    orderSuccessDesc: "Your order has been recorded and broadcasted to Faust Store. WhatsApp is opening for merchant confirmation.",
    openWhatsAppAgain: "REOPEN WHATSAPP",
    closeBtn: "CLOSE",

    // Footer
    footerDesc: "Trusted in-game merchant and item showcase platform inspired by Project Moon & SCP Foundation.",
    contactTitle: "// CONTACT & SERVICES:",
    supportHours: "Customer Support: 24/7 Online",
    backToTop: "BACK TO TOP",
    allRightsReserved: "All rights reserved.",

    // Anomaly status
    anomalySafe: "FACILITY STATUS: STABLE // NORMAL PROTOCOL",

    // Catalog Empty State
    noItemsTitle: "NO ITEMS FOUND",
    noItemsDesc: "No items match your active search keyword or category filter.",
    resetFilterBtn: "RESET FILTERS",

    // Lang toggle
    langLabel: "LANGUAGE"
  }
};

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === 'en' || saved === 'id') return saved;
    } catch {
      // ignore
    }
    return 'id'; // default Indonesian
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, language);
      document.documentElement.lang = language;
    } catch {
      // ignore
    }
  }, [language]);

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === 'id' ? 'en' : 'id'));
  };

  const t = (key) => {
    const dict = TRANSLATIONS[language] || TRANSLATIONS.id;
    return dict[key] !== undefined ? dict[key] : (TRANSLATIONS.id[key] || key);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    // Fallback if used outside provider
    return {
      language: 'id',
      setLanguage: () => {},
      toggleLanguage: () => {},
      t: (key) => TRANSLATIONS.id[key] || key
    };
  }
  return context;
}
