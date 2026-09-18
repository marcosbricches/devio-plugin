# 03 — Práticas visuais com agentes de código: nomes, fontes e ferramentas

**Data:** 2026-09-18

**Pergunta:** como a comunidade e os fornecedores praticam e nomeiam (1) o protótipo executável em
HTML antes de implementar, (2) a conferência da tela por captura e medida em vez de teste unitário,
e (3) o uso de referência (Mobbin, benchmark) antes de compor — em fontes primárias, com data.

---

## 1. Protótipo executável antes de implementar

### Fato documentado

- **Anthropic, skill `frontend-design`** (lida direto do arquivo local em
  `C:\Users\marco\.claude\plugins\marketplaces\claude-plugins-official\plugins\frontend-design\skills\frontend-design\SKILL.md`,
  sem data de commit visível): prescreve duas passagens — primeiro um "design plan" compacto (cor,
  tipo, layout em wireframe ASCII, princípios), revisão desse plano contra o brief, só então o
  código. Não usa o termo "protótipo"; a verificação final é "taking screenshots to review if your
  environment supports it — a picture is worth 1000 tokens". Não prescreve HTML descartável como
  etapa própria antes do código de produção — o ciclo é plano → código → captura.
- **Anthropic, skill `web-artifacts-builder`** (`github.com/anthropics/skills`, `skills/web-artifacts-builder/SKILL.md`,
  lido em 2026-09-18): artefato React/Tailwind/shadcn embalado num único HTML. A skill recomenda
  **não** testar antes de mostrar o resultado — "avoid testing the artifact upfront as it adds
  latency between the request and when the finished artifact can be seen". Ou seja, a fonte oficial
  da Anthropic para HTML gerado por agente aponta para *menos* verificação prévia, não mais: o nome
  do artefato é "artifact", não "protótipo", e o fluxo é entrega rápida, refinamento depois.
- **Anthropic, skill `canvas-design`**: produz `.png`/`.pdf` (arte estática), não HTML navegável — não
  se aplica a "protótipo executável".
- **Anthropic, produto `Claude Design`** (anunciado 2026-04-17,
  `anthropic.com/news/claude-design-anthropic-labs`; cobertura TechCrunch mesma data): "collaborate
  with Claude to create polished visual work like designs, prototypes, slides, one-pagers" —
  usa a palavra "prototypes" no anúncio oficial, incluindo conversão de "codebases into interactive
  prototypes". É o produto, não uma prescrição de processo; não documenta o método interno.
- **Jesse Vincent, `obra/superpowers`** (anúncio 2025-10-09; `github.com/obra/superpowers`, lido
  2026-09-18): as skills nomeadas são `brainstorming` ("Socratic design refinement" — refina ideia
  bruta por perguntas antes de qualquer código), `writing-plans` (plano em tarefas de 2-5 min, cada
  uma com caminho de arquivo e critério de verificação), `executing-plans` (execução em lote com
  checkpoint humano), `subagent-driven-development`, `systematic-debugging` e
  `verification-before-completion`. Nenhuma delas nomeia "protótipo HTML" ou captura de tela como
  etapa; `verification-before-completion` (lido em `skills/verification-before-completion/SKILL.md`)
  é explicitamente sobre evidência de linha de comando — saída de teste, lint, build, diff de VCS —
  e **não menciona screenshot, inspeção visual ou verificação no navegador em nenhum ponto**. A
  disciplina de Vincent é sobre corretude de código, não sobre composição visual.
- **Vercel, `vercel-labs/agent-skills`** (lido 2026-09-18): das oito skills do repositório
  (`vercel-optimize`, `react-best-practices`, `web-design-guidelines`, `writing-guidelines`,
  `react-native-guidelines`, `react-view-transitions`, `composition-patterns`,
  `vercel-deploy-claimable`), **nenhuma prescreve protótipo HTML, captura de tela ou verificação
  visual antes de implementar**; são auditorias de regra (acessibilidade, performance, convenção de
  código) e deploy. Não achei repositório separado com o nome exato pedido
  (`github.com/vercel/agent-skills`); o que existe publicamente é `vercel-labs/agent-skills`.
