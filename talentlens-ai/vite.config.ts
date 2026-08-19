import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, Plugin } from 'vite';
import dotenv from 'dotenv';
import {
  screenResumeWithGemini,
  generateJobSpecWithGemini,
  recruiterCopilotChat,
  isGeminiConfigured,
} from './src/server/geminiService';

dotenv.config();

function geminiApiPlugin(): Plugin {
  return {
    name: 'gemini-api-plugin',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url?.startsWith('/api/gemini/')) {
          return next();
        }

        if (req.method === 'GET' && req.url === '/api/gemini/status') {
          res.setHeader('Content-Type', 'application/json');
          res.statusCode = 200;
          return res.end(
            JSON.stringify({
              configured: isGeminiConfigured(),
              model: 'gemini-3.7-flash',
            })
          );
        }

        let bodyStr = '';
        req.on('data', chunk => {
          bodyStr += chunk;
        });

        req.on('end', async () => {
          try {
            const body = bodyStr ? JSON.parse(bodyStr) : {};
            res.setHeader('Content-Type', 'application/json');

            if (req.url === '/api/gemini/screen-resume') {
              const data = await screenResumeWithGemini(body);
              res.statusCode = 200;
              res.end(JSON.stringify({ success: true, data }));
            } else if (req.url === '/api/gemini/generate-job-spec') {
              const data = await generateJobSpecWithGemini(body);
              res.statusCode = 200;
              res.end(JSON.stringify({ success: true, data }));
            } else if (req.url === '/api/gemini/copilot-chat') {
              const data = await recruiterCopilotChat(body);
              res.statusCode = 200;
              res.end(JSON.stringify({ success: true, data }));
            } else {
              res.statusCode = 404;
              res.end(JSON.stringify({ error: 'Endpoint not found' }));
            }
          } catch (err: any) {
            console.error('API middleware error:', err);
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(
              JSON.stringify({
                success: false,
                error: err.message || 'Internal server error',
              })
            );
          }
        });
      });
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), geminiApiPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      port: 3000,
      host: '0.0.0.0',
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
