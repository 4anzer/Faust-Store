// Default database for Faust Store
// In-game store catalog synchronized with verified merchant inventory

export const DEFAULT_GAMES = [
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
    desc: "SCP Kelas Menengah"
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
    "name": "MP5-SD | Liquidation (Factory New)",
    "game": "Steam / CS2",
    "threat": "ZAYIN",
    "price": 2000,
    "currency": "Rp",
    "stock": 0,
    "tag": "Item / Senjata",
    "image": "https://community.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL8jsPz-R1Y-s2jePF-JM-CG26TytF6ufB8Ri2ygRQovQKJk4jxNWXBOgUmDsN5FrIM5xi4lIHgNe7q51Pdi4pGni-t2ntA5ids5LxRVPUj5OSJ2Kcl14st",
    "description": "",
    "deliveryMethod": "Pengiriman instan via chat langsung.",
    "featured": false,
    "properties": [
      {
        "label": "Status",
        "value": "Ready"
      }
    ],
    "id": "item-1792332836001"
  },
  {
    "name": "Shinobi God (Infinite Dreams) / Madara - Anime Vanguard",
    "game": "Roblox",
    "threat": "HE",
    "price": 15000,
    "currency": "Rp",
    "stock": 10,
    "tag": "Unit",
    "image": "https://static.wikitide.net/vanguardswiki/7/74/Shinobi_God_%28Infinite_Dreams%29.png",
    "description": "IND Proses 1-5 Menit Akun Wajib Sudah Level 50 Unit akan Dikasih Via Trade Penjual Akan Mengirimkan Link Private Server Ke Pembeli/Bisa Juga Add Friend ENG Progress 1-5 Minutes Only Account must already be level 50 Unit will be given via trade The seller will send a private server link to the buyer / can also add as a friend",
    "deliveryMethod": "Pengiriman instan via chat langsung.",
    "featured": false,
    "properties": [
      {
        "label": "Status",
        "value": "Ready"
      }
    ],
    "id": "item-1792332741702"
  },
  {
    "name": "Ice Queen (Release) / Rukia - Anime Vanguards",
    "game": "Roblox",
    "threat": "ZAYIN",
    "price": 10000,
    "currency": "Rp",
    "stock": 5,
    "tag": "Unit",
    "image": "https://static.wikitide.net/vanguardswiki/5/56/Ice_Queen_%28Release%29.png",
    "description": "IND\nProses 1-5 Menit\nAkun Wajib Sudah Level 50\nUnit akan Dikasih Via Trade\nPenjual Akan Mengirimkan Link Private Server Ke Pembeli/Bisa Juga Add Friend\n\nENG\nProgress 1-5 Minutes Only\nAccount must already be level 50\nUnit will be given via trade\nThe seller will send a private server link to the buyer / can also add as a friend",
    "deliveryMethod": "Pengiriman instan via chat langsung.",
    "featured": false,
    "properties": [
      {
        "label": "Status",
        "value": "Ready"
      }
    ],
    "id": "item-1792332654712"
  },
  {
    "name": "Sukuna Vs Gojo Vanguard | Anime Vanguard",
    "game": "Roblox",
    "threat": "ZAYIN",
    "price": 10000,
    "currency": "Rp",
    "stock": 4,
    "tag": "Unit",
    "image": "https://static.wikitide.net/vanguardswiki/6/6e/Today%27s_Strongest_vs_History%27s_Strongest.png",
    "description": "IND\nProses 1-5 Menit\nAkun Wajib Sudah Level 50\nUnit akan Dikasih Via Trade\nPenjual Akan Mengirimkan Link Private Server Ke Pembeli/Bisa Juga Add Friend\n\nENG\nProgress 1-5 Minutes Only\nAccount must already be level 50\nUnit will be given via trade\nThe seller will send a private server link to the buyer / can also add as a friend",
    "deliveryMethod": "Pengiriman instan via chat langsung.",
    "featured": false,
    "properties": [
      {
        "label": "Status",
        "value": "Ready"
      }
    ],
    "id": "item-1792332570114"
  }
];

export const DEFAULT_MERCHANT_PROFILE = {
  shopName: "Faust Store",
  subtitle: "Trusted In-Game Item Store",
  sellerTag: "VERIFIED MERCHANT",
  logoUrl: "/logo.png",
  whatsapp: "6281338389133",
  discord: "kaizerfaust",
  discordWebhook: "https://discord.com/api/webhooks/1561067399795445852/2REoJTHuzuERa_GSwx6mDBsK9U79nBCshe9p1bkhNvz03DFDKfuxhh0UChCJR-HW105q",
  telegram: "@FaustStore",
  paymentMethods: ["QRIS", "BNI", "BCA", "DANA", "GoPay", "ShopeePay", "Steam Wallet"],
  announcement: "📢 Welcome to Faust Store! Place your order directly—no account creation required.",
  currencySymbol: "Rp",
  isOpen: true
};

export const DEFAULT_ORDERS = [
  {
    id: "ORD-94812",
    buyerName: "Customer#572093421",
    buyerContact: "In-App Live Chat (No WhatsApp)",
    paymentMethod: "QRIS",
    notes: "Testing V2",
    totalPrice: 12000,
    status: "Selesai",
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    items: [
      {
        id: "item-1792332570114",
        name: "Sukuna Vs Gojo Vanguard | Anime Vanguard",
        game: "Roblox",
        price: 10000,
        quantity: 1
      },
      {
        id: "item-1792332836001",
        name: "MP5-SD | Liquidation (Factory New)",
        game: "Steam / CS2",
        price: 2000,
        quantity: 1
      }
    ]
  }
];

export const DEFAULT_REVIEWS = [
  {
    id: "REV-101",
    orderId: "ORD-94812",
    customerName: "Customer#664631713",
    game: "Roblox",
    rating: 5,
    comment: "Super fast Roblox trade! Seller joined in less than 2 minutes. Very trusted and legit!",
    createdAt: new Date(Date.now() - 3600000 * 3).toISOString()
  },
  {
    id: "REV-102",
    orderId: "ORD-94801",
    customerName: "Customer#819342017",
    game: "Steam / CS2",
    rating: 5,
    comment: "Steam Trade URL offer came through instantly. Smooth checkout without making an account.",
    createdAt: new Date(Date.now() - 3600000 * 8).toISOString()
  },
  {
    id: "REV-103",
    orderId: "ORD-94788",
    customerName: "Customer#448109254",
    game: "Roblox",
    rating: 5,
    comment: "Top notch service! Fast response on WhatsApp and quick verification. 10/10.",
    createdAt: new Date(Date.now() - 3600000 * 18).toISOString()
  },
  {
    id: "REV-104",
    orderId: "ORD-94770",
    customerName: "Customer#923814670",
    game: "Roblox",
    rating: 5,
    comment: "Barang aman, fast respond banget adminnya. Recommended seller buat item game!",
    createdAt: new Date(Date.now() - 3600000 * 32).toISOString()
  },
  {
    id: "REV-105",
    orderId: "ORD-94755",
    customerName: "Customer#372951486",
    game: "Steam / CS2",
    rating: 5,
    comment: "Fast Steam delivery, skin received exactly as described. Will buy again here.",
    createdAt: new Date(Date.now() - 3600000 * 45).toISOString()
  }
];
