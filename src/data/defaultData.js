// Default database for Faust Store
// Combines Limbus Company, Library of Ruina, Lobotomy Corp, SCP Foundation, and custom games

export const DEFAULT_GAMES = [
  "Limbus Company",
  "Library of Ruina",
  "Lobotomy Corporation",
  "SCP Foundation",
  "Genshin Impact",
  "Honkai: Star Rail",
  "Roblox",
  "Steam / CS2"
];

export const THREAT_LEVELS = {
  ALEPH: {
    name: "ALEPH",
    color: "#ff2a44",
    bg: "rgba(255, 42, 68, 0.15)",
    border: "rgba(255, 42, 68, 0.6)",
    desc: "Tingkat Tertinggi / Ultra Rare"
  },
  WAW: {
    name: "WAW",
    color: "#b026ff",
    bg: "rgba(176, 38, 255, 0.15)",
    border: "rgba(176, 38, 255, 0.6)",
    desc: "Tingkat Sangat Langka"
  },
  HE: {
    name: "HE",
    color: "#f5c518",
    bg: "rgba(245, 197, 24, 0.15)",
    border: "rgba(245, 197, 24, 0.6)",
    desc: "Tingkat Langka / Populer"
  },
  TETH: {
    name: "TETH",
    color: "#00b4d8",
    bg: "rgba(0, 180, 216, 0.15)",
    border: "rgba(0, 180, 216, 0.6)",
    desc: "Tingkat Menengah"
  },
  ZAYIN: {
    name: "ZAYIN",
    color: "#2ec4b6",
    bg: "rgba(46, 196, 182, 0.15)",
    border: "rgba(46, 196, 182, 0.6)",
    desc: "Tingkat Standar / Konsumsi"
  },
  KETER: {
    name: "KETER",
    color: "#ff0033",
    bg: "rgba(255, 0, 51, 0.15)",
    border: "rgba(255, 0, 51, 0.6)",
    desc: "SCP Kelas Bahaya Tinggi"
  },
  EUCLID: {
    name: "EUCLID",
    color: "#ffaa00",
    bg: "rgba(255, 170, 0, 0.15)",
    border: "rgba(255, 170, 0, 0.6)",
    desc: "SCP Kelas Khusus"
  },
  SAFE: {
    name: "SAFE",
    color: "#00f0ff",
    bg: "rgba(0, 240, 255, 0.15)",
    border: "rgba(0, 240, 255, 0.6)",
    desc: "SCP Kelas Aman"
  }
};

