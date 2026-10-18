import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// Custom Vite plugin to proxy Discord Webhooks on local dev server to bypass browser CORS
function discordProxyPlugin() {
  const handler = async (req, res) => {
    if (req.method === 'POST') {
      let body = '';
      req.on('data', chunk => { body += chunk; });
      req.on('end', async () => {
        try {
          const { webhookUrl, payload } = JSON.parse(body);
          if (!webhookUrl || typeof webhookUrl !== 'string') {
            res.statusCode = 400;
            res.setHeader('Content-Type', 'application/json');
            return res.end(JSON.stringify({ error: 'Webhook URL is required' }));
          }

          const discordRes = await fetch(webhookUrl.trim(), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });

          const responseText = await discordRes.text();
          res.statusCode = discordRes.status;
          res.setHeader('Content-Type', 'application/json');
          res.end(responseText || JSON.stringify({ success: discordRes.ok }));
        } catch (err) {
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: err.message }));
        }
      });
    } else {
      res.statusCode = 405;
      res.end();
    }
  };

  return {
    name: 'discord-proxy-plugin',
    configureServer(server) {
      server.middlewares.use('/api/discord-proxy', handler);
    },
    configurePreviewServer(server) {
      server.middlewares.use('/api/discord-proxy', handler);
    }
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), discordProxyPlugin()],
})

