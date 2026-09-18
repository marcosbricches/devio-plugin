# 12 — Memory audit

**What to build:** the viva-maracana auto-memory shrinks to facts: procedures already carried by the knowledge skills are deleted, universal rules already in the global CLAUDE.md are deleted, project facts stay with Why and How-to-apply, duplicates and superseded items go, and `MEMORY.md` indexes what remains, one line each.

**Blocked by:** 02, 03, 04, 05

**Status:** resolved

- [x] Every remaining file is one fact, typed `user`, `feedback`, `project` or `reference`
- [x] No remaining file restates a skill or a CLAUDE.md line
- [x] Around a dozen files or fewer; `MEMORY.md` matches the folder exactly
- [x] The audit result (kept / merged / promoted / deleted, with target) is recorded in this ticket

## Audit result — 2026-09-18

Eighteen files in, eight out. `MEMORY.md` rewritten to match the folder exactly.

### Kept

| File | Type | Why it survives |
| --- | --- | --- |
| `so-o-feedback-de-15-09-vale` | project | Which feedback round governs visual direction — nothing outside this project knows it. Retyped from `feedback`. |
| `feedback-do-cliente-e-sot` | feedback | Conflict between client feedback and an ADR is a list of files to fix, not a reason to argue back. |
| `texto-do-cliente-como-veio` | feedback | The client's own truncation is a content and a layout decision. |
| `composicao-removida-volta-diferente` | feedback | Asking for a removed element back means the old composition failed. |
| `roadmap-atualiza-com-o-ticket` | feedback | The roadmap is the owner's guide; resolving a ticket without marking it is unfinished. |

### Split out of one file

`troca-de-asset-e-tarefa-curta` carried three facts. Now:

| File | Type | Fact |
| --- | --- | --- |
| `verificacao-proporcional-a-mudanca` | feedback | Verification and doc updates scale with the change. |
| `next-start-cacheia-imagem-otimizada` | project | `next start` serves the optimised image from memory. |
| `sem-prettier-neste-repo` | project | No prettier here; running it rewrites the file. |

### Promoted into the plugin, then deleted

| File | Went to |
| --- | --- |
| `prototipo-se-compoe-do-zero-nao-se-veste` | `cumulative-prototype` — compose in layers, from scratch |
| `recomposicao-e-do-zero-em-camadas` | `cumulative-prototype` — same section |
| `estudar-a-disciplina-antes-de-compor` | `art-direction` — observe → research → compose |
| `subagentes-de-pesquisa-no-sonnet` | `agents/researcher.md` — `model: sonnet` |
| `relatorio-para-cliente-curto-e-embasado` | `client-report` — what a good report contains |
| `chrome-do-mcp-roda-com-reduced-motion` | `measure` — "Browsers that lie about motion" |
| `playwright-mcp-aba-em-segundo-plano` | `measure` — same section |

### Deleted as already in the global CLAUDE.md

`identidade-git-autoria`, `prazo-e-escopo-nao-sao-do-agente`,
`codigo-pronto-pra-uso-sem-pendencia`, `gosto-se-embasa-nao-se-lembra`.

### Deleted as stale

`poda-de-15-09-e-proximo-passo` — a pruning that happened and a next step three
weeks past.

Every `[[link]]` pointing at a deleted file was repointed or removed.
