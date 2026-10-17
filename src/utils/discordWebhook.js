// Helper to send new order notifications to Discord Webhook
export async function sendDiscordOrderNotification(webhookUrl, orderData) {
  if (!webhookUrl || !webhookUrl.trim().startsWith('https://discord.com/api/webhooks/')) {
    console.log("Discord Webhook not configured or invalid URL.");
    return { success: false, reason: "No valid webhook URL" };
  }

  try {
    const itemsDescription = orderData.items
      .map((item, idx) => `**${idx + 1}. ${item.name}**\n• Game: ${item.game}\n• Jumlah: ${item.quantity}x @ Rp ${Number(item.price).toLocaleString('id-ID')}\n• Subtotal: Rp ${(item.price * item.quantity).toLocaleString('id-ID')}`)
      .join('\n\n');

    const payload = {
      username: "Faust Store Notifier",
      avatar_url: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=200",
      content: `🚨 **PESANAN BARU MASUK DI FAUST STORE!** 🚨`,
      embeds: [
        {
          title: `📦 Order #${orderData.id.slice(-6).toUpperCase()}`,
          color: 0xE63946, // Crimson red accent
          description: `Ada pelanggan baru yang melakukan pemesanan tanpa akun. Berikut rinciannya:`,
          fields: [
            {
              name: "👤 Nama Pembeli",
              value: orderData.buyerName || "Anonim",
              inline: true
            },
            {
              name: "📱 Kontak / WhatsApp",
              value: orderData.buyerContact || "-",
              inline: true
            },
            {
              name: "💳 Metode Pembayaran",
              value: orderData.paymentMethod || "QRIS",
              inline: true
            },
            {
              name: "🛒 Daftar Barang",
              value: itemsDescription || "Tidak ada rincian item",
              inline: false
            },
            {
              name: "💰 Total Pembayaran",
              value: `**Rp ${Number(orderData.totalPrice).toLocaleString('id-ID')}**`,
              inline: true
            },
            {
              name: "📝 Catatan Pembeli",
              value: orderData.notes || "-",
              inline: true
            },
            {
              name: "🕒 Waktu Order",
              value: new Date(orderData.createdAt).toLocaleString('id-ID'),
              inline: false
            }
          ],
          footer: {
            text: "Faust Store // In-Game Merchant System"
          },
          timestamp: new Date().toISOString()
        }
      ]
    };

    const response = await fetch(webhookUrl.trim(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (response.ok) {
      return { success: true };
    } else {
      const errorText = await response.text();
      console.error("Discord Webhook Error:", errorText);
      return { success: false, reason: errorText };
    }
  } catch (err) {
    console.error("Failed to send Discord webhook:", err);
    return { success: false, reason: err.message };
  }
}

// Test webhook function for admin settings
export async function testDiscordWebhook(webhookUrl) {
  if (!webhookUrl || !webhookUrl.trim().startsWith('https://discord.com/api/webhooks/')) {
    return { success: false, message: "URL Webhook harus berawalan https://discord.com/api/webhooks/..." };
  }

  try {
    const response = await fetch(webhookUrl.trim(), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: "Faust Store Notifier",
        content: "✅ **Tes Koneksi Webhook Berhasil!** Faust Store siap mengirimkan notifikasi pesanan pelanggan ke server Discord ini."
      })
    });

    if (response.ok) {
      return { success: true, message: "Pesan tes berhasil terkirim ke Discord!" };
    } else {
      return { success: false, message: `Gagal mengirim ke Discord (Status: ${response.status})` };
    }
  } catch (err) {
    return { success: false, message: `Error koneksi: ${err.message}` };
  }
}