- **Termo acadêmico "Vibe Design"**: Hwang & Kang, HICSS 2026-01-06
  (`scholarspace.manoa.hawaii.edu/items/bbfa746f-...`): "an agentic framework that enables designers
  to co-create and evaluate prototypes with the LLM-based agents" — um agente de design gera
  "protótipos funcionais" e um segundo agente de teste de usuário gera feedback de usabilidade
  simulado (metodologia Persona-Scenario-Goal), com humano no loop para confiabilidade. É o único
  termo de fonte primária (paper revisado por pares) encontrado que nomeia explicitamente
  "co-create and evaluate prototypes" com agente.
- Termo de mercado difuso "vibe design" (sem fonte única, vários blogs 2026): descrito como
  "describe the interface you want in natural language, let a model generate it as a real, running
  artifact, then iterate by steering instead of pixel-pushing" — linguagem natural → artefato
  renderizado → refinar por descrição. Não é um nome com dono; é rótulo de mercado pós-"vibe coding".

### Opinião/interpretação

- Não encontrei, em nenhuma fonte primária da Anthropic, Vercel ou obra/superpowers, uma prescrição
  equivalente à prática do Viva Maracanã de **protótipo HTML/CSS/JS descartável, fora do código de
  produção, como porta obrigatória antes de qualquer implementação em componente**. A prática mais
  próxima documentada é o "design plan" revisado do `frontend-design` (plano em prosa/ASCII, não
  HTML executável) e o artefato do `web-artifacts-builder` (HTML executável, mas tratado como
  entregável rápido, não como descartável a ser recomposto).
- "Vibe design" (o paper) é a fonte primária mais próxima do conceito "compor com agente, avaliar,
  refinar" — mas seu protótipo permanece o candidato à produção, avaliado por *outro agente
  simulando usuário*, não por um humano olhando a tela em 375px como no ciclo do Viva Maracanã.

---

## 2. Conferir a tela por captura e medida, não por teste unitário

### Fato documentado

- **Anthropic, `webapp-testing`** (`github.com/anthropics/skills`, `skills/webapp-testing/SKILL.md`,
  lido 2026-09-18): frontmatter — "Toolkit for interacting with and testing local web applications
  using Playwright. Supports verifying frontend functionality, debugging UI behavior, capturing
  browser screenshots, and viewing browser logs." Prescreve um padrão "reconnaissance-then-action":
  inspecionar a saída renderizada (screenshot, DOM) antes de escrever seletor e ação. Trata
  screenshot como evidência a ser **revisada** (`page.screenshot()` seguido de leitura da imagem),
  não como asserção automática — a confirmação de "rendering accuracy" e "UX details" fica marcada
  como tarefa que precisa de revisão, não de assert puro.
- **Playwright, docs oficiais** (`playwright.dev/docs/test-snapshots`, lido 2026-09-18): a asserção
  `toHaveScreenshot()` é "screenshot testing"/"visual comparison", com diff pixel a pixel via
  `pixelmatch` e tolerância configurável (`maxDiffPixels`). A própria documentação avisa que
  "browser rendering can vary based on the host OS, version, settings, hardware, power source
  (battery vs. power adapter), headless mode, and other factors" — ou seja, mesmo a fonte do
  fabricante da ferramenta declara que o pixel-diff automático não é universalmente estável entre
  ambientes, e depende de uma baseline gerada no mesmo ambiente do teste.
- **Chromatic/Storybook**: buscas confirmam o termo de mercado "visual regression testing" /
  "visual testing" / "UI review" para o fluxo de captura + diff + aprovação humana por PR, mas a
  tentativa de leitura direta da doc (`chromatic.com/docs/visual-testing/`) retornou 404 nesta
  sessão — tratar como fato de mercado amplamente citado (Percy, BackstopJS, Argos operam no mesmo
  modelo: captura → diff automático → decisão humana de aprovar/rejeitar), não como citação
  primária lida integralmente.
