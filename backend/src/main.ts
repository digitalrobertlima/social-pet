import Fastify from 'fastify';
import cors from '@fastify/cors';
import formbody from '@fastify/formbody';
import rateLimit from '@fastify/rate-limit';
import { submissionRoutes } from './routes/submissions.js';

const app = Fastify({ logger: true });

await app.register(cors, { origin: true });
await app.register(formbody);
await app.register(rateLimit, { max: 100, timeWindow: '1 minute' });

app.get('/health', async () => ({ status: 'ok', uptime: process.uptime() }));

await app.register(submissionRoutes, { prefix: '/api' });

const PORT = Number(process.env.PORT || 3000);
app.listen({ port: PORT, host: '0.0.0.0' }).catch((err) => {
  app.log.error(err);
  process.exit(1);
});
