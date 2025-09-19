# Social Pet v0.0.2 (Base Single-File)

Plataforma (fase inicial) para pré-atendimento de Hotel / Creche / Banho & Tosa canino. Esta versão **v0.0.2** provê um formulário multi-etapas completo em um único arquivo `index.html` (sem dependências externas) com autosave e geração de mensagem compacta para WhatsApp.

> Próxima evolução (v0.1) adicionará Manifest + Service Worker (PWA), cache offline e controle de versão incremental.

## Objetivos Principais
- Single-file `index.html` (< 250 KB) contendo HTML + CSS + JS.
- Fluxo guiado (P0..P6): Consentimento, Tutor, Pets, Serviços, Saúde, Extras/Políticas, Pagamento/Resumo.
- Autosave localStorage por identificador dinâmico (`sp_v001_{telefone|email|anon}`).
- Geração de ID único: `SP-YYYYMMDD-XXX`.
- Cálculo estimado de preço (regras simplificadas) + resumo compacto para WhatsApp.
- Export JSON/CSV + impressão amigável.
- Acessibilidade básica (aria-current, aria-live, foco visível) e tema claro/escuro.
- LGPD: dados somente local até envio manual WhatsApp.

## Arquivos
- `index.html` – Aplicação completa single-file.
- `LICENSE` – Licença MIT.
- `CHANGELOG.md` – Histórico de mudanças.
- `ROADMAP.md` – Visão evolutiva e backlog macro.
- (Futuro) `manifest.json` / `service-worker.js` – PWA (v0.1).
- (Futuro) `deploy.sh`, `.github/PULL_REQUEST_TEMPLATE.md`.

## Uso Local
Abra diretamente o `index.html` no navegador. Não requer build nem servidor.

### Sanity Checks
Console: `window.__runSanityChecks()` → retorna objeto de verificação.

## Regras de Negócio (Resumo Implementado)
- Vacinas obrigatórias confirmadas antes da finalização.
- Capacidade placeholder (futuro: dinâmica por data/porte).
- Pricing: tipo serviço + porte médio + extras (banho/tosa/pacotes) + fds + fidelidade.
- Mensagem WhatsApp compacta para não exceder limite de caracteres.

## Limitações & Próximos Passos
Ver `ROADMAP.md` para evolução detalhada.

## Segurança / Privacidade
- Sem tracking de terceiros.
- Somente armazenamento local até o envio manual.
- Sanitização básica de saída (`escapeHTML`).

## Acessibilidade
- Etapa ativa marcada com `aria-current`.
- Toasts em região `aria-live=assertive`.
- Componentes nativos preservam navegação por teclado.

## Estrutura de Dados (Simplificada)
```jsonc
{
  "consent": { "accepted": true, "marketing": false },
  "tutor": { "nome": "", "telefone": "", "email": "" },
  "pets": [ { "nome": "", "porte": "Médio" } ],
  "services": { "tipoAtendimento": "hotel", "dataEntrada": "", "dataSaida": "" },
  "health": { "vacinasOk": true },
  "extras": { "politicasAceite": true },
  "payment": { "estimativa": 0 },
  "meta": { "id": "SP-20250101-001" }
}
```

## Commits (Sugestão)
`feat:` novas features | `fix:` correções | `chore:` manutenção | `docs:` docs | `refactor:` refatores.

## Deploy (GitHub Pages)
1. Commit na branch principal.
2. Ativar Pages (config -> pages -> branch `main`).
3. Testar URL pública + sanity check.

## Changelog & Roadmap
- Histórico: ver `CHANGELOG.md`.
- Planejamento: ver `ROADMAP.md`.

## Licença
Distribuído sob a licença MIT – ver `LICENSE`.

---
Contribuições e feedback são bem-vindos. Abrir issue para propostas.