- **axe-core / Deque** (`deque.com/axe/axe-core`, `github.com/dequelabs/axe-core`, buscas de
  2026-09-18): "accessibility engine for automated Web UI testing". Fonte consolidada: axe-core
  cobre a fração de regras de acessibilidade decidível por máquina (contraste sobre fundo sólido,
  atributos ARIA, nomes acessíveis); teste manual com leitor de tela e navegação por teclado
  continua necessário para "complex accessibility barriers that automation cannot detect" — a
  distinção "o que é verificável por máquina vs. por humano" é o próprio motivo do axe-core existir
  como *complemento*, não substituto.
- **Chrome DevTools MCP**: a doc em `developer.chrome.com/docs/devtools/mcp` retornou 404 nesta
  sessão (provável mudança de URL); a existência e as ferramentas (`performance_start_trace`,
  `performance_analyze_insight`, `take_screenshot`, `lighthouse_audit`, `list_console_messages`)
  estão confirmadas pela lista de tools MCP carregada nesta sessão
  (`mcp__plugin_chrome-devtools-mcp_chrome-devtools__*`), não por leitura de página — registrar como
  fato de configuração local, não citação de doc.
- **Playwright MCP** (`microsoft/playwright-mcp`, `playwright.dev/mcp/introduction` e
  `/mcp/snapshots`, via busca 2026-09-18): opera por **snapshot de árvore de acessibilidade**, não
  pixel — cada elemento ganha um `ref` (`ref=e5`) para interação determinística; a doc contrasta
  isso com screenshot como "far cheaper than DOM dumps or screenshots" para o agente decidir a
  *ação*. Ou seja, a família Playwright MCP nomeia duas coisas diferentes: `browser_snapshot`
  (estrutura, para agir) e `browser_take_screenshot` (pixel, para julgar aparência) — o mesmo par
  que o ciclo do Viva Maracanã já separa em "extração de texto não prova layout".

### Opinião/interpretação

- A distinção que o Viva Maracanã já pratica — "código e premissa ganham revisor" (Codex) vs. "foco,
  desejo, ritmo, identidade continuam sendo inspeção com imagem" (`especialistas-por-etapa.md:56`) —
  é a mesma linha que a comunidade traça, mas nenhuma fonte única a nomeia com um termo consolidado.
  O rótulo de mercado mais próximo é "visual QA" / "design QA" (usado solto em posts de Chromatic e
  Percy, sem definição formal encontrada em fonte primária nesta sessão).

---

## 3. Referência antes de compor: Mobbin, benchmark, fonte → mecanismo → aplicação

### Fato documentado

- **Mobbin MCP oficial** (`mobbin.com/mcp`, lido 2026-09-18, documento datado 2026-09-11): expõe três
  ferramentas — `search_screens` ("real screens... using natural language"), `search_flows`
  ("ordered, multi-step user flows"), `search_sections` ("website sections"). Devolve imagem, nome
  do produto, contexto do flow/seção e link de volta ao Mobbin; clientes MCP com "MCP Apps" renderizam
  como galeria. **A própria Mobbin avisa**: achar um padrão "is a convention, not automatically a
  best practice", e observá-lo "does not prove that the design improved conversion or another
  metric" — a fonte do fornecedor já nomeia explicitamente o limite que o
  `especialistas-por-etapa.md` também registra ("é hipótese para compor"). Recomenda revisar
  "several relevant products rather than relying on one example" e preservar atribuição de fonte
  para inspeção — o equivalente exato de "fonte → mecanismo → aplicação" pedido no ticket, embora a
  Mobbin não use essas três palavras.
- **Nielsen Norman Group, "Competitive Usability Evaluations: Definition"** (Tim Neusesser,
  2024-01-05, `nngroup.com/articles/competitive-usability-evaluations/`): define avaliação
  competitiva como "comparing your product against several competing designs", tipicamente **no
  início** do projeto, para redirecionar decisão para oportunidade — "design variations don't
  necessarily need to be fully developed or interactive to be evaluated". Documentação recomendada:
  não ranking puro, mas conclusão acionável — o que funcionou, o que falhou e por quê, e onde
  diferenciar. Isso é o "benchmark antes de compor" citado no ticket, com fonte primária e data.
