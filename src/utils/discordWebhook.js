// Helper to send order notifications and diagnostic test messages to Discord Webhook
// Powered by Carmen (Project Moon) character persona and high-detail embeds

export const CARMEN_AVATAR_URL = "https://static.wikia.nocookie.net/library-of-ruina/images/8/84/CarmenFullBody.png";
export const CARMEN_FALLBACK_AVATAR = "https://static.wikia.nocookie.net/limbuscompany/images/5/58/Carmen_LibraryofRuina_StandingSprite.png";

/**
 * Validates if the given string is a valid Discord webhook URL
 */
export function isValidDiscordWebhookUrl(url) {
  if (!url || typeof url !== 'string') return false;
  const clean = url.trim();
  return (
    clean.startsWith('https://discord.com/api/webhooks/') ||
    clean.startsWith('https://discordapp.com/api/webhooks/') ||
    clean.startsWith('https://webhook.lewisakura.moe/api/webhooks/')
  );
}

/**
 * Multi-tier webhook dispatcher to bypass browser CORS restrictions:
 * 1. Vite Local Dev/Preview Proxy (/api/discord-proxy)
 * 2. Dedicated Webhook Proxy for Discord (webhook.lewisakura.moe)
 * 3. Direct fetch fallback
 */
async function dispatchWebhookPayload(webhookUrl, payload) {
  const cleanUrl = webhookUrl.trim();
  let errors = [];

  // Tier 1: Try Local Vite dev server proxy
  try {
    const localRes = await fetch('/api/discord-proxy', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ webhookUrl: cleanUrl, payload })
    });

    if (localRes.ok) {
      return { success: true, method: 'local-proxy' };
    } else {
      const errText = await localRes.text();
      // If endpoint doesn't exist (e.g. running outside Vite dev server), continue to Tier 2
      if (localRes.status !== 404) {
        errors.push(`Local proxy error (${localRes.status}): ${errText}`);
      }
    }
  } catch (err) {
    // Local proxy not reachable (e.g. static host without Vite backend)
  }

  // Tier 2: Dedicated Discord CORS relay proxy (lewisakura.moe)
  try {
    const proxiedUrl = cleanUrl
      .replace('https://discord.com/api/webhooks/', 'https://webhook.lewisakura.moe/api/webhooks/')
      .replace('https://discordapp.com/api/webhooks/', 'https://webhook.lewisakura.moe/api/webhooks/');

    const relayRes = await fetch(proxiedUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (relayRes.ok) {
      return { success: true, method: 'dedicated-proxy' };
    } else {
      const errText = await relayRes.text();
      errors.push(`Proxy error (${relayRes.status}): ${errText}`);
    }
  } catch (err) {
    errors.push(`Relay error: ${err.message}`);
  }

  // Tier 3: Direct attempt (works in non-browser or CORS-relaxed environments)
  try {
    const directRes = await fetch(cleanUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (directRes.ok) {
      return { success: true, method: 'direct' };
    } else {
      const errText = await directRes.text();
      errors.push(`Direct error (${directRes.status}): ${errText}`);
    }
  } catch (err) {
    errors.push(`Direct network error: ${err.message}`);
  }

  return {
    success: false,
    reason: errors.length > 0 ? errors.join(' | ') : 'Koneksi ke Discord terputus karena proteksi CORS browser.'
  };
}

/**
 * Format Indonesian Rupiah
 */
function formatRupiah(amount) {
  return `Rp ${Number(amount || 0).toLocaleString('id-ID')}`;
}

/**
 * Format clean WhatsApp phone link
 */
function cleanPhoneForLink(phone) {
  if (!phone) return null;
  let clean = phone.replace(/\D/g, '');
  if (clean.startsWith('0')) {
    clean = '62' + clean.slice(1);
  }
  return clean;
}

/**
 * Send a rich, detailed order notification to Discord via Carmen Persona
 */
export async function sendDiscordOrderNotification(webhookUrl, orderData) {
  if (!isValidDiscordWebhookUrl(webhookUrl)) {
    console.warn("Discord Webhook not configured or URL invalid.");
    return { success: false, reason: "URL Discord Webhook tidak valid atau belum diisi." };
  }

  try {
    const cleanPhone = cleanPhoneForLink(orderData.buyerContact);
    const waLink = cleanPhone ? ` • [Chat WhatsApp](https://wa.me/${cleanPhone})` : '';
    const orderTimestamp = orderData.createdAt ? new Date(orderData.createdAt) : new Date();
    const unixTimestamp = Math.floor(orderTimestamp.getTime() / 1000);

    // Format list of ordered items cleanly with emojis & details
    const formattedItems = (orderData.items || []).map((item, idx) => {
      const unitPrice = formatRupiah(item.price);
      const subtotal = formatRupiah(item.price * item.quantity);
      const gameTag = item.game ? `🎮 *${item.game}*` : '📦 *Item*';
      const variantInfo = item.selectedOption ? ` • Opsi: \`${item.selectedOption}\`` : '';
      return `**${idx + 1}. ${item.name}**\n   └ ${gameTag} • **${item.quantity}x** @ ${unitPrice}${variantInfo}\n   └ Subtotal: **${subtotal}**`;
    }).join('\n\n');

    const totalAmount = formatRupiah(orderData.totalPrice);
    const orderIdCode = orderData.id ? orderData.id.replace('ORD-', '') : 'NEW';

    const payload = {
      username: "Carmen • Faust Store Notifier",
      avatar_url: CARMEN_AVATAR_URL,
      content: `🔔 **PESANAN BARU MASUK DARI PELANGGAN!** (Order \`#${orderIdCode}\`)`,
      embeds: [
        {
          title: `📦 Order #${orderIdCode} — ${orderData.buyerName || 'Pelanggan'}`,
          description: `> *"Dengarkan suara dari dalam Cahaya... Sebuah pesanan baru telah berhasil dibuat dan siap untuk diproses oleh merchant."*\n> — **Carmen (Project Moon)**\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
          color: 0xC41E3A, // Project Moon Carmen Crimson
          thumbnail: {
            url: CARMEN_AVATAR_URL
          },
          fields: [
            {
              name: "👤 Data Pelanggan",
              value: `**Nama:** ${orderData.buyerName || 'Anonim'}\n**Kontak/WA:** \`${orderData.buyerContact || '-'}\`${waLink}\n**Metode Bayar:** \`${orderData.paymentMethod || 'QRIS'}\``,
              inline: true
            },
            {
              name: "📊 Status & Tagihan",
              value: `**Status:** 🟡 \`${orderData.status || 'Pending'}\`\n**Total Pembayaran:**\n### 💰 **${totalAmount}**`,
              inline: true
            },
            {
              name: `🛒 Rincian Barang (${orderData.items?.length || 0} Item)`,
              value: formattedItems || "_Tidak ada rincian item dalam pesanan._",
              inline: false
            },
            {
              name: "📝 Catatan Khusus Pelanggan",
              value: orderData.notes && orderData.notes.trim() 
                ? `\`\`\`text\n${orderData.notes.trim()}\n\`\`\`` 
                : "_Tidak ada catatan tambahan dari pembeli._",
              inline: false
            },
            {
              name: "🕒 Waktu Transaksi",
              value: `<t:${unixTimestamp}:F> (<t:${unixTimestamp}:R>)`,
              inline: true
            },
            {
              name: "⚡ Tindakan Merchant",
              value: "Segera cek WhatsApp pembeli & update status order ke **Selesai** di Dashboard Faust Store.",
              inline: true
            }
          ],
          footer: {
            text: "Faust Store // Project Moon Merchant Engine • Dispatched by Carmen",
            icon_url: CARMEN_AVATAR_URL
          },
          timestamp: new Date().toISOString()
        }
      ]
    };

    const result = await dispatchWebhookPayload(webhookUrl, payload);
    if (!result.success) {
      console.error("Failed to dispatch Discord order notification:", result.reason);
    }
    return result;

  } catch (err) {
    console.error("Error building Discord order notification:", err);
    return { success: false, reason: err.message };
  }
}

