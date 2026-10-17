// Helper function to build dynamic, URL-encoded WhatsApp links for customer CTA

/**
 * Clean phone number to international format without symbols
 * Example: '08123456789' -> '628123456789'
 */
export function sanitizeWhatsAppNumber(phone) {
  if (!phone) return '';
  const digits = phone.replace(/[^0-9]/g, '');
  if (digits.startsWith('0')) {
    return '62' + digits.slice(1);
  }
  return digits;
}

/**
 * Format currency into IDR
 */
export function formatRupiah(amount) {
  if (typeof amount === 'number') {
    return `Rp ${amount.toLocaleString('id-ID')}`;
  }
  return `Rp ${amount}`;
}

/**
 * Structure 1: Direct Item Inquiry / Order WhatsApp Link
 */
export function createDirectItemWhatsAppUrl(adminPhone, item) {
  const cleanPhone = sanitizeWhatsAppNumber(adminPhone);
  const message = 
    `Halo Admin Faust Store,\n` +
    `Saya tertarik untuk memesan item berikut:\n\n` +
    `📦 Nama Item : ${item.name}\n` +
    `🎮 Kategori  : ${item.game}\n` +
    `💰 Harga     : ${formatRupiah(item.price)}\n` +
    `📊 Stok      : ${item.stock > 0 ? `${item.stock} Unit Ready` : 'Habis'}\n\n` +
    `Apakah item ini masih tersedia? Mohon info metode pembayaran dan proses pengirimannya ya. Terima kasih!`;

  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}

/**
 * Structure 2: General Customer Support / Tanya Admin Link
 */
export function createGeneralInquiryWhatsAppUrl(adminPhone) {
  const cleanPhone = sanitizeWhatsAppNumber(adminPhone);
  const message = 
    `Halo Admin Faust Store, saya ingin bertanya seputar item in-game dan cara transaksi di toko. Apakah sedang online?`;

  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}

/**
 * Structure 3: Full Cart Checkout Order Link
 */
export function createCartCheckoutWhatsAppUrl(adminPhone, orderData) {
  const cleanPhone = sanitizeWhatsAppNumber(adminPhone);
  
  const itemsText = orderData.items
    .map((item, index) => 
      `${index + 1}. ${item.name} [${item.game}] (${item.quantity}x) - ${formatRupiah(item.price * item.quantity)}`
    )
    .join('\n');

  const message =
    `═════════════════════════════════\n` +
    `🛒 NOTIFIKASI ORDER - FAUST STORE\n` +
    `No. Pesanan: #${orderData.id}\n` +
    `═════════════════════════════════\n` +
    `👤 Pembeli    : ${orderData.buyerName || '-'}\n` +
    `📱 Kontak WA  : ${orderData.buyerContact || '-'}\n` +
    `💳 Pembayaran : ${orderData.paymentMethod || 'QRIS'}\n` +
    `📝 Catatan    : ${orderData.notes || '-'}\n\n` +
    `📦 DAFTAR BARANG YANG DIPESAN:\n` +
    `${itemsText}\n\n` +
    `💰 TOTAL TAGIHAN: ${formatRupiah(orderData.totalPrice)}\n` +
    `═════════════════════════════════\n` +
    `Halo Admin, saya sudah submit pesanan melalui website. Mohon instruksi nomor rekening/QRIS untuk transfer ya!`;

  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}
