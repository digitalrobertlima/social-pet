# Social Pet Backend (Early Draft)

Fastify + TypeScript API (futuro). Endpoints atuais:
- `GET /health` – status
- `POST /api/submissions` – valida e ecoa submissão (sem persistência)

## Scripts
- dev: `npm run start:dev`
- build: `npm run build`
- test: `npm test`

## Próximos passos
- Persistir submissões (SQLite ou Postgres)
- Autenticação staff (JWT)
- Rate limiting refinado
- Logging estruturado + request id
