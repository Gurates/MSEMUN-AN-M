import { defineConfig, loadEnv, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import { handleEmail } from './netlify/functions/send-email';

function emailApiPlugin(env: NodeJS.ProcessEnv): Plugin {
  return {
    name: 'email-api-plugin',
    configureServer(server) {
      server.middlewares.use('/api/send-email', async (req, res, next) => {
        try {
          const chunks = [];
          for await (const chunk of req) chunks.push(Buffer.from(chunk));
          const response = await handleEmail({
            httpMethod: req.method || '',
            headers: { authorization: req.headers.authorization },
            body: Buffer.concat(chunks).toString('utf8')
          }, env);
          res.writeHead(response.statusCode, response.headers);
          res.end(response.body);
        } catch (error) {
          next(error);
        }
      });
    }
  };
}

export default defineConfig(({ mode }) => ({
  envPrefix: ['VITE_SUPABASE_URL', 'VITE_SUPABASE_ANON_KEY', 'VITE_SENDER_'],
  plugins: [react(), emailApiPlugin({ ...loadEnv(mode, process.cwd(), ''), ...process.env })],
  server: { port: 5173, host: true }
}));
