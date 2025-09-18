import { describe, it, expect } from 'vitest';
import Fastify from 'fastify';
import { submissionRoutes } from './submissions.js';

function build() {
  const app = Fastify();
  app.register(submissionRoutes, { prefix: '/api' });
  return app;
}

describe('submission routes', () => {
  it('rejects invalid body', async () => {
    const app = build();
    const res = await app.inject({ method: 'POST', url: '/api/submissions', payload: {} });
    expect(res.statusCode).toBe(400);
  });

  it('accepts minimal valid body (avulso)', async () => {
    const app = build();
    const payload = {
      tutorNome: 'Maria',
      tutorTelefone: '31999999999',
      tipoAtendimento: 'avulso',
      pagamento: 'PIX',
      aceiteTermos: true,
      pets: [{ nome: 'Rex', porte: 'Médio' }],
      dataAvulso: '2025-09-18',
      horaAvulso: '10:00',
      tipoAvulso: 'banho'
    };
    const res = await app.inject({ method: 'POST', url: '/api/submissions', payload });
    expect(res.statusCode).toBe(200);
    const json = res.json();
    expect(json).toHaveProperty('id');
    expect(json.data.tutorNome).toBe('Maria');
  });
});
