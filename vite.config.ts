import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { createRequire } from 'module'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Load environment variables including those without VITE_ prefix
  const env = loadEnv(mode, process.cwd(), '');
  
  // Inject Groq API Key into process.env so it's readable by api/ask.js
  process.env.GROQ_API_KEY = env.GROQ_API_KEY;

  return {
    plugins: [
      react(),
      {
        name: 'api-dev-server',
        configureServer(server) {
          server.middlewares.use((req, res, next) => {
            if (req.url === '/api/ask' && req.method === 'POST') {
              let body = '';
              req.on('data', chunk => {
                body += chunk;
              });
              req.on('end', async () => {
                try {
                  // Connect req body parser
                  (req as any).body = JSON.parse(body);

                  // Mock Vercel response helper methods
                  (res as any).status = (code: number) => {
                    res.statusCode = code;
                    return res;
                  };
                  (res as any).json = (data: any) => {
                    res.setHeader('Content-Type', 'application/json');
                    res.end(JSON.stringify(data));
                    return res;
                  };

                  // Load Vercel serverless handler dynamically using createRequire to bypass Vite transpilation
                  const require = createRequire(import.meta.url);
                  const askHandler = require('./api/ask.cjs');

                  // Run handler
                  await askHandler(req, res);
                } catch (err: any) {
                  console.error('[API Dev Server] Error:', err);
                  res.statusCode = 500;
                  res.setHeader('Content-Type', 'application/json');
                  res.end(JSON.stringify({ error: err.message || 'Internal server error' }));
                }
              });
            } else {
              next();
            }
          });
        }
      }
    ],
  };
})
