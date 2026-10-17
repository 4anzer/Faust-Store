// Initial default database for the merchant shop
// Combines Limbus Company, Library of Ruina, Lobotomy Corp, SCP Foundation, and general game items

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
    desc: "Bencana Pemusnah Massal // Tingkat Bahaya Maksimum"
  },
  WAW: {
    name: "WAW",
    color: "#b026ff",
    bg: "rgba(176, 38, 255, 0.15)",
    border: "rgba(176, 38, 255, 0.6)",
    desc: "Ancaman Tingkat Tinggi // Kerusakan Fasilitas Luas"
  },
  HE: {
    name: "HE",
    color: "#f5c518",
    bg: "rgba(245, 197, 24, 0.15)",
    border: "rgba(245, 197, 24, 0.6)",
    desc: "Tingkat Bahaya Sedang // Waspada Prosedur Khusus"
  },
  TETH: {
    name: "TETH",
    color: "#00b4d8",
    bg: "rgba(0, 180, 216, 0.15)",
    border: "rgba(0, 180, 216, 0.6)",
    desc: "Tingkat Bahaya Rendah // Penanganan Standar"
  },
  ZAYIN: {
    name: "ZAYIN",
    color: "#2ec4b6",
    bg: "rgba(46, 196, 182, 0.15)",
    border: "rgba(46, 196, 182, 0.6)",
    desc: "Risiko Minimum // Aman Digunakan Karyawan"
  },
  KETER: {
    name: "KETER",
    color: "#ff0033",
    bg: "rgba(255, 0, 51, 0.15)",
    border: "rgba(255, 0, 51, 0.6)",
    desc: "Sangat Sulit Dikurung // SCP Kelas Berbahaya"
  },
  EUCLID: {
    name: "EUCLID",
    color: "#ffaa00",
    bg: "rgba(255, 170, 0, 0.15)",
    border: "rgba(255, 170, 0, 0.6)",
    desc: "Sifat Tak Terduga // SCP Pengawasan Ketat"
  },
  SAFE: {
    name: "SAFE",
    color: "#00f0ff",
    bg: "rgba(0, 240, 255, 0.15)",
    border: "rgba(0, 240, 255, 0.6)",
    desc: "Terkurung Sempurna // SCP Risiko Rendah"
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
    tag: "Identity / Akun",
    image: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=600&auto=format&fit=crop&q=80",
    description: "Identitas Faust tingkat 000 dari faksi N Corp. Memiliki skill tancapan paku dan bleed debuff yang mematikan di Mirror Dungeon. Siap transfer data akun via bind Google/Steam.",
    deliveryMethod: "Pengiriman instan via chat (Data login akun aman, full access garansi 30 hari).",
    properties: [
      { label: "Damage Type", value: "Pierce / Bleed" },
      { label: "Faction", value: "N Corp. Inquisition" },
      { label: "Clearance", value: "Level 4 Sinner" }
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
    tag: "E.G.O Extraction",
    image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80",
    description: "E.G.O penyembuh SP dan HP paling penting di Limbus Company. Mengembalikan kestabilan mental sinner saat sanity runtuh dalam pertempuran Refraction Railway.",
    deliveryMethod: "Gift shard extraction bundle / Topup lunacy resmi melalui UID game.",
    properties: [
      { label: "SP Recovery", value: "+15 SP All Allies" },
      { label: "Resonance", value: "Gloom / Lust" },
      { label: "Source", value: "Drenched Gossypium" }
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
    tag: "In-game Currency",
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80",
    description: "Bahan bakar Lunacy murni untuk gacha identitas terbaru Walpurgisnacht. Legal 100%, invoice resmi, tidak ada risiko minus atau banned.",
    deliveryMethod: "Login via developer portal atau kode voucher resmi dalam 5-10 menit.",
    properties: [
      { label: "Total Lunacy", value: "13,000 Pure" },
      { label: "Bonus", value: "300 Paid Shards" },
      { label: "Proses", value: "5 Menit Kilat" }
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
    tag: "Key Page & Build",
    image: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600&auto=format&fit=crop&q=80",
    description: "Buku halaman kunci legenda Kali 'The Red Mist'. Dilengkapi konfigurasi passive transfer sempurna: Mountain of Smiling Bodies + Slash Mastery. Siap membantai Star of the City.",
    deliveryMethod: "File save data cloud sync (.dat) + Panduan import deck pertempuran lengkap.",
    properties: [
      { label: "Floor", value: "Language Floor" },
      { label: "E.G.O State", value: "Manifestation E.G.O" },
      { label: "Passives", value: "The Strongest + Myo's Prowess" }
    ],
    featured: true
  },
  {
    id: "item-lor-02",
    name: "The Purple Tear - Dimensional Stance Master Deck",
    game: "Library of Ruina",
    threat: "WAW",
    price: 95000,
    currency: "Rp",
    stock: 3,
    tag: "Key Page",
    image: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=600&auto=format&fit=crop&q=80",
    description: "Halaman kunci Iori sang Purple Tear. Memungkinkan pergantian 4 stance (Slash, Pierce, Blunt, Guard) setiap ronde dengan passive imun status abnormalitas.",
    deliveryMethod: "Steam Cloud synchronization guide & save profile.",
    properties: [
      { label: "Stances", value: "4 Multi-Dimension" },
      { label: "Rank", value: "Color Fixer" },
      { label: "Grade", value: "Endgame Tier" }
    ],
    featured: false
  },
  {
    id: "item-lob-01",
    name: "Mimicry E.G.O Greatsword & Armor Set",
    game: "Lobotomy Corporation",
    threat: "ALEPH",
    price: 180000,
    currency: "Rp",
    stock: 1,
    tag: "E.G.O Weapon Set",
    image: "https://images.unsplash.com/photo-1563089145-599997674d42?w=600&auto=format&fit=crop&q=80",
    description: "Senjata dan baju tempur hasil ekstraksi Abnormality O-06-20 (Nothing There). Menyerap darah musuh untuk menyembuhkan HP agen pemakainya. Ketahanan RED 0.2 tak tertandingi.",
    deliveryMethod: "Save Profile 100% Codex Unlock + Tutorial transfer savefile lokal Steam.",
    properties: [
      { label: "Damage", value: "RED 20-24 (Life Steal)" },
      { label: "Suit Resist", value: "RED 0.2 / WHITE 0.5" },
      { label: "Requirement", value: "Fortitude V / Justice V" }
    ],
    featured: true
  },
  {
    id: "item-lob-02",
    name: "Twilight E.G.O Weapon (Apocalypse Bird Extracted)",
    game: "Lobotomy Corporation",
    threat: "ALEPH",
    price: 250000,
    currency: "Rp",
    stock: 1,
    tag: "Ultra Rare E.G.O",
    image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80",
    description: "Relik senjata paling kuat di seluruh Lobotomy Corp. Menyerang dengan 4 tipe damage sekaligus (RED, WHITE, BLACK, PALE) dalam satu tebasan area.",
    deliveryMethod: "Pengiriman data save file slot 1 + Full Codex Abnormality.",
    properties: [
      { label: "Damage", value: "Quad Damage (R/W/B/P)" },
      { label: "Origin", value: "Apocalypse Bird Egg" },
      { label: "Bonus", value: "All Stats +15" }
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
    tag: "Clearance Relic",
    image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&auto=format&fit=crop&q=80",
    description: "Kartu akses level O5 tak terbatas untuk SCP: Secret Laboratory / SCP Server Role. Membuka semua pintu gerbang Gate A, Gate B, Alpha Warhead, dan Containment Chamber 106.",
    deliveryMethod: "In-game role assignment / Steam ID Whitelist di server SCP partner.",
    properties: [
      { label: "Akses", value: "Omni Level 5 (Semua Pintu)" },
      { label: "Otoritas", value: "O5-Council Black" },
      { label: "Status", value: "Classified Security" }
    ],
    featured: true
  },
  {
    id: "item-scp-02",
    name: "SCP-500 Panacea Vial (Pills of Absolute Cure)",
    game: "SCP Foundation",
    threat: "SAFE",
    price: 75000,
    currency: "Rp",
    stock: 15,
    tag: "Consumable Relic",
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&auto=format&fit=crop&q=80",
    description: "Pil merah ajaib yang mampu menyembuhkan segala penyakit, mutasi infeksi SCP-008, dan memulihkan HP secara instan hingga 100%.",
    deliveryMethod: "Item spawn pack / Inventory transfer via in-game trading bot.",
    properties: [
      { label: "Effect", value: "Full HP + Cure All Debuffs" },
      { label: "Containment", value: "Site-19 Vault 4" },
      { label: "Durability", value: "Single Use Consumable" }
    ],
    featured: false
  },
  {
    id: "item-gen-01",
    name: "Custom Game: Genshin Impact Primogems Bundle",
    game: "Genshin Impact",
    threat: "TETH",
    price: 210000,
    currency: "Rp",
    stock: 10,
    tag: "Gacha Topup",
    image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&auto=format&fit=crop&q=80",
    description: "Paket Blessing of Welkin Moon x3 + 1980 Genesis Crystals. Legal via UID & Server tanpa perlu login password akun.",
    deliveryMethod: "Cukup berikan UID dan Server (Asia/America/Europe), proses 3 menit.",
    properties: [
      { label: "Metode", value: "UID Resmi Tanpa Login" },
      { label: "Keamanan", value: "100% Anti Hackback" },
      { label: "Bonus", value: "First Time 2x Crystal Aktif" }
    ],
    featured: false
  }
];

export const DEFAULT_MERCHANT_PROFILE = {
  shopName: "THE REQUISITION WING // L-CORP & SCP ARMORY",
  subtitle: "Distributor Resmi Perlengkapan Anomali, Key Pages, & In-Game Items Antar Dimensi",
  sellerTag: "SUPERVISOR // CLEARANCE LEVEL 5",
  whatsapp: "6281234567890",
  discord: "overseer_dante#0001",
  telegram: "@LCorpMerchant",
  paymentMethods: ["QRIS", "BCA", "DANA", "GoPay", "ShopeePay", "Steam Wallet", "Cryptocurrency"],
  announcement: "[PROTOKOL DARURAT] Seluruh item anomali telah disterilisasi sebelum dikirim. Garansi replace jika terjadi corrupt/containment breach!",
  currencySymbol: "Rp",
  activeTheme: "limbus" // "limbus" | "lobotomy" | "ruina" | "scp"
};
