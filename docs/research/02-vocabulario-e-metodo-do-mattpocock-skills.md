# Vocabulário e método do pacote mattpocock-skills, e onde o Viva Maracanã diverge

Data: 2026-09-18

## Pergunta

Levantar, em fontes primárias, o vocabulário e o método do pacote `mattpocock-skills` (versão
1.2.3, instalada em `C:\Users\marco\.claude\plugins\cache\mattpocock\mattpocock-skills\1.2.3\`) e
o dicionário aihero.dev, e comparar com o que o repositório Viva Maracanã faz de fato — sem propor
mudança de estrutura, só fato com citação.

---

## 1. Vocabulário — definições com citação

### Smart zone

**Fato documentado.** O termo não é do pacote de skills; é do dicionário aihero.dev, citado por
`ask-matt/SKILL.md` como link. Definição do dicionário (paráfrase fiel do texto extraído de
`raw.githubusercontent.com/mattpocock/dictionary-of-ai-coding/main/README.md`, 2026-09-18): *"O
agente opera de forma ótima no início de uma sessão, com foco e boa recall. Conforme a sessão
cresce, ele desliza para a 'dumb zone', com desempenho em queda. A smart zone tipicamente funciona
bem dentro de aproximadamente 125K–150K tokens em modelos de fronteira."* O pacote de skills usa o
termo sem redefini-lo, só apontando para o dicionário:

> "The limit on this is the **[smart zone](https://www.aihero.dev/ai-coding-dictionary/smart-zone)**:
> the window (~150k tokens on state-of-the-art models) within which the model still reasons
> sharply." — `skills/engineering/ask-matt/SKILL.md:33`

### Tracer bullet

**Fato documentado.** Termo importado de *The Pragmatic Programmer*, usado por `to-tickets` e
`tdd`. Do artigo `aihero.dev/tracer-bullets` (2026-09-18): *"small, end-to-end slice of
functionality that touches all the layers of your system at once"*, com o objetivo de "write code
that gets you feedback as quickly as possible" e evitar "outrunning your headlights" — construir
camada por camada sem validação. No pacote:

> "Break the work into **tracer bullet** tickets. Each slice cuts a narrow but COMPLETE path
> through every layer (schema, API, UI, tests) — vertical, NOT a horizontal slice of one layer... A
> completed slice is demoable or verifiable on its own." — `skills/engineering/to-tickets/SKILL.md:250-256`

> "Horizontal slicing — writing all tests first, then all implementation... Work in **vertical
> slices** instead — one test → one implementation → repeat, each test a **tracer bullet**..." —
> `skills/engineering/tdd/SKILL.md:118`

### Grilling (rounds, frontier, "facts are the agent's job, decisions are yours")

**Fato documentado.** Texto integral do skill (`skills/productivity/grilling/SKILL.md`):

> "Work the tree in **rounds**. The **frontier** is every decision whose prerequisites are already
> settled... Ask the whole frontier in one round... Then wait for the user's answers before the
> next round." (linhas 195-195)
>
> "Finding _facts_ is your job, never the user's. When a frontier question needs a fact from the
> environment (filesystem, tools, etc.), dispatch a sub-agent to find it — don't ask the user for
> anything you could look up yourself... The _decisions_ are the user's — put each to them and
> wait." (linha 207)
>
> "The session is done when the frontier is empty: every branch of the design tree visited, nothing
> left silently assumed." (linha 209)

O dicionário `aihero.dev/skills-grilling` (2026-09-18) confirma com fraseado quase idêntico: *"A
**round** is one frontier, asked in full and answered in full"*; *"Facts are the skill's own job:
when a frontier question needs something the environment can settle, it dispatches a sub-agent...
Decisions are yours, and it must wait for them."*

### Wayfinder (map, decision tickets, claim/resolve, gist)

**Fato documentado.** Do `SKILL.md` (`skills/engineering/wayfinder/SKILL.md`):

- **Map**: "The map is a single issue on this repo's issue tracker, labelled `wayfinder:map`... Its
  tickets are child issues of the map... an **index**, not a store." (linhas 112-116)
- **Ticket**: corpo é só a pergunta ("## Question"), tipado em um de quatro `wayfinder:<type>`:
  `research`, `prototype`, `grilling`, `task` (linha 158; tipos detalhados 166-173).
- **Claim**: "A session **claims** a ticket by assigning it to the dev driving the map, **first**,
  before any work... That assignee _is_ the claim." (linha 160)
- **Resolve**: "post the answer as a **resolution comment**, **close** the issue, and **append a
  context pointer** to the map's Decisions-so-far." (linha 218)
- **Gist**: "the map never restates it, only gists it and links" (linha 116); formato de linha:
  `- [<closed ticket title>](link) — <one-line gist of the answer>` (linha 137)
- **Frontier**: "the open, unblocked, unclaimed children — the edge of the known." (linha 162)
- **Fog of war**: "the dim view of decisions and investigations you can tell are coming but can't
  yet pin down" (linha 177); teste: "whether you can state the question precisely now — _not_
  whether you can answer it now." (linha 181)
- Regra de execução: "**Plan, don't do**... An effort can override this in its **Notes**... absent
  that, produce decisions, not deliverables." (linha 106)
- "**never resolve more than one ticket per session** — with the exception of research tickets."
  (linha 198)

### Phase boundaries (as cinco opções e a ordem)

**Fato documentado.** De `ask-matt/SKILL.md:62-72` e do artigo `aihero.dev/skills-ask-matt`
(2026-09-18, que cita o `PHASE-BOUNDARIES.md` completo):

> "A **phase** is a chunk of work inside a session... At the **boundary** between two of them you
> have five options... **Continue** — stay put. Costs nothing, loses nothing. **`/clear`** — empty
> the window, when nothing here matters to what's next. **`/handoff`** — write a portable markdown
> file. Narrow: only for a **new harness**, a **new directory**, a **colleague**, or forking a side
> task **mid-phase**... **Subagent** — send a tightly-scoped task to its own window and get a
> report back. **`/compact`** — compress this context and seed a fresh session with it. The
> **default**, at the bottom of the tree rather than the first reach."

O artigo (`aihero.dev/skills-ask-matt`) dá a ordem/hierarquia com as mesmas cinco opções e insiste:
*"/compact is the bottom of the tree, not the first reach"*; *"/handoff reads like a general bridge
between windows and it isn't: portability is all it buys."* — ou seja, a ordem privilegia
Continue > `/clear` > `/handoff` (só se portabilidade for o problema) > Subagent > `/compact`
(default residual).

### Handoff

**Fato documentado.** Skill (`skills/productivity/handoff/SKILL.md`): "Write a handoff document
summarising the current conversation so a fresh agent can continue the work. Save to the temporary
directory of the user's OS - not the current workspace." Inclui seção "suggested skills"; não
duplica specs/planos/ADRs/issues/commits/diffs — referencia por caminho; redige informação
sensível. Dicionário (paráfrase fiel, raw.githubusercontent.com, 2026-09-18): "*A document written
to the environment by one session for reading by the next... These secondary sources must stand
independently since receiving sessions lack prior context.*"

### Prototype (descartável, branch `prototype/<name>`, como primary source)

**Fato documentado.** De `skills/engineering/prototype/SKILL.md`:

> "A prototype is **throwaway code that answers a question**. The question decides the shape."
> (linha 415)
>
> "**Throwaway from day one, and clearly marked as such.**" (regra 1, linha 428)
>
> "**Capture it when done.** Fold any validated decision into the real code, then capture the
> prototype itself as a **primary source**: commit it to a throwaway branch, out of main, and
> leave a context pointer to that branch on the implementation issue... The main branch keeps only
> the validated decision." (regra 6, linha 433)

Repetido nos dois sub-guias (`LOGIC.md:62`, `UI.md:171-178`): a decisão validada sobe ao módulo
real; o HTML/variantes completos vão para o branch descartável, nunca ficam soltos na `main`.
`ask-matt/SKILL.md:81` reafirma: "the prototype itself is kept as a **primary source** on a
`prototype/<name>` branch out of main, pointed at from the implementation issue."

### Spec

**Fato documentado.** `to-spec/SKILL.md`: síntese da conversa (não interroga), template com Problem
Statement, Solution, User Stories, Implementation Decisions, Testing Decisions, Out of Scope,
Further Notes; publica no tracker com label `ready-for-agent`. Dicionário (paráfrase,
raw.githubusercontent.com, 2026-09-18): "*A persistent document describing multi-session work that
lives outside any single session's context... consisting of organized tickets... durable reference
points for fresh sessions.*"

### Ticket com blocking edges

**Fato documentado.** `to-tickets/SKILL.md`: "Give each ticket its **blocking edges** — the other
tickets that must complete before it can start. A ticket with no blockers can start immediately."
(linha 261). Publicação: **local** → "one file per ticket under `.scratch/<feature-slug>/issues/
<NN>-<slug>.md`, numbered from `01` in dependency order (blockers first)" (linha 285); **tracker
real** → "Use the platform's native blocking / sub-issue relationship... Apply the
`ready-for-agent` triage label" (linha 286). Template local inclui `**Blocked by:**`, `**Status:**
ready-for-agent` e critérios de aceite em checklist (linhas 292-305).

### Local issue tracker (`.scratch/<feature>/issues/`)

**Fato documentado.** Seed `skills/engineering/setup-matt-pocock-skills/issue-tracker-local.md`
(texto completo, reproduzido aqui por ser curto):

> "One feature per directory: `.scratch/<feature-slug>/`. The spec is
> `.scratch/<feature-slug>/spec.md`. Implementation issues are one file per ticket at
> `.scratch/<feature-slug>/issues/<NN>-<slug>.md`, numbered from `01`... Triage state is recorded
> as a `Status:` line near the top of each issue file... Comments and conversation history append
> to the bottom of the file under a `## Comments` heading."
>
> Wayfinding: "**Map**: `.scratch/<effort>/map.md`... **Child ticket**: `.scratch/<effort>/issues/
> NN-<slug>.md`... A `Type:` line records the ticket type (`research`/`prototype`/`grilling`/
> `task`); a `Status:` line records `claimed`/`resolved`. **Blocking**: a `Blocked by: NN, NN` line
> near the top... **Frontier**: scan... for files that are open, unblocked, and unclaimed; first by
> number wins. **Claim**: set `Status: claimed`... **Resolve**: append the answer under an
> `## Answer` heading, set `Status: resolved`, then append a context pointer... to the map's
> Decisions-so-far in `map.md`."

Note que esse seed **não define um estado `open` explícito** — a ausência de `Status:` (ou um
`Status:` diferente de `claimed`/`resolved`) já basta para o ticket contar como aberto/livre.

### Writing-for-agents (regras de redação para agentes)

Ver seção 4, abaixo — reservada por já ser uma das quatro perguntas específicas do pedido.

### Research

**Fato documentado.** Texto completo do skill (`skills/engineering/research/SKILL.md`, 12 linhas):
delega a um **background agent**; "Investigate the question against **primary sources** — official
docs, source code, specs, first-party APIs — not a secondary write-up of them. Follow every claim
back to the source that owns it."; "Write the findings to a single Markdown file, citing each
claim's source."; "Save it where the repo already keeps such notes; match the existing convention,
and if there is none, put it somewhere sensible and say where." `ask-matt/SKILL.md:82` acrescenta:
"research feeds the thinking, it doesn't replace it" — o material entra depois em `/grill-with-docs`.

---

## 2. O que `/setup-matt-pocock-skills` espera e grava

**Fato documentado**, de `skills/engineering/setup-matt-pocock-skills/SKILL.md`.

**Explora** (não assume, lê o que existe): `git remote -v`; `AGENTS.md`/`CLAUDE.md` na raiz e se já
têm bloco `## Agent skills`; `CONTEXT.md`/`CONTEXT-MAP.md`; `docs/adr/` (e `src/*/docs/adr/`);
`docs/agents/` (saída anterior desta mesma skill); `.scratch/` (sinal de tracker local já em uso);
se a skill `triage` está instalada; sinais de monorepo (linhas 331-342).

**Pergunta em três seções** (A) tracker de issues — GitHub, GitLab, local-markdown ou "outro"; (B)
vocabulário de labels de triagem (só se `triage` estiver instalada) — cinco papéis canônicos
`needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`; (C) layout de docs de
domínio — single-context (`CONTEXT.md` + `docs/adr/` na raiz, default) ou multi-context
(`CONTEXT-MAP.md` apontando para `CONTEXT.md` por contexto).

**Grava**:
- Um bloco `## Agent skills` em `CLAUDE.md` (se existir) ou `AGENTS.md` (se não, cria um dos dois —
  nunca os dois), com três sub-blocos: `### Issue tracker`, `### Triage labels` (só se `triage`
  instalada), `### Domain docs` — cada um resumido em uma linha, apontando para
  `docs/agents/*.md` (linhas 396-414).
- `docs/agents/issue-tracker.md` (a partir do seed correspondente: `issue-tracker-github.md`,
  `-gitlab.md`, `-local.md`, ou prosa livre para "outro").
- `docs/agents/triage-labels.md` (só se `triage` instalada).
- `docs/agents/domain.md` (regras de consumo de `CONTEXT.md`/ADRs, a partir do seed `domain.md`).

**Opinião/interpretação.** É uma skill "prompt-driven, not a deterministic script": explora,
apresenta, confirma, só então escreve — não há verificação automática de que o repo já segue o
formato depois de escrito; a skill confia no julgamento do agente e do usuário na hora.

---

## 3. O que `/prototype` prescreve exatamente

**Fato documentado**, de `skills/engineering/prototype/SKILL.md`, `LOGIC.md` e `UI.md`.

**Onde vive.** "Locate the prototype code close to where it will actually be used (next to the
module or page it's prototyping for)... name it so a casual reader can see it's a prototype, not
production." (regra 1). Para UI: preferir **sub-shape A** — ajuste dentro de uma página existente,
via `?variant=` — e só cair para **sub-shape B** (rota nova, sob convenção de rota do projeto,
nomeada com "prototype" no caminho) quando não há página hospedeira plausível.

**Como se escreve.** Depende da pergunta: **LOGIC.md** para "esse modelo de estado/lógica faz
sentido?" — um único arquivo HTML autocontido, com um módulo puro isolado (reducer, máquina de
estados, funções puras, ou classe), botões de "free-play" mais walkthroughs guiados em abas, sem
framework/bundler/servidor, "trivial to run" (um duplo-clique). **UI.md** para "como isso deveria
parecer?" — de 3 a 5 variantes estruturalmente diferentes (não só cor/copy), ligadas por uma barra
flutuante com setas e rótulo, trocando via `?variant=` na mesma rota; barra oculta em produção
(`NODE_ENV !== 'production'`).

