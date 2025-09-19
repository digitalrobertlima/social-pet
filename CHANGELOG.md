# CHANGELOG

Todas as mudanças notáveis deste projeto serão documentadas aqui.
Segue o formato inspirado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/) e versão semântica quando aplicável.

## [Unreleased]
### Adicionado
- Manifest PWA e `service-worker.js` (planejado v0.1)
- Ícones multi-resolução e splash screens
- Modo offline (cache shell + fallback)
- Validações avançadas de calendário e capacidade dinâmica
- Upload de comprovantes de vacinação (compressão client-side)
- Painel local com estatísticas e filtros
- Integração inicial backend ingest (fila submissões)

### Alterado
- Ajustes de UX nas etapas (refinamento microcópia)

### Removido
- (nada ainda)

### Corrigido
- (pendente)

## [0.0.2] - 2025-09-18
### Adicionado
- Aplicação single-file `index.html` com fluxo P0..P6 (Consentimento → Pagamento/Resumo)
- Autosave `localStorage` por telefone/e-mail (`sp_v001_*`)
- Geração de ID `SP-YYYYMMDD-XXX`
- Motor de preço simplificado (tipo + porte + extras + pacotes + fds + fidelidade)
- Exportação JSON e CSV
- Impressão/PDF com seção amigável para ficha
- Mensagem compacta WhatsApp com link direto
- Tema claro/escuro manual + `prefers-color-scheme`
- Sanitização básica de saída (escapeHTML)
- Função de sanity check `window.__runSanityChecks()`
- README inicial (substituído posteriormente por edição manual)

### Alterado
- Reinicialização do repositório (remoção de artefatos antigos PWA e backend)

### Removido
- Arquitetura Fastify/TypeScript anterior (escopo reduzido a estático)
- Manifest & Service Worker temporariamente (serão reintroduzidos em v0.1)

## [0.0.1] - 2025-09-?? (Histórico não preservado)
Versões exploratórias anteriores (Tailwind, depois Bootstrap + PWA) foram descartadas na limpeza para base clara.

---
Legenda de categorias: Adicionado | Alterado | Depreciado | Removido | Corrigido | Segurança
