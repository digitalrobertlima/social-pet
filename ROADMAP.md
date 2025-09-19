# ROADMAP

Visão evolutiva do projeto Social Pet. As versões e itens podem sofrer ajustes conforme feedback operacional.

## Princípios
- Simplicidade progressiva: iniciar mínimo funcional, evoluir modularmente.
- Privacidade primeiro: dados locais até confirmação de envio/consentimento explícito.
- Acessibilidade contínua: cada release melhora contrastes, navegação, ARIA.
- Observabilidade futura: logs mínimos cliente → opcional backend.

## Macro Releases
| Versão | Objetivo Central | Principais Entregas |
|--------|------------------|----------------------|
| v0.0.2 | Base single-file | Fluxo P0..P6, pricing, WhatsApp, export, impressão |
| v0.1   | PWA Offline      | Manifest, SW cache shell + fallback, ícones, version stamp |
| v0.2   | Calendário & Capacidade | Bloqueio dias lotados, algoritmos por porte, waitlist persistida |
| v0.3   | Uploads Saúde    | Upload multi-arquivo (imagens/pdf), compressão & preview, validação MIME |
| v0.4   | Painel Local     | Dash estatístico local (IndexedDB), filtros, gráficos simples |
| v0.5   | Backend Ingest   | API ingest (Fastify/Edge), fila, token simples, envio estruturado |
| v0.6   | Notificações     | E-mail / WhatsApp template (WABA ou provedor), status de reserva |
| v0.7   | Pagamentos       | Integração gateway (PIX dynamic / cartão), reconciliação manual |
| v0.8   | Multicanal       | Portal tutor (link seguro), atualizações status em tempo real |
| v0.9   | Compliance Avançado | Retenção & anonimização, trilhas auditoria |
| v1.0   | Release Pública  | Hardening, testes e2e, documentação completa |

## Backlog Detalhado (Por Tema)
### UX / UI
- Barra de progresso com porcentagem real (campos válidos / total)
- Mensagem WhatsApp detalhada opcional (multi-linha) + compacta
- Modo alta densidade para desktop (reduzir espaçamento vertical)
- Atalhos teclado: Alt+→ / Alt+← navegação passos

### Acessibilidade
- Foco visível aprimorado (outline adaptativo)
- Anúncio de mudança de etapa via `aria-live`
- Validações multimodais (texto + ícone + cor)
- Testes com leitor NVDA/Orca script checklist

### Dados & Persistência
- Migração `localStorage` → IndexedDB para anexos
- Versionamento de schema (ex: `schemaVersion:2`)
- Export ZIP (JSON + anexos) opcional

### Pricing & Regras
- Tabela dinâmica por porte / período (alta vs baixa temporada)
- Mínimo de diária (ex: 1.5 arredonda para 2)
- Regras feriado nacional (surcharge configurável)
- Engine declarativa (JSON de regras carregado dinamicamente)

### Capacidade & Agenda
- Algoritmo de slotting por faixa horária
- Diferenciação creche meio-período vs integral
- Painel ocupação (Heatmap)
- Lista espera priorizada (tempo + tipo serviço + fidelidade)

### Uploads / Arquivos
- Compressão: canvas/WebCodecs fallback
- Hash rápido (xxhash/sha-256) para dedupe
- EXIF wipe automático
- Pré-assinatura futura (S3 / R2) – stub interface

### Segurança / Privacidade
- Criptografia local opcional (senha do tutor) – chave derivada PBKDF2
- Anti-tamper hash no payload final antes do envio
- Política de retenção configurável (auto purge X dias)

### Observabilidade
- Logger leve (buffer circular) + export
- Módulo métricas (tempo em cada passo, abandono) apenas local
- Preparar envelope para backend (/ingest) opcional

### Backend (Futuro)
- Endpoint `/ingest` valida assinatura + quota diária
- Fila persistente (SQLite/Prisma) – flush assíncrono
- Painel staff (login, RBAC simples) ver reservas

### Testes & Qualidade
- Script sanity automatizado (já base) + checks de regressão
- Teste de performance Lighthouse (budget CI)
- Teste e2e (Playwright) simulação fluxo completo
- Teste de impressão (snapshot PDF) – pipeline opcional

### Performance
- Budget JS < 90KB gzip (single-file siga otimizações)
- Lazy init de módulos (ex: pricing sob demanda)
- Pré-cálculo diff para export CSV incremental
- Cache de elementos (micro-otimizações DOM)

### Internacionalização
- Preparar tabela de strings (pt-BR -> en-US)
- Formatação datas local adaptável

### Documentação
- Guia contribuição (CONTRIBUTING.md)
- ADRs principais (decisões arquiteturais)
- Esquema JSON público (schema.json)

## Riscos / Mitigações
| Risco | Impacto | Mitigação |
|-------|---------|-----------|
| Crescimento de complexidade no single-file | Manutenibilidade | Modularizar ao introduzir SW (split em v0.1 sem quebrar) |
| Armazenamento local corrompido | Perda de dados | Backups export JSON incentivados, validações ao load |
| Limite WhatsApp mensagem | Truncar informações | Versão compacta + detalhada via PDF |
| Fuga de escopo precoce (backend) | Atrasos | Gate por milestone (não iniciar antes v0.5) |

## Métricas de Sucesso (Inicial)
- Conversão: % formulários que geram WhatsApp > 60%
- Média pets por tutor: monitorar (ajusta pricing)
- Erros de validação por fluxo: < 3 médios
- Tempo médio preenchimento: < 6 min

## Critérios para v1.0
- PWA completo + offline de formulários + anexos
- Backend ingest estável + autenticação básica
- Testes e2e críticos > 90% pass rate em CI
- Documentação (README principal + CONTRIBUTING + CHANGELOG) atualizada
- Política de retenção implementada

---
Atualize este roadmap a cada release (link no CHANGELOG). Sugestões podem ser promovidas a issues numeradas.