**Regras comuns às duas** (`SKILL.md`, linhas 426-433): throwaway desde o dia um; trivial de rodar;
sem persistência por padrão (estado em memória; DB só se a pergunta for sobre persistência, com
nome tipo "PROTOTYPE — wipe me"); sem polimento (sem testes, sem tratamento de erro além do
mínimo); expor o estado completo depois de cada ação/variante.

**O que acontece depois.** "**Capture it when done.** Fold any validated decision into the real
code, then capture the prototype itself as a **primary source**: commit it to a throwaway branch,
**out of main**, and leave a context pointer to that branch on the implementation issue. Capture
the answer too... in the issue or a commit. The main branch keeps only the validated decision."
(regra 6). Para UI (`UI.md:171-178`): "fold the winner into the existing page; drop the losing
variants and the switcher from main" (sub-shape A) ou "promote the winning variant to a real route;
drop the throwaway route" (sub-shape B) — "The full set of variants is the primary source, so it
lands on the throwaway branch, not the bin."

**Como liga ao ticket.** Via `wayfinder`: o tipo de ticket `prototype` é HITL — "Raise the fidelity
of the discussion by making a cheap, rough, concrete artifact to react to... Links the prototype as
an asset." (`wayfinder/SKILL.md:171`). Fora de wayfinder, `ask-matt` descreve o mesmo elo: "the
prototype itself is kept as a primary source on a `prototype/<name>` branch out of main, pointed at
from the implementation issue" (linha 81) — ou seja, **um prototype por pergunta, uma branch por
prototype**, referenciada a partir do ticket de implementação (não o inverso).