/**
 * Send an interactive, stylish diagnostic test message to verify the webhook
 */
export async function testDiscordWebhook(webhookUrl) {
  if (!isValidDiscordWebhookUrl(webhookUrl)) {
    return {
      success: false,
      message: "Format URL Webhook tidak valid! Harus berawalan https://discord.com/api/webhooks/..."
    };
  }

  try {
    const unixTimestamp = Math.floor(Date.now() / 1000);

    const testPayload = {
      username: "Carmen • Faust Store Notifier",
      avatar_url: CARMEN_AVATAR_URL,
      content: "✨ **UJI KONEKSI DISCORD WEBHOOK FAUST STORE**",
      embeds: [
        {
          title: "🌸 Gelombang Transmisi Carmen Terhubung!",
          description: `> *"Aku telah mendengar panggilanmu. Saluran komunikasi antara Faust Store dan server Discord ini telah tersambung dengan sempurna. Mulai sekarang, setiap ada pesanan masuk, aku akan membawakannya langsung kepadamu."*\n> — **Carmen (Project Moon)**\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
          color: 0x2ECC71, // Radiant Emerald Green for Successful Test
          thumbnail: {
            url: CARMEN_AVATAR_URL
          },
          fields: [
            {
              name: "📡 Status Koneksi",
              value: "🟢 **AKTIF & SIAP PAKAI**",
              inline: true
            },
            {
              name: "🤖 Asisten Notifier",
              value: "**Carmen** *(Project Moon)*",
              inline: true
            },
            {
              name: "⚡ Waktu Pengetesan",
              value: `<t:${unixTimestamp}:F>`,
              inline: false
            },
            {
              name: "🎯 Informasi Sistem",
              value: "Sistem Faust Store siap mengirimkan rincian pesanan pembeli (nama, nomor WA, daftar item, total pembayaran & catatan) secara instan ke channel ini.",
              inline: false
            }
          ],
          footer: {
            text: "Faust Store Diagnostics // Carmen Dispatch Unit",
            icon_url: CARMEN_AVATAR_URL
          },
          timestamp: new Date().toISOString()
        }
      ]
    };

    const result = await dispatchWebhookPayload(webhookUrl, testPayload);

    if (result.success) {
      return {
        success: true,
        message: "✅ Pesan tes Carmen berhasil dikirim ke server Discord kamu! Periksa channel Discord kamu sekarang."
      };
    } else {
      return {
        success: false,
        message: `❌ Gagal mengirim ke Discord: ${result.reason}`
      };
    }

  } catch (err) {
    return {
      success: false,
      message: `❌ Terjadi kesalahan: ${err.message}`
    };
  }
}