- **Mobbin, uso local no repositório**: `docs/agents/especialistas-por-etapa.md:70` já registra a
  regra operacional — Mobbin `search_screens` com `platform: "web"` para hierarquia/ritmo/densidade,
  "cor e tipo vêm da identidade, não do Mobbin" — e o arquivo de pesquisa
  `.scratch/linguagem-visual/pesquisa/02-mobbin-pagina-de-produto.md` (2026-09-15) já pratica o
  formato fonte → tela (ID do Mobbin) → mecanismo observado → limite declarado (ex.: "Mobbin web não
  indexa GetYourGuide web... telas web do Mobbin são de desktop"), com contraexemplo assumido
  (aproximação por app iOS declarada como tal).

### Opinião/interpretação

- A prática de registrar "fonte → mecanismo → aplicação → limite" já descrita em
  `especialistas-por-etapa.md:23` não tem, no material primário levantado, um nome de mercado único
  — nem Mobbin nem NN/g usam essa cadeia de quatro termos. O mais perto é o "annotate what worked,
  what failed, and why" da NN/g. Isto sugere que a granularidade do registro do Viva Maracanã (por
  tela, com ID) é mais rigorosa que a prática comum descrita por essas fontes, que fala em nível de
  produto/página, não de tela individual citável.

---

## 4. O que cada prática exige de ferramenta, e o que já está instalado

### Fato documentado — instalado no repositório (`package.json`, lido 2026-09-18)

| Ferramenta | Onde aparece no `package.json` | Uso já existente no repo |
| --- | --- | --- |
| `@playwright/test` 1.62.1 | devDependency | `test:e2e`, e os scripts de `.scratch/.../ferramentas/prints-das-juncoes.mjs` e `scripts/medicao/*.mjs` |
| `@axe-core/playwright` 4.13.0 | devDependency | usado (presumivelmente) na suíte e2e para acessibilidade automática |
| `sharp` 0.35.4 | dependency | `ferramentas/cozinhar.mjs` (mesa de cor das imagens) e `scripts/preparar-imagem.ts` |
| Chrome DevTools trace | não é pacote npm — é o Chromium do Playwright/Chrome, capturado via `performance_start_trace`/`performance_stop_trace` (Chrome DevTools MCP) e somado por `ferramentas/somar-trace.mjs` | custo do thread principal na rolagem |
| Lighthouse | não está em `package.json` — hoje é o `lighthouse_audit` do Chrome DevTools MCP, não script no repo | não usado como script próprio no repositório |
| `tailwindcss` 4.3.3, `zod`, `next-intl` | infraestrutura de produção, não de verificação visual | — |

### Fato documentado — o que a comunidade exige por prática

- **Playwright** é o denominador comum: `toHaveScreenshot()` para regressão visual, `webapp-testing`
  da Anthropic para captura/inspeção, `prints-das-juncoes.mjs` do próprio repo, e Playwright MCP
  para snapshot de acessibilidade.
- **sharp** não aparece em nenhuma fonte de mercado pesquisada como ferramenta de "mesa de cor" —
  é usado amplamente para redimensionamento/otimização de imagem em produção (função padrão do
  ecossistema Node), não para o tipo de composição fotográfica (feixe de luz, gradação, grão) que
  `cozinhar.mjs` faz. Não há concorrente direto encontrado nas fontes cobertas.
- **Chrome DevTools MCP / trace**: a doc oficial não pôde ser lida nesta sessão (404), mas a lista de
  tools carregada confirma `performance_start_trace`, `performance_stop_trace`,
  `performance_analyze_insight`, `lighthouse_audit`, `take_screenshot` — ferramentas prontas para
  medir performance e rodar Lighthouse, que se sobrepõem em parte a `medir-lcp.mjs` e
  `medir-cls.mjs`.
- **axe-core**: cobre contraste texto/fundo sobre cor sólida e ARIA; não cobre contraste de texto
  sobre foto (a regra WCAG de contraste não se aplica a fundo de imagem do mesmo jeito, e nenhuma
  ferramenta de mercado encontrada mede isso pixel a pixel na composição final).

---

## Onde o Viva Maracanã coincide, diverge, ou inventou a roda