---

## 4. O que `/writing-for-agents` prescreve

**Fato documentado**, de `skills/productivity/writing-for-agents/SKILL.md` (81 linhas, íntegro).

- **Context pointer**: "a reference held in the agent's context that names some out-of-context
  material and encodes the condition for reaching it." Regras: "Front-load the leading word... One
  trigger per branch... Cut identity the body already carries."
- **Os dois custos**: *context load* (material sempre carregado — descrição de skill, linha de
  AGENTS.md) vs *cognitive load* (custo humano de saber quais documentos existem e quando
  buscá-los — "not a cost to minimise... spend it where human judgement matters").
- **Hierarquia da informação**, em três degraus: (1) *in-file step* — o que o agente faz, em
  ordem; (2) *in-file reference* — consultado sob demanda; (3) *disclosed reference* — arquivo à
  parte, alcançado por um context pointer. "**Progressive disclosure** is the move down the
  ladder... Branching is the cleanest disclosure test: inline what every branch needs, and push
  behind a pointer what only some branches reach."
- **Co-location**: "Keep a concept's definition, rules, and caveats under one heading rather than
  scattered."
- **Sprawl**: documento longo demais mesmo com toda linha viva e única — cura é a escada +
  divisão por ramo/sequência.
- **Steps e completion criteria**: todo passo termina num critério checável; duas propriedades —
  **clareza** (evita *premature completion*) e **demanda** (quanto o passo exige — motor do
  *legwork*).