export const DEFAULT_ITEMS = [
  {
    id: "item-lc-01",
    name: "The One Who Grips - Faust 000 Identity",
    game: "Limbus Company",
    threat: "WAW",
    price: 150000,
    currency: "Rp",
    stock: 2,
    tag: "Akun / Karakter",
    image: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=600&auto=format&fit=crop&q=80",
    description: "Identitas Faust tingkat 000 dari faksi N Corp. Memiliki skill tancapan paku dan bleed debuff yang mematikan di Mirror Dungeon. Siap transfer data akun via bind Google/Steam.",
    deliveryMethod: "Pengiriman data akun via chat langsung setelah pembayaran (Full access, garansi aman).",
    properties: [
      { label: "Tipe Damage", value: "Pierce / Bleed" },
      { label: "Faksi", value: "N Corp. Inquisition" },
      { label: "Garansi", value: "30 Hari Penuh" }
    ],
    featured: true
  },
  {
    id: "item-lc-02",
    name: "Fluid Sac E.G.O - Faust",
    game: "Limbus Company",
    threat: "HE",
    price: 85000,
    currency: "Rp",
    stock: 5,
    tag: "E.G.O Skill",
    image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80",
    description: "E.G.O penyembuh SP dan HP paling penting di Limbus Company. Mengembalikan kestabilan mental sinner saat pertempuran Refraction Railway.",
    deliveryMethod: "Gift shard extraction bundle / Topup lunacy via UID game.",
    properties: [
      { label: "Efek", value: "+15 SP Seluruh Tim" },
      { label: "Resonansi", value: "Gloom / Lust" },
      { label: "Proses", value: "5 Menit Cepat" }
    ],
    featured: true
  },
  {
    id: "item-lc-03",
    name: "13,000 Lunacy Crate (Mephistopheles Fuel)",
    game: "Limbus Company",
    threat: "ZAYIN",
    price: 320000,
    currency: "Rp",
    stock: 12,
    tag: "Topup Lunacy",
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80",
    description: "Bahan bakar Lunacy murni untuk gacha identitas terbaru Walpurgisnacht. 100% legal via developer portal, tanpa resiko minus.",
    deliveryMethod: "Cukup berikan ID Akun / UID game, proses kilat tanpa login.",
    properties: [
      { label: "Jumlah", value: "13,000 Lunacy" },
      { label: "Bonus", value: "300 Paid Shards" },
      { label: "Keamanan", value: "100% Legal & Bergaransi" }
    ],
    featured: false
  },
  {
    id: "item-lor-01",
    name: "The Red Mist (Gebura) Key Page & Combat Deck",
    game: "Library of Ruina",
    threat: "ALEPH",
    price: 120000,
    currency: "Rp",
    stock: 4,
    tag: "Savefile & Deck",
    image: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600&auto=format&fit=crop&q=80",
    description: "Buku halaman kunci legenda Kali 'The Red Mist'. Dilengkapi build deck pasif sempurna: Mountain of Smiling Bodies + Slash Mastery.",
    deliveryMethod: "File save data cloud sync (.dat) + Panduan import deck pertempuran lengkap.",
    properties: [
      { label: "Lantai", value: "Language Floor" },
      { label: "Mode", value: "Manifestation E.G.O" },
      { label: "Pasif", value: "The Strongest + Myo" }
    ],
    featured: true
  },
  {
    id: "item-lob-01",
    name: "Mimicry E.G.O Greatsword & Armor Set",
    game: "Lobotomy Corporation",
    threat: "ALEPH",
    price: 180000,
    currency: "Rp",
    stock: 1,
    tag: "Senjata & Armor",
    image: "https://images.unsplash.com/photo-1563089145-599997674d42?w=600&auto=format&fit=crop&q=80",
    description: "Senjata dan baju tempur hasil ekstraksi Abnormality Nothing There. Menyerap darah musuh untuk menyembuhkan HP agen pemakainya.",
    deliveryMethod: "Save Profile 100% Codex Unlock + Tutorial transfer savefile lokal Steam.",
    properties: [
      { label: "Damage", value: "RED 20-24 (Lifesteal)" },
      { label: "Ketahanan", value: "RED 0.2 / WHITE 0.5" },
      { label: "Syarat Agen", value: "Level V Fortitude" }
    ],
    featured: true
  },
  {
    id: "item-scp-01",
    name: "O5 Council Black Clearance Keycard (Level 5 Omni)",
    game: "SCP Foundation",
    threat: "KETER",
    price: 110000,
    currency: "Rp",
    stock: 8,
    tag: "Role & Keycard",
    image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&auto=format&fit=crop&q=80",
    description: "Kartu akses level O5 tak terbatas untuk SCP: Secret Laboratory / Server Role. Membuka semua pintu gerbang Gate A, Gate B, dan Alpha Warhead.",
    deliveryMethod: "In-game role assignment / Steam ID Whitelist di server SCP partner.",
    properties: [
      { label: "Level Akses", value: "Level 5 Omni" },
      { label: "Tipe", value: "Permanent Role" },
      { label: "Proses", value: "10 Menit Whitelist" }
    ],
    featured: true
  },
  {
    id: "item-gen-01",
    name: "Genshin Impact: Welkin Moon + Crystal Bundle",
    game: "Genshin Impact",
    threat: "TETH",
    price: 210000,
    currency: "Rp",
    stock: 10,
    tag: "Topup UID",
    image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&auto=format&fit=crop&q=80",
    description: "Paket Blessing of Welkin Moon x3 + 1980 Genesis Crystals. Legal via UID & Server resmi tanpa perlu login password akun.",
    deliveryMethod: "Kirim UID dan Server (Asia/America/Europe), proses kilat 3 menit.",
    properties: [
      { label: "Metode", value: "UID Resmi Tanpa Login" },
      { label: "Keamanan", value: "100% Anti Hackback" },
      { label: "Bonus", value: "First Time 2x Crystal Aktif" }
    ],
    featured: false
  }
];

export const DEFAULT_MERCHANT_PROFILE = {
  shopName: "Faust Store",
  subtitle: "Roblox & In-Game Item Shop Terpercaya",
  sellerTag: "VERIFIED MERCHANT",
  logoUrl: "/logo.png",
  whatsapp: "6281234567890",
  discord: "faust_store#0001",
  discordWebhook: "https://discord.com/api/webhooks/1561067399795445852/2REoJTHuzuERa_GSwx6mDBsK9U79nBCshe9p1bkhNvz03DFDKfuxhh0UChCJR-HW105q",
  telegram: "@FaustStore",
  paymentMethods: ["QRIS", "BCA", "DANA", "GoPay", "ShopeePay", "Steam Wallet"],
  announcement: "📢 Selamat datang di Faust Store! Pemesanan langsung tanpa perlu buat akun. Notifikasi terhubung ke Discord & WhatsApp.",
  currencySymbol: "Rp",
  isOpen: true
};

export const DEFAULT_ORDERS = [
  {
    id: "ORD-94812",
    buyerName: "Renaldi / Dante",
    buyerContact: "081298765432",
    paymentMethod: "QRIS",
    notes: "Tolong proses secepatnya ya min, mau push railway",
    totalPrice: 150000,
    status: "Pending", // "Pending" | "Selesai" | "Dibatalkan"
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    items: [
      {
        id: "item-lc-01",
        name: "The One Who Grips - Faust 000 Identity",
        game: "Limbus Company",
        price: 150000,
        quantity: 1
      }
    ]
  }
];