- **Protótipo HTML descartável antes de componente de produção** (`.scratch/linguagem-visual/prototipo-ponto-de-fuga/`):
  coincide em espírito com o "design plan → revisão → código" do `frontend-design` da Anthropic e
  com o conceito acadêmico "vibe design" (protótipo avaliável antes de virar produção), mas **nenhuma
  fonte primária prescreve HTML fora da árvore de produção como etapa obrigatória** — o
  `web-artifacts-builder` da própria Anthropic vai no sentido oposto (menos verificação prévia, HTML
  já é quase-entrega). Aqui o Viva Maracanã inventou a roda: a disciplina de recompor do zero, em
  camadas, fora do Next.js, não tem equivalente documentado nas fontes cobertas.

- **`capturar-o-site.mjs`** (captura de todas as rotas) — o equivalente de mercado é o
  `toHaveScreenshot()` do Playwright ou `page.screenshot()` do `webapp-testing` da Anthropic.
  Diferença: essas ferramentas de mercado comparam contra uma *baseline salva* (regressão), e a
  própria doc do Playwright avisa que a baseline não é estável entre SO/hardware. `capturar-o-site.mjs`
  não faz diff — é insumo para o olho humano no ciclo observar/criticar, o que evita exatamente a
  instabilidade de baseline que o Playwright declara como limite. Não é redundante: resolve um
  problema (estabilidade entre máquinas) que a ferramenta pronta admite não resolver.

- **`prints-das-juncoes.mjs`** (cada junção de rolagem em 0/50/100%, duas telas) — não tem
  equivalente pronto encontrado. `toHaveScreenshot()` e Chromatic capturam estado por página/componente,
  não por *porcentagem de curso de uma animação acionada por rolagem*. É pergunta que nenhuma
  ferramenta de mercado pesquisada responde pronta.

- **`somar-trace.mjs`** (custo do thread principal, ms/s, por categoria, durante a rolagem, entre
  marcas custom `rolagem-inicio`/`rolagem-fim`) — Chrome DevTools MCP e Lighthouse relatam métricas
  agregadas (LCP, CLS, TBT) para o carregamento da página, não o custo por categoria de evento
  **durante uma interação de rolagem contínua com marcas customizadas**. `performance_analyze_insight`
  do Chrome DevTools MCP se aproxima (insights sobre o trace), mas a agregação por `RunTask`/tarefas
  longas >50ms dentro de uma janela demarcada por marca de usuário é escrita à mão porque a pergunta
  é específica da montagem por rolagem deste protótipo.

- **`medir-contraste-sobre-foto.mjs`** — nem axe-core nem Lighthouse medem contraste de texto sobre
  fundo fotográfico variável; ambos assumem fundo de cor sólida ou média. Isto é uma pergunta que
  nenhuma ferramenta pronta das fontes cobertas responde: é onde o repositório mais claramente
  "inventou a roda" por necessidade, não por preferência.

- **`cozinhar.mjs`** — usa `sharp`, biblioteca padrão de mercado, mas para uma receita de composição
  fotográfica (feixe ancorado nas fontes de luz reais, gradação, grão nos campos de cor) que não é
  o uso típico documentado de `sharp` (redimensionar/otimizar). Ferramenta pronta, aplicação
  específica do repositório.

- **`versionar.mjs`** (hash de conteúdo no `?v=`) — é o padrão de mercado "cache busting por hash de
  conteúdo" (o que bundlers como Vite/Webpack fazem nativamente); aqui é feito à mão porque o
  protótipo roda fora de um bundler, servido por `servir.mjs` puro. Não é invenção: é reimplementação
  manual de uma prática comum, justificada pela ausência de bundler no protótipo.

- **Mobbin como referência de composição** (`especialistas-por-etapa.md:70`,
  `pesquisa/02-mobbin-pagina-de-produto.md`) — coincide diretamente com o Mobbin MCP oficial e com a
  prática de "revisar vários produtos, preservar atribuição" que a própria Mobbin recomenda. O
  registro por ID de tela individual do repositório é mais granular que o padrão de mercado descrito
  (NN/g fala em nível de produto), o que é reforço, não invenção paralela.

