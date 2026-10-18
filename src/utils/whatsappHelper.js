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

  let extraDeliveryInfo = '';
  if (orderData.robloxUsername) {
    extraDeliveryInfo += `🎮 Roblox User : ${orderData.robloxUsername}\n`;
  }
  if (orderData.steamTradeUrl) {
    extraDeliveryInfo += `🔗 Steam Trade : ${orderData.steamTradeUrl}\n`;
  }

  const message =
    `═════════════════════════════════\n` +
    `🛒 NEW ORDER - FAUST STORE\n` +
    `Order ID: #${orderData.id}\n` +
    `═════════════════════════════════\n` +
    `👤 Customer    : ${orderData.buyerName || '-'}\n` +
    `📱 Contact / WA : ${orderData.buyerContact || '-'}\n` +
    extraDeliveryInfo +
    `💳 Payment     : ${orderData.paymentMethod || 'QRIS'}\n` +
    `📝 Notes       : ${orderData.notes || '-'}\n\n` +
    `📦 ORDERED ITEMS:\n` +
    `${itemsText}\n\n` +
    `💰 TOTAL AMOUNT: ${formatRupiah(orderData.totalPrice)}\n` +
    `═════════════════════════════════\n` +
    `Hello Faust Store Admin, I have submitted an order on your website. Please provide payment transfer instructions to proceed with fulfillment!`;

  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}
