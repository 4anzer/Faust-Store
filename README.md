# ⚡ FAUST STORE // IN-GAME ITEM & SERVICE MERCHANT

Website toko dan etalase merchant item in-game modern yang menggabungkan estetika atmosferik **Limbus Company, Library of Ruina, Lobotomy Corporation, dan SCP Foundation**. Dirancang agar mudah dipahami oleh pembeli biasa, dilengkapi dengan **Panel Admin lengkap, Notifikasi Discord Webhooks, dan Order List pelanggan tanpa perlu registrasi akun**.

Proyek ini dibuat menggunakan **React + Vite** dan 100% siap di-hosting langsung di **Vercel**.

---

## 🌟 Fitur Baru

1. **Nama Toko: Faust Store**:
   - Branding terpadu dengan palet warna khas Faust: *Deep Obsidian*, *Faust Crimson*, dan *Clockwork Gold*.
   - Tidak ada lagi tombol pengubah tema yang membingungkan; tampilan langsung konsisten, rapi, dan mudah dibaca oleh siapa saja.

2. **Pembelian Tanpa Perlu Buat Akun (Guest Checkout)**:
   - Pelanggan tidak perlu repot daftar akun atau login.
   - Cukup pilih barang -> masukkan ke Keranjang -> isi Nama & No. WhatsApp -> klik **"Konfirmasi Pesanan"**.

3. **Daftar Pesanan Masuk (Order List untuk Admin)**:
   - Setiap transaksi yang dilakukan pembeli akan langsung masuk ke tab **"PESANAN MASUK"** di Panel Admin.
   - Admin bisa melihat nomor order, nama pembeli, nomor WhatsApp (ada tombol 1-klik untuk langsung chat WA pembeli), daftar barang yang dibeli, total harga, metode pembayaran, dan catatan.
   - Admin bisa mengubah status pesanan (*Pending*, *Selesai*, atau *Dibatalkan*).

4. **Notifikasi Otomatis via Discord Webhooks**:
   - Admin dapat memasukkan URL Discord Webhook di tab pengaturan panel admin.
   - Setiap kali ada pesanan baru dari pelanggan, bot Faust Store akan otomatis mengirimkan notifikasi rincian pesanan berformat embed rapi ke channel server Discord admin.
   - Tersedia tombol **"Tes Webhook"** untuk memastikan bot terhubung dengan benar.

5. **Panel Admin Lengkap (Kelola Sendiri)**:
   - **Kelola Barang**: Ubah nama barang, harga (Rp), jumlah stok, tier/kelangkaan, upload foto langsung dari HP/PC atau via link URL, dan deskripsi barang.
   - **Kelola Kategori Game**: Tambahkan kategori game baru (misal: *Genshin*, *Roblox*, *Valorant*, dll) atau hapus kategori game yang tidak diperlukan.
   - **Pengaturan Toko & Kontak**: Ubah nomor WhatsApp admin, username Discord, pengumuman toko, dan metode pembayaran (QRIS, BCA, DANA, GoPay, dll).
   - **Backup & Restore (JSON)**: Simpan seluruh data inventaris dan pesanan ke file `.json`.

---

## 🚀 Menjalankan Secara Lokal

```bash
npm install
npm run dev
```
Buka browser di `http://localhost:5173/`.

---

## 🌐 Deploy Otomatis ke Vercel

Karena repository ini sudah terhubung ke GitHub `Faust-Store`:
Setiap kali ada commit baru yang di-push ke GitHub, Vercel akan **otomatis melakukan build dan update website secara live** dalam hitungan detik!