- **Registro fonte → mecanismo → aplicação → limite** — não corresponde a um termo de mercado único;
  é mais próximo do "actionable insight, not just ranking" da NN/g, mas mais estruturado. Prática
  própria, sem contradição com o que as fontes recomendam.

---

## Fontes

- Anthropic, skill `frontend-design`, lida localmente em
  `C:\Users\marco\.claude\plugins\marketplaces\claude-plugins-official\plugins\frontend-design\skills\frontend-design\SKILL.md` (sem data de commit visível no arquivo; consultado 2026-09-18)
- Anthropic, `github.com/anthropics/skills`, listagem de pastas via API (`api.github.com/repos/anthropics/skills/contents/skills`), consultado 2026-09-18
- Anthropic, `skills/web-artifacts-builder/SKILL.md`, `github.com/anthropics/skills`, consultado 2026-09-18
- Anthropic, `skills/canvas-design/SKILL.md`, `github.com/anthropics/skills`, consultado 2026-09-18
- Anthropic, `skills/webapp-testing/SKILL.md`, `github.com/anthropics/skills`, consultado 2026-09-18
- Anthropic, "Introducing Claude Design by Anthropic Labs", `anthropic.com/news/claude-design-anthropic-labs`, 2026-04-17
- TechCrunch, "Anthropic launches Claude Design, a new product for creating quick visuals", 2026-04-17
- Jesse Vincent, `github.com/obra/superpowers`, anúncio 2025-10-09, consultado 2026-09-18
- Jesse Vincent, `skills/verification-before-completion/SKILL.md`, `github.com/obra/superpowers`, consultado 2026-09-18
- Vercel Labs, `github.com/vercel-labs/agent-skills`, consultado 2026-09-18 (não existe `github.com/vercel/agent-skills` público encontrado)
- Hwang & Kang, "Vibe Design: Human-in-the-loop AI Agents for UI Design with Large Language Models", HICSS 2026, `scholarspace.manoa.hawaii.edu/items/bbfa746f-061f-4b7a-9c2e-8f44bd3e35be`, publicado 2026-01-06
- Playwright, "Visual comparisons" / `toHaveScreenshot`, `playwright.dev/docs/test-snapshots`, consultado 2026-09-18
- Microsoft, `github.com/microsoft/playwright-mcp` e `playwright.dev/mcp/introduction`, `playwright.dev/mcp/snapshots`, consultado 2026-09-18 (via busca; não lido integralmente)
- Mobbin, `mobbin.com/mcp`, documento datado 2026-09-11, consultado 2026-09-18
- Nielsen Norman Group, Tim Neusesser, "Competitive Usability Evaluations: Definition", `nngroup.com/articles/competitive-usability-evaluations/`, 2024-01-05
- Deque Labs, `axe-core`, `deque.com/axe/axe-core/` e `github.com/dequelabs/axe-core`, consultado 2026-09-18 (via busca)
- Chrome DevTools MCP: existência e ferramentas confirmadas pela lista de tools MCP carregada na sessão (`mcp__plugin_chrome-devtools-mcp_chrome-devtools__*`); a doc `developer.chrome.com/docs/devtools/mcp` retornou 404 nesta sessão (2026-09-18) e não pôde ser citada diretamente
- Chromatic, `chromatic.com/docs/visual-testing/`, retornou 404 nesta sessão (2026-09-18) — citado só como termo de mercado, não fonte lida
- Repositório Viva Maracanã: `docs/agents/especialistas-por-etapa.md`, `scripts/medicao/README.md`,
  `.scratch/linguagem-visual/prototipo-ponto-de-fuga/README.md`,
  `.scratch/linguagem-visual/prototipo-ponto-de-fuga/DIRECAO.md`,
  `.scratch/linguagem-visual/prototipo-ponto-de-fuga/ferramentas/{cozinhar,prints-das-juncoes,somar-trace,versionar}.mjs`,
  `.scratch/linguagem-visual/pesquisa/02-mobbin-pagina-de-produto.md`, `package.json` — todos lidos em 2026-09-18
