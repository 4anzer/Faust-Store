# ⚡ THE REQUISITION WING // L-CORP, RUINA & SCP MERCHANT VAULT

Website toko / merchant etalase item in-game lintas semesta yang dirancang khusus untuk memamerkan dan menjual item-item game kamu dengan estetika atmosferik **Limbus Company**, **Library of Ruina**, **Lobotomy Corporation**, dan **SCP Foundation**.

Proyek ini dibuat menggunakan **React + Vite** yang sangat ringan, cepat, dan 100% siap di-hosting langsung di **Vercel** secara gratis.

---

## 🌟 Fitur Utama

1. **4 Tema Interaktif (Project Moon & SCP Universe)**:
   - 🩸 **Limbus Company**: Dominasi warna Crimson Red, Dante Clock motif, dan Mephistopheles dark slate.
   - ⚠️ **Lobotomy Corporation**: Hazard Amber, industrial warning hazard stripes, dan CRT green monitor.
   - 📖 **Library of Ruina**: Deep Midnight Blue, Book of Light gold, dan Angela cyan.
   - 🛡️ **SCP Foundation**: Tactical Terminal Monochrome, O5 Council clearance red accents, dan redacted classification.

2. **Pengelompokan & Filter Berdasarkan Game yang Dimainkan**:
   - Filter cepat berdasarkan game: *Limbus Company*, *Library of Ruina*, *Lobotomy Corp*, *SCP Foundation*, *Genshin Impact*, *Honkai*, *Roblox*, *CS2*, dll.
   - Filter tingkat bahaya/kelangkaan (Threat Level): **ALEPH, WAW, HE, TETH, ZAYIN** (Project Moon) & **KETER, EUCLID, SAFE** (SCP Foundation).
   - Pencarian instan (nama item, tag, spesifikasi, dan deskripsi).
   - Filter ketersediaan stok & pengurutan harga.

3. **Panel Admin / Overseer Console (Bisa Isi & Edit Barang Sendiri)**:
   - Klik tombol **"KELOLA BARANG"** di pojok kanan atas untuk membuka terminal admin.
   - **Tambah Item Baru**: Nama item, pilih game (atau buat game baru), threat level, harga, stok, upload gambar langsung dari HP/PC atau via link URL, deskripsi lore, dan metadata spesifikasi (misal: Faction, Tipe Damage, Garansi).
   - **Edit & Hapus Item**: Langsung perbarui stok atau harga tanpa perlu menyentuh kode.
   - **Kelola Kategori Game**: Tambahkan game baru apa saja yang sedang kamu mainkan.
   - **Pengaturan Toko & Kontak**: Ubah Nama Toko, No WhatsApp penerima order, username Discord, pengumuman darurat, dan metode pembayaran (QRIS, BCA, DANA, GoPay, dll).

4. **Sistem Pemesanan Langsung (Instant Checkout)**:
   - **Order via WhatsApp**: Otomatis membuat format chat rapi berisikan nama barang, jumlah, game, total harga, dan metode pembayaran yang siap dikirim langsung ke WhatsApp kamu.
   - **Salin Tiket Discord**: Menghasilkan format kode markdown rapi yang siap di-paste ke channel tiket / DM Discord.

5. **Efek Suara Terminal (Synthesized Web Audio API)**:
   - Efek suara klik mekanikal, alarm anomali, dan glitch tanpa perlu download file audio luar (ringan dan tanpa delay). Bisa di-mute kapan saja dengan tombol volume.

6. **Backup & Restore Data (JSON)**:
   - Export seluruh katalog item kamu ke file `.json`.
   - Restore kembali kapan pun jika berpindah perangkat atau browser.

---

## 🚀 Cara Menjalankan di Komputer Lokal

1. Buka terminal di folder proyek:
   ```bash
   npm install
   npm run dev
   ```
2. Buka link lokal yang muncul di terminal (biasanya `http://localhost:5173`).

---

## 🌐 Cara Deploy / Hosting ke Vercel (Gratis)

Website ini sudah dilengkapi dengan konfigurasi `vercel.json` sehingga langsung bisa di-deploy:

1. **Upload folder ini ke GitHub**:
   - Buat repository baru di [GitHub](https://github.com).
   - Upload / push semua file proyek ke repository tersebut.
2. **Buka Vercel**:
   - Masuk ke [vercel.com](https://vercel.com) dan login dengan akun GitHub kamu.
   - Klik **"Add New Project"** dan pilih repository yang baru kamu buat.
3. **Deploy**:
   - Framework preset akan otomatis terdeteksi sebagai **Vite**.
   - Klik tombol **"Deploy"**.
4. Selesai! Dalam ~1 menit toko kamu sudah aktif dengan link seperti `https://nama-toko-kamu.vercel.app`.

---

## 📂 Struktur File Utama

- `src/data/defaultData.js` : Database bawaan item, kategori game, threat level, dan profil toko.
- `src/context/CatalogContext.jsx` : State management inventaris & sinkronisasi localStorage.
- `src/components/Header.jsx` : Navigasi atas, pengubah tema, audio toggle, dan tombol keranjang.
- `src/components/Banner.jsx` : Banner status terminal, pengumuman broadcast, dan badge pembayaran.
- `src/components/FilterBar.jsx` : Tab kategori game, search bar, dan filter kelangkaan.
- `src/components/ItemCard.jsx` : Kartu item anomali dengan badge threat level dan indikator stok.
- `src/components/ItemModal.jsx` : Dossier detail spesifikasi item dan tombol beli langsung.
- `src/components/CartModal.jsx` : Manifest keranjang belanja & generator pesan WhatsApp/Discord.
- `src/components/AdminModal.jsx` : Panel admin untuk tambah/edit item, game, kontak, dan backup.
- `src/utils/soundEffects.js` : Generator audio Web Audio API atmosferik.