- **Quando dividir**: por sequência (quando os passos seguintes tentam o agente a apressar o
  atual) ou por invocação (ver `SKILL-MECHANICS.md`, não lido nesta pesquisa).
- **Leading words**: "a compact concept already living in the model's pretraining"; repetir o
  mesmo token ancora comportamento com menos tokens do que explicar por extenso; cunhar palavra
  própria só compensa se bem definida — "a made-up word recruits no priors."
- **Negação como modo de falha**: proibições reforçam o comportamento proibido ("_Don't think of an
  elephant_"); preferir instrução positiva; proibição só como *hard guardrail*, e mesmo assim
  emparelhada com o alvo positivo.
- **Poda**: uma só fonte de verdade por significado (duplicação custa manutenção); o ambiente
  (`package.json`, `--help`, layout de pastas) já é fonte de verdade — documentar só o que não dá
  para descobrir olhando (convenção não escrita, razão da escolha, a armadilha); checar
  **relevância** linha a linha contra **sedimento** (camadas obsoletas que ninguém tira); caçar
  **no-ops** — frase cujo efeito o modelo já produziria por padrão.

Este mesmo skill é o que rege o `AGENTS.md`/`CLAUDE.md` do Viva Maracanã — o pedido do usuário para
"apagar ponteiro morto no mesmo passe" e o formato enxuto de `AGENTS.md` (tabela "Onde ler para a
tarefa" como *context pointer* explícito) é uma aplicação direta destas regras, embora o
`AGENTS.md` do repo não cite `/writing-for-agents` pelo nome.

---

## 5. Onde o Viva Maracanã coincide, diverge, ou inventou a roda

### Tracker local: coincide na letra, estende na prática

**Fato documentado.** `docs/agents/issue-tracker.md` reproduz quase literalmente o seed
`issue-tracker-local.md`: um esforço por diretório, `map.md`, `spec.md`, `issues/NN-<slug>.md`,
`Status:`/`Type:`/`Blocked by:` no cabeçalho, `## Comments` para histórico, `Status: claimed` /
`## Answer` + `Status: resolved` para resolver, gist + link no mapa. As definições de **frontier**,
**claim** e **resolve** no arquivo do projeto usam a mesma palavra e o mesmo mecanismo do seed.

Três extensões, todas documentadas no próprio `docs/agents/issue-tracker.md`:

1. **Estado `open` explícito.** O seed do Matt não nomeia um estado inicial — ausência de
   `Status:` já basta. O projeto formaliza `open` como valor de `Status:` (ex.: `map.md:3`,
   ticket `09`). Não conflita com nada; é uma explicitação, não uma mudança de comportamento.
2. **`roadmap.md`.** Não existe no pacote do Matt — nem no `SKILL.md` do wayfinder, nem no seed
   local. O mapa do Matt é declarado "an index, not a store", com "Decisions so far" como única
   lista; o projeto acrescenta um segundo arquivo com tabela de camadas, grafo ASCII e "caminho
   crítico", que o próprio `docs/agents/issue-tracker.md` chama de "o guia do Marcos" e manda
   manter em sincronia com o `Status:` de cada ticket no mesmo passe. **Custo:** nenhum para as
   skills do Matt — nenhuma delas lê ou escreve `roadmap.md`; é um artefato adicional,
   mantido à mão, que não interfere na leitura de `map.md`/`issues/` que o wayfinder faz.
3. **`pesquisa/NN-<slug>.md` ligada ao ticket.** O `/research` do Matt só diz "save it where the
   repo already keeps such notes; match the existing convention" — o projeto definiu essa
   convenção (uma pesquisa por ticket, mais `pesquisa/NN-capturas/` e `pesquisa/NN-medicao/`
   ignorados pelo git). **Sem custo:** é exatamente o gancho que o skill do Matt deixou em aberto
   para o repo preencher.

**Opinião/interpretação.** Nenhuma das três extensões é gambiarra: as três preenchem lacunas que o
pacote deixou deliberadamente abertas ("match the existing convention", "the map is an index, not
a store" sem proibir um segundo artefato de acompanhamento). São extensões legítimas.

### Triagem: vocabulário emprestado sem a skill instalada

**Fato documentado.** `docs/agents/issue-tracker.md` lista os cinco papéis de `needs-triage` a
`wontfix` e diz para gravá-los no mesmo `Status:` do ticket — mas a skill `triage` do pacote **não
está listada** entre as instaladas visíveis nesta pesquisa (não apareceu na árvore
`skills/engineering/`; ela está lá, na verdade — `skills/engineering/triage/` existe no pacote).
Então o vocabulário de triagem é real e vem do pacote (`triage/SKILL.md:362-368`), só que aplicado
a um `Status:` compartilhado com o estado de wayfinder (`open`/`claimed`/`resolved`) — o seed do
Matt trata os dois vocabulários como pertencentes a fluxos diferentes (`to-tickets` grava
`ready-for-agent` puro; wayfinder grava `claimed`/`resolved` puro) sem prescrever como
coexistirem no mesmo campo. **Custo potencial:** se `/triage` for rodada sobre um ticket que já
está em `claimed` (fluxo wayfinder), a skill pode não reconhecer o valor — ela assume os cinco
papéis canônicos como universo fechado do campo. É uma sobreposição de vocabulário que o repo
resolveu por convenção própria (documentada), não um bug hoje, mas um ponto onde a skill de
origem pode estranhar o valor que encontrar.

### Protótipo: a maior divergência, e ela tem custo real

**Fato documentado.** O pacote prescreve, sem exceção nas regras comuns: throwaway desde o dia um,
"commit it to a throwaway branch, **out of main**", "The main branch keeps only the validated
decision" (`prototype/SKILL.md`, regra 6). O Viva Maracanã faz o oposto na forma: dois protótipos —
`.scratch/linguagem-visual/prototipo/` e `.../prototipo-ponto-de-fuga/` — **versionados na `main`**
(commit `b39299f "chore(prototipo): versiona os assets para o deploy de revisão"`, visto no git
log), cumulativos (cada ticket de protótipo — 10, 11, 12, 13, 14... — acrescenta uma peça ao
*mesmo* arquivo, em vez de um protótipo descartável por pergunta), com critério de saída próprio:
"Sai do repositório quando o mapa fecha" (`map.md:45`) e "O protótipo sai do repositório" no
fechamento (`roadmap.md:125`) — não uma branch separada, e sim remoção do diretório de trabalho no
commit de fechamento (que é o próprio mecanismo do ADR-0035, referido em `map.md`).

**Custo real, não hipotético:** se alguém invocar `/mattpocock-skills:prototype` literalmente sobre
um dos tickets de protótipo do roadmap (11, 12, 13...), a skill vai tentar aplicar sua regra 6 —
"commit it to a throwaway branch, out of main" — a um artefato que o projeto já decidiu manter
**dentro** da `main`, cumulativo entre tickets. A skill não tem noção de "um protótipo que cresce
entre vários tickets"; ela modela "um protótipo por pergunta, uma branch por protótipo". Rodar a
skill sem ajuste geraria uma proposta de branch nova a cada ticket, fragmentando o que o projeto
quer coeso (a mesma folha HTML evoluindo, para julgar coerência entre peças — "a coerência entre as
peças é o que se julga", `map.md:45`). Isso não é um bug hoje porque a rotina real do projeto (visto
em `especialistas-por-etapa.md` e nos tickets lidos) não invoca `/mattpocock-skills:prototype`
como comando — o protótipo é conduzido manualmente, seguindo o ciclo de direção de arte do próprio
projeto. Mas é o ponto exato onde a skill "vai procurar algo que não está onde ela espera": ela
espera achar (ou criar) uma branch `prototype/<name>`; o repo não tem nenhuma branch desse padrão
(não verificado por `git branch`, mas nenhuma referência a isso em nenhum documento lido).

**Opinião/interpretação.** A escolha do projeto é defensável e documentada (ADR-0035, mapa,
memória "Protótipo se compõe do zero, não se veste"): o produto é uma tela sequenciada e coerente,
e o "descartável" do Matt é pensado para responder uma pergunta isolada, não para compor uma home
inteira que precisa se sustentar como unidade visual. Ainda assim é uma extensão que rompe a regra
literal, não uma aplicação dela — vale nomear isso explicitamente se algum dia alguém tentar rodar
a skill original sobre este mapa.

### `prototipo-ponto-de-fuga/`: uma rodada fora do próprio mapa do projeto

**Fato documentado.** O `roadmap.md` do projeto tem uma seção própria, "Rodada fora do quadro",
admitindo que este protótipo "não seguiu a ordem do grafo" e responde "em forma de proposta" o que
vários tickets ainda em aberto (10, 11, 12, 13, 14, 15, 16, 19, 20) discutem. Isso diverge não do
pacote do Matt, mas da **própria** disciplina de wayfinder que o projeto adotou (ticket por vez,
frontier, bloqueio) — o projeto documenta a exceção em vez de escondê-la, e usa o resultado como
insumo para fechar os tickets formais depois ("Os demais fecham quando o Marcos aceitar ou recusar
a resposta que o protótipo dá, e aí o ticket registra a decisão com a fonte", `roadmap.md:113`).

**Opinião/interpretação.** Não é invenção da roda do wayfinder — é uma suspensão documentada dele,
sob demanda direta do dono do produto, com plano explícito de reconciliação com os tickets formais.
O próprio wayfinder do Matt permite algo parecido em espírito ("An effort can override this in its
**Notes**"), mas para "carrying execution into the map itself", não para uma sessão paralela que
ignora a ordem de bloqueio. Esta divergência é mais estrutural que a anterior — o projeto está
usando wayfinder como *registro*, não como *disciplina de execução*, quando o Marcos pede.

### Ciclo de direção de arte (observar → pesquisar → compor → criticar): não existe no pacote

**Fato documentado.** Nenhum arquivo do pacote (`SKILL.md` de `prototype`, `research`,
`domain-modeling`, `grilling`, `to-spec`, `to-tickets`, `improve-codebase-architecture`) descreve
um ciclo de quatro etapas com critérios de fechamento próprios por etapa (nomear a intenção;
citar referência com contraexemplo; renderizar em 375px e desktop; passar checklist de foco,
desejo, hierarquia, ritmo, identidade, uso). Isso é inteiramente do `docs/agents/especialistas-por-etapa.md`
do Viva Maracanã.

**Opinião/interpretação.** É extensão legítima, não conflito: o ciclo *usa* as skills do pacote
como ferramentas dentro de cada etapa (`/research` na etapa 2, `frontend-design` e o protótipo na
etapa 3, `/grilling`/`/domain-modeling` nos tickets de conversa) — não substitui nenhuma delas, só
adiciona uma camada de critério de qualidade específica de design visual que o pacote,
propositalmente genérico, não tem vocabulário para exigir (contraste WCAG, Mobbin como fonte de
composição, uma foto real por decisão).

### Codex como revisor independente: extensão sem equivalente no pacote

**Fato documentado.** O pacote tem `/code-review`, que roda **dois subagentes Claude em
paralelo** (Standards e Spec) sobre o mesmo modelo — "Both axes run as **parallel sub-agents** so
they don't pollute each other's context" (`code-review/SKILL.md:137`). Não há, em nenhum arquivo
lido do pacote, menção a um segundo *provedor* de modelo como revisor. O projeto usa
`/codex:review`, `/codex:adversarial-review` e `/codex:rescue` — um produto diferente (Codex, não
Claude) — precisamente pelo motivo declarado: "O olho julga a tela; o código e a premissa ganham um
revisor que não compartilha o seu viés" (`especialistas-por-etapa.md`).

**Fato documentado adicional.** Nenhum documento do projeto (`docs/agents/*.md`, `AGENTS.md`)
menciona `/code-review`, `/implement`, `/to-spec`, `/to-tickets` ou `/tdd` pelo nome — confirmado
por busca de texto nesses arquivos, zero ocorrências. A tabela de portões por mudança do projeto
(`especialistas-por-etapa.md`) usa `npm run verificar`, `npm run contraste`, `npm run test:e2e`,
`npm run build` e os comandos `/codex:*` como os gates reais — não o `/code-review` do pacote.

**Opinião/interpretação — custo ou extensão?** Duas leituras possíveis, e a pesquisa não decide
entre elas porque é decisão de processo, não fato:
- **Extensão legítima**, se o projeto sempre pretendeu usar Codex *no lugar* de `/code-review` —
  aí a ausência de citação é intencional, e o gate equivalente existe, só que com outro nome e
  outro modelo por trás.
- **Lacuna silenciosa**, se em algum momento alguém rodar `/implement` do pacote em código deste
  repo — `implement/SKILL.md` manda "Once done, use /code-review to review the work" antes de
  commitar. Se essa etapa for seguida ao pé da letra, o repo ganharia uma revisão Claude-em-Claude
  que os próprios documentos do projeto nunca pediram nem calibraram (não há
  `docs/agents/issue-tracker.md` nem nenhum outro arquivo dizendo onde a "spec" ou o "fixed
  point" de `/code-review` vêm neste projeto — o skill pede exatamente isso e não encontraria
  resposta pronta).

Isso não foi observado acontecendo — é o ponto onde a skill de origem, se invocada como o pacote
prevê, procuraria algo (uma spec/ticket como "fixed point" de comparação, no formato que
`code-review/SKILL.md` passo 2 espera) que o projeto guarda em `.scratch/<esforço>/spec.md` só
depois que o mapa fecha (`roadmap.md:124`) — hoje, com o mapa aberto, esse arquivo não existe
ainda para a maior parte do esforço em curso.

---

## Fontes

**Pacote instalado** (`C:\Users\marco\.claude\plugins\cache\mattpocock\mattpocock-skills\1.2.3\`,
lido em 2026-09-18):
- `skills/engineering/ask-matt/SKILL.md`, `PHASE-BOUNDARIES.md` (referenciado, conteúdo obtido via
  espelho web — ver abaixo)
- `skills/engineering/wayfinder/SKILL.md`
- `skills/engineering/to-tickets/SKILL.md`
- `skills/engineering/to-spec/SKILL.md`
- `skills/engineering/prototype/SKILL.md`, `LOGIC.md`, `UI.md`
- `skills/engineering/setup-matt-pocock-skills/SKILL.md`, `issue-tracker-local.md`, `domain.md`
- `skills/engineering/research/SKILL.md`
- `skills/engineering/domain-modeling/SKILL.md`
- `skills/engineering/tdd/SKILL.md`
- `skills/engineering/code-review/SKILL.md`
- `skills/engineering/codebase-design/SKILL.md`
- `skills/engineering/triage/SKILL.md`
- `skills/engineering/improve-codebase-architecture/SKILL.md`
- `skills/engineering/implement/SKILL.md`
- `skills/productivity/grilling/SKILL.md`
- `skills/productivity/handoff/SKILL.md`
- `skills/productivity/writing-for-agents/SKILL.md`
- `CLAUDE.md`, `CONTEXT.md` (raiz do pacote)

**Web** (todos acessados em 2026-09-18):
- https://www.aihero.dev/ai-coding-dictionary/smart-zone (via busca; fetch direto deu 404 —
  conteúdo obtido por snippet de busca e por espelho GitHub)
- https://www.aihero.dev/tracer-bullets
- https://www.aihero.dev/skills-wayfinder
- https://www.aihero.dev/skills-grilling
- https://www.aihero.dev/skills-ask-matt
- https://raw.githubusercontent.com/mattpocock/dictionary-of-ai-coding/main/README.md (espelho
  usado para Smart zone, Spec, Ticket, Compaction, Handoff, Primary/Secondary source, Clearing,
  Context window, Grilling, Prototyping, Human-in-the-loop, AFK — paráfrase do modelo de busca a
  partir do markdown fonte, não citação literal linha a linha)
- https://github.com/mattpocock/skills (confirmação de que o pacote instalado corresponde ao
  repositório público `mattpocock/skills`, não a `mattpocock/dictionary-of-ai-coding`, que é um
  repositório irmão só do glossário)

**Repositório Viva Maracanã** (lido em 2026-09-18):
- `AGENTS.md`, `CONTEXT.md`
- `docs/agents/issue-tracker.md`
- `docs/agents/especialistas-por-etapa.md`
- `.scratch/linguagem-visual/map.md`
- `.scratch/linguagem-visual/roadmap.md`
- `.scratch/linguagem-visual/issues/09-o-esqueleto-do-prototipo.md`
- `.scratch/linguagem-visual/issues/10-papeis-de-cor-e-a-base.md`
- `.scratch/linguagem-visual/prototipo-ponto-de-fuga/README.md`
- `.scratch/linguagem-visual/prototipo-ponto-de-fuga/DIRECAO.md` (primeiras ~120 linhas)
- `git log --oneline` (commit `b39299f` como evidência do protótipo versionado na `main`)
