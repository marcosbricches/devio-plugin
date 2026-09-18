# Filosofia de verificação em projetos conduzidos por agente

**Data:** 2026-09-18

**Pergunta:** O que a comunidade e a Anthropic recomendam sobre verificação em projetos conduzidos
por agente — o que merece teste, portões por tipo de mudança, revisor independente de outro
modelo, e o custo de teste em excesso — em fontes primárias, sem propor estrutura nova.

---

## 1. O que a Anthropic diz sobre verificação em Claude Code

### Fato documentado

A página oficial "Best practices for Claude Code" (code.claude.com/docs/en/best-practices, sem
data de publicação visível na página, capturada em 2026-09-18) tem uma seção chamada **"Give
Claude a way to verify its work"**, com a citação:

> "Give Claude a check it can run: tests, a build, a screenshot to compare. It's the difference
> between a session you watch and one you walk away from."

E o mecanismo declarado:

> "Claude stops when the work looks done. Without a check it can run, 'looks done' is the only
> signal available, and you become the verification loop: every mistake waits for you to notice
> it. Give Claude something that produces a pass or fail, and the loop closes on its own."

A doc lista quatro formas de fazer o "check" pesar sobre a parada, em ordem crescente de rigor:
(1) pedir no mesmo prompt para rodar e iterar; (2) `/goal` — um avaliador separado confere a
condição a cada turno; (3) **Stop hook** — script determinístico que bloqueia o fim do turno até
passar (com um teto: "Claude Code overrides the hook and ends the turn after 8 consecutive
blocks"); (4) **segunda opinião** — um subagente de verificação ou workflow que tenta refutar o
próprio achado, citado assim:

> "a verification subagent or a dynamic workflow that checks its own findings has a fresh model
> try to refute the result, so the agent doing the work isn't the one grading it."

A doc pede evidência, não afirmação:

> "Have Claude show evidence rather than asserting success: the test output, the command it ran
> and what it returned, or a screenshot of the result."

Na lista de "common failure patterns", nomeia exatamente o risco que motiva tudo isso:

> "**The trust-then-verify gap.** Claude produces a plausible-looking implementation that doesn't
> handle edge cases. Fix: Always provide verification (tests, scripts, screenshots). If you can't
> ship it, don't ship it." *(a doc usa "if you can't verify it, don't ship it")*

Uma seção própria, **"Add an adversarial review step"**, prescreve revisor independente dentro do
próprio Claude Code (sem falar do Codex, que é de outra empresa):

> "The longer Claude works unattended, the more an independent check matters before you count the
> work as done. A reviewer running in a fresh subagent context sees only the diff and the criteria
> you give it, not the reasoning that produced the change, so it evaluates the result on its own
> terms."

E o aviso inverso, sobre excesso de achado de revisor:

> "A reviewer prompted to find gaps will usually report some, even when the work is sound, because
> that is what it was asked to do. Chasing every finding leads to over-engineering: extra
> abstraction layers, defensive code, and tests for cases that can't happen. Tell the reviewer to
> flag only gaps that affect correctness or the stated requirements, and treat the rest as
> optional."

O `/code-review` embutido é descrito como um caso específico desse padrão: "reviews the current
diff for bugs in a fresh subagent and returns findings to the session."

Sobre **hooks como portão**, a documentação de hooks (code.claude.com/docs/en/hooks, via busca —
não lida em texto integral) declara, segundo o resumo verificado por busca: um `PreToolUse` que
sai com código 2 bloqueia a chamada de ferramenta e devolve o `stderr` ao modelo como motivo; e um
`Stop` hook que sai com código 2 impede o agente de terminar a sessão — mecanismo citado como "how
you prevent agents from declaring victory before all features are implemented or all tests pass."
Isso não foi lido na página primária palavra por palavra (só via resumo de busca), então fica
registrado como fato de menor confiança que as citações acima, que vieram do fetch direto da
página.

### Opinião/interpretação

A ênfase da Anthropic é toda operacional — "dê um jeito de verificar" — e não normativa sobre *o
que* merece teste versus inspeção visual. A doc não entra em pirâmide de teste, tamanho de teste
ou o que é "teste de composição". Ela assume que qualquer verificação automatizável (teste,
build, lint, diff de screenshot) é preferível a "parece pronto", e trata a inspeção visual apenas
como uma forma de check ("a browser screenshot compared against a design"), não como uma categoria
à parte com regra própria — diferente da distinção que a ADR-0017 faz entre teste (comportamento)
e inspeção (composição).

---

## 2. O que cada fonte diz que merece teste automatizado — e o que não

### Fato documentado

**Matt Pocock, skill `tdd`** (`C:\Users\marco\.claude\plugins\cache\mattpocock\mattpocock-skills\1.2.3\skills\engineering\tdd\SKILL.md`):

> "Tests verify behavior through public interfaces, not implementation details. Code can change
> entirely; tests shouldn't."

> "**Test only at pre-agreed seams.** Before writing any test, write down the seams under test and
> confirm them with the user. No test is written at an unconfirmed seam."

Lista de antipadrões nomeados: **implementation-coupled** ("the tell: the test breaks when you
refactor but behavior hasn't changed"), **tautological** (asserção que recalcula o valor esperado
do mesmo jeito que o código, "passes by construction"), e **horizontal slicing** (escrever todos os
testes antes de toda a implementação — "you test the shape of things rather than user-facing
behavior").

A skill `implement` amarra isso ao ciclo: "Use /tdd where possible, at pre-agreed seams. Run
typechecking regularly, single test files regularly, and the full test suite once at the end. [...]
use /code-review to review the work."

**Kent C. Dodds**, "Write tests. Not too many. Mostly integration." (kentcdodds.com/blog/write-tests,
13/07/2019): tese central atribuída a Guillermo Rauch — "Write tests. Not too many. Mostly
integration." Contra teste de detalhe de implementação: testar detalhe de implementação "slows you
down when refactoring. You should very rarely have to change tests when you refactor code." A
"Testing Trophy" substitui a pirâmide clássica priorizando integração pelo custo-benefício.

**Martin Fowler / Ham Vocke**, "The Practical Test Pyramid" (martinfowler.com/articles/practical-test-pyramid.html,
26/02/2018): forma da pirâmide —

> "Write lots of small and fast unit tests. Write some more coarse-grained tests and very few
> high-level tests that test your application from end to end."

Sobre o que não vale testar:

> "Don't worry, Kent Beck said it's ok. You won't gain anything from testing simple getters or
> setters or other trivial implementations (e.g. without any conditional logic)."

Sobre o custo do e2e: "End-to-End tests come with their own kind of problems. They are notoriously
flaky and often fail for unexpected and unforeseeable reasons" e "end-to-end tests require a lot
of maintenance and run pretty slowly" — daí "you should aim to reduce the number of end-to-end
tests to a bare minimum."

**Google Testing Blog**, "Test Sizes" (testing.googleblog.com/2010/12/test-sizes.html, 13/12/2010):
o post define categorias small/medium/large por escopo de processo, rede e I/O — confirmado só por
resumo de busca (o fetch direto não recuperou o corpo do artigo, só os comentários): small =
single-machine, single-thread, sem I/O real; medium = single-machine, multi-thread, localhost;
large = múltiplas máquinas. O achado independente e mais forte, do "Flaky Tests at Google" (mesmo
blog, via busca): "the larger the test [...] the more likely it is to be flaky."

**Onde entra "composição se revê olhando":** nenhuma das fontes de teste (Dodds, Fowler, Google)
usa esse vocabulário — elas discutem *nível* de teste (unitário/integração/e2e), não a fronteira
entre teste automatizado e inspeção visual de design. A fonte mais próxima é a doc da Anthropic,
que trata "screenshot comparado ao design" como só mais um tipo de check dentro do mesmo espectro
de verificação, sem separar composição visual como categoria não testável por princípio. **A
formulação exata da ADR-0017** — "um teste só existe se puder reprovar por um motivo que o design
não pode mudar" — não tem equivalente literal em nenhuma fonte lida; é uma extensão específica do
Viva Maracanã sobre o princípio geral de Dodds/Fowler contra teste de detalhe de implementação,
aplicada especificamente a decisões de composição visual (ver seção final).

**Jesse Vincent / obra/superpowers**: a skill `verification-before-completion` (lida via fetch do
arquivo bruto no GitHub) prescreve um ciclo de 5 passos antes de qualquer afirmação de sucesso —
identificar o comando que prova a afirmação, rodá-lo fresco, ler a saída inteira e o código de
saída, confirmar que a saída respalda a afirmação, só então afirmar. Princípio citado: "Evidence
before claims, always." Proíbe linguagem como "should", "probably", "seems to" antes de rodar o
comando. Isso é sobre *quando* declarar pronto, não sobre *o que* merece teste — mais próximo do
"portão verde encerra a verificação" do que da pirâmide de teste.

### Opinião/interpretação

Dodds e Fowler convergem, apesar da disputa "pirâmide vs. troféu": ambos tratam unitário como
barato-mas-de-confiança-limitada, e testes de ponta a ponta como caros e frágeis — a diferença é só
onde cada um prefere investir o meio da curva. Nenhum dos dois trata "teste de composição visual"
como uma categoria à parte com regra própria; a decisão de excluir esse tipo de verificação do
teste automatizado (delegando a "olhar") é uma escolha local do Viva Maracanã, coerente com o
espírito anti-implementation-coupling dessas fontes, mas não citada literalmente por nenhuma.

---

## 3. Quality gates por tipo de mudança — existe um padrão de "tabela mudou → verificação"?

### Fato documentado

A busca por "quality gate" em fontes de engenharia (Atlassian, Google SRE, ThoughtWorks Technology
Radar) não recuperou uma definição formal isolada nas fontes acessadas; o achado mais direto veio
do próprio Technology Radar da ThoughtWorks (via resumo de busca, sem fetch direto da edição/data
exata):

> "Developers have long relied on deterministic quality gates such as compilers, linters,
> structural tests and test suites; here, they're wired into agentic workflows so that failures
> trigger timely self-correction."

Isso é o Radar falando de **agentes usando quality gates existentes** (compiler, linter, testes)
como sinal de auto-correção — não uma prescrição de "que portão para qual tipo de mudança". Não
foi encontrada, nas fontes pedidas (Atlassian, Google SRE, ThoughtWorks), uma tabela ou matriz
"tipo de mudança → portão" equivalente à do Viva Maracanã. O padrão setorial de "quality gate" —
em CI/CD genérico — é histórico e vem de outra tradição (SonarQube popularizou o termo para "a
build falha se cobertura/duplicação/vulnerabilidade passar de um limiar"), não de uma matriz por
categoria de mudança.

A Anthropic, na mesma doc de best practices, tem uma matriz implícita de escolha de rigor — não por
*tipo de mudança*, mas por *quanto a sessão roda sem supervisão*: prompt único → `/goal` → Stop
hook → segunda opinião, citada acima na seção 1. Isso é o parente mais próximo, dentro das fontes
primárias lidas, de "grau de portão varia com o risco da mudança" — mas a variável dela é
autonomia da sessão, não categoria de arquivo tocado.

### Opinião/interpretação

Não há fonte primária, das pedidas, que estabeleça literalmente "mudou tabela X → rode verificação
Y" como prática nomeada e batizada na comunidade. A tabela "Portões por mudança" de
`docs/agents/especialistas-por-etapa.md` — que amarra tipo de arquivo tocado (documentação, CSS,
JS de movimento, par de cores, decisão de direção, rota/metadata, pendência, fechamento de leva) a
um comando ou processo específico — parece ser invenção local, não um padrão com nome na indústria.
O conceito mais próximo que a indústria tem é "risk-based testing"/"change-based testing" (não
verificado aqui por fonte primária pedida), que também amarra profundidade de verificação a
impacto da mudança, mas normalmente por *risco de negócio*, não por *tipo de arquivo*.

---

## 4. Revisor independente de outro modelo

### Fato documentado

**openai/codex-plugin-cc**, README (github.com/openai/codex-plugin-cc/blob/main/README.md, lido
via fetch em 2026-09-18):

- `/codex:review`: "Runs a normal Codex review on your current work. It gives you the same quality
  of code review as running `/review` inside Codex directly."
- `/codex:adversarial-review`: roda uma revisão "steerable" que "questions the chosen
  implementation and design", usada para "pressure-test assumptions, tradeoffs, failure modes, and
  whether a different approach would have been safer or simpler."
- `/codex:rescue`: entrega a tarefa ao subagente `codex:codex-rescue` para "investigate a bug",
  "try a fix", ou "continue a previous Codex task."
- **Review gate (Stop hook):** "When the review gate is enabled, the plugin uses a `Stop` hook to
  run a targeted Codex review based on Claude's response." Aviso explícito no README: "The review
  gate can create a long-running Claude/Codex loop and may drain usage limits quickly. Only enable
  it when you plan to actively monitor the session."

O README não formula explicitamente "por que um segundo modelo" — a razão fica implícita no
próprio produto: Codex roda como processo separado, com seu próprio julgamento, plugado no
`Stop` hook do Claude Code.

**Anthropic**, na mesma página de best practices (seção "Add an adversarial review step" e o
padrão "Writer/Reviewer" com duas sessões paralelas): a razão declarada para revisor independente
não é "outro modelo", é **contexto fresco**, sejam duas sessões do mesmo Claude ou um subagente:

> "A fresh context improves code review since Claude won't be biased toward code it just wrote."

E, para a variante multi-sessão: "have one Claude write tests, then another write code to pass
them" — o par escritor/revisor pode ser o mesmo modelo em duas janelas de contexto separadas; a
Anthropic não prescreve que o revisor precise ser um modelo diferente, só que precise não
compartilhar o raciocínio que produziu a mudança ("sees only the diff and the criteria you give
it, not the reasoning that produced the change").

**Matt Pocock**, skill `code-review`: usa dois subagentes em paralelo do mesmo executor (Standards
e Spec), justificando a separação por eixo, não por modelo: "A change can pass one axis and fail
the other [...] Reporting them separately stops one axis from masking the other." De novo, o
mecanismo de independência é contexto isolado, não modelo diferente.

### Opinião/interpretação

Nenhuma das três fontes (Anthropic, Pocock, Codex-plugin) argumenta que o ganho vem
especificamente de trocar de *fornecedor* de modelo — o argumento comum é falta de viés/contexto
compartilhado com quem implementou. O Codex-plugin é o único caso onde o revisor é literalmente
outro modelo (GPT via Codex), mas o README não faz a alegação de que isso por si é superior a um
subagente Claude fresco; é apenas o produto que a OpenAI construiu. O "revisor que não compartilha
o seu viés" do `especialistas-por-etapa.md` do Viva Maracanã (para direção de arte: "o olho julga a
tela; o código e a premissa ganham um revisor que não compartilha o seu viés") é uma leitura mais
forte do que qualquer fonte afirma — as fontes falam de viés de *contexto/autoria*, o Viva Maracanã
estende para viés de *modelo*, o que é coerente mas não citado em lugar nenhum como motivo
declarado.

---

## 5. Custo de teste em excesso, e "repita só após mudança"

### Fato documentado

**Martin Fowler / Vocke**: e2e "notoriously flaky", "require a lot of maintenance and run pretty
slowly"; recomendação de reduzir a "a bare minimum".

**Google**: quanto maior o teste (mais processo, mais rede), maior a chance de instabilidade — "the
larger the test [...] the more likely it is to be flaky" (Google Testing Blog, via busca).

**Kent Beck**, "Test Desiderata" (kentbeck_7670, Medium, outubro de 2019, via busca — não lido
palavra por palavra na fonte primária): descreve 12 propriedades desejáveis de teste como eixos em
tensão ("sliders"), incluindo *isolamento* — "tests should return the same results regardless of
the order in which they are run" — e o princípio geral de que nenhuma propriedade se abre mão sem
ganhar outra de valor maior. Isso é sobre qualidade de teste individual, não diretamente sobre
volume da suíte.

**DHH**, "TDD is dead. Long live testing." (dhh.dk/2014/tdd-is-dead-long-live-testing.html,
23/04/2014, lido via fetch): crítica ao acoplamento de teste unitário tradicional à arquitetura —
"Test-first units leads to an overly complex web of intermediary objects and indirection in order
to avoid doing anything that's 'slow'" e "It's given birth to some truly horrendous monstrosities
of architecture. A dense jungle of service objects, command patterns, and worse." Preferência
declarada por testes de sistema de nível mais alto em vez de unitário com tudo mockado: "I rarely
unit test in the traditional sense of the word, where all dependencies are mocked out [...] I'd
much rather replace those with even higher level system tests." Este post é datado e amplamente
contestado na própria comunidade (ver InfoQ, "tdd dead controversy") — trazido aqui como fato
histórico de uma posição pública influente, não como consenso.

**Jesse Vincent/superpowers, verification-before-completion**: o equivalente mais próximo a
"repita só após mudança" nas fontes lidas é "rodar fresco" (evidência tem de vir de execução real,
não de memória de execução anterior) — não é exatamente "não repita à toa", é o oposto:
não confie em verificação velha. O "portão verde encerra a verificação" (ADR-0017 / tabela de
portões) não tem equivalente textual direto em nenhuma fonte pedida; a formulação mais próxima é a
ideia geral de CI de "não rode o que não mudou", presente em ferramentas (cache de test runner,
Nx/Turborepo affected-only) mas não como princípio nomeado nas fontes de opinião lidas aqui.

**Anthropic**, sobre achado em excesso do revisor (repetido da seção 1): "Chasing every finding
leads to over-engineering: extra abstraction layers, defensive code, and tests for cases that
can't happen" — este é o único lugar, nas fontes pedidas, que nomeia diretamente **teste em
excesso como categoria de dano**, e prescreve o antídoto: "Tell the reviewer to flag only gaps
that affect correctness or the stated requirements, and treat the rest as optional."

### Opinião/interpretação

Não existe, nas fontes primárias pedidas, uma frase equivalente a "portão verde encerra a
verificação; repita só após mudança, falha ou pergunta nova" (ADR-0017/tabela de portões). O
espírito é compatível com o consenso "e2e é caro, não rode à toa" de Fowler/Google, mas a
formulação de regra de reexecução é local. A citação de Deque (57% dos problemas de acessibilidade
cobertos por automação, em `docs/agents/passe-manual.md`) não foi verificada como fonte primária
nesta pesquisa — não estava no escopo desta rodada e já é citada com atribuição no próprio
documento do repositório.

---

## 6. O que existe no repositório

Lido: `docs/adr/0017-o-que-merece-um-teste.md`, `docs/adr/0014-suite-e2e-isolada-e-conferida.md`,
`docs/agents/especialistas-por-etapa.md` (tabela "Portões por mudança"), `docs/agents/passe-manual.md`,
`package.json` (scripts `verificar`, `test:unit`, `test:e2e`), `tests/unit/rotas.test.ts`,
`tests/e2e/paginas.spec.ts`, `scripts/medicao/README.md`.

Resumo do que está lá, sem repetir o texto integral (citado nas seções acima onde relevante):

- **ADR-0017** decide a régua "reprova por um motivo que o design não pode mudar" e mapeia quatro
  camadas de teste a quatro arquivos/orçamentos: unitário (`tests/unit/*.test.ts`, < 20s dentro de
  `npm run verificar`), contrato de página (`tests/e2e/paginas.spec.ts`, um teste por rota, com
  `expect.soft`), contrato de site (`tests/e2e/site.spec.ts`), e interação
  (`tests/e2e/interacao.spec.ts`). Justifica com medição própria: suíte foi de 94% do código de
  teste em navegador e um arquivo de 1968 linhas medindo opacidade (07/09) para 47 testes em 1min3s
  (15/09).
- **ADR-0014** isola a suíte e2e por porta (3100), pasta de build (`.next-teste`), IP literal
  (`127.0.0.1`), reuso de servidor opt-in, e uma "guarda de identidade" que compara `BUILD_ID` em
  disco com o servido — motivada por 67 reprovações falsas medidas em 03/09, reduzidas a zero.
- **`especialistas-por-etapa.md`** tem a tabela "Portões por mudança" (documentação → diff lido;
  conteúdo/tradução/lógica → `npm run verificar`; CSS/tokens/composição/movimento → `verificar` +
  inspeção 375px/desktop; JS de movimento/medição/ferramenta → acima + `/codex:review`; par de
  cores → acima + `npm run contraste`; decisão de direção → `/codex:adversarial-review`; pendência
  do cliente → `verificar` + `npm run pendencias`; rota/metadata/sitemap/link/markup → `verificar`
  + `npm run test:e2e`; fechamento de leva → tudo + `npm run build` + `/codex:review --base` +
  passe manual). Fecha com a mesma frase da ADR-0017 sobre portão verde.
- **`passe-manual.md`** é o passo humano final de acessibilidade — teclado, leitor de tela, dados
  estruturados — declarando explicitamente o que a automação cobre ("cerca de 57% dos problemas de
  acessibilidade", atribuído à Deque) e o que fica para julgamento humano.
- **`package.json`**: `verificar` = `validate:conteudo && typecheck && lint && test:unit`;
  `test:e2e` roda Playwright à parte; nenhum dos dois chama o outro.
- **`tests/unit/rotas.test.ts`**: testa invariantes estruturais da coleção de rotas (id único,
  formato de caminho, rótulo existente nas mensagens, menu derivado nunca aponta pra rota não
  construída) — nunca conteúdo ou aparência. Comentários no arquivo justificam cada teste pelo
  defeito estrutural que ele impede, não pela regra de negócio momentânea.
- **`tests/e2e/paginas.spec.ts`**: um teste por rota, todo em `expect.soft`, cobrindo estrutura
  (um h1, sem salto de nível), links (nenhum morto, saída com aviso e `noopener`), imagem
  (`sizes`, no máximo uma prioritária), SEO (canonical, hreflang) e JSON-LD (nunca preço/oferta/
  avaliação) — exatamente o contrato descrito na ADR-0017, rodando com `reducedMotion: 'reduce'`.
- **`scripts/medicao/README.md`**: "o que teste não responde" — scripts que rodam contra o build
  de produção fora do CI, medindo contraste real, nitidez, LCP, CLS, percurso de foco por teclado.
  Não são testes com asserção binária; são instrumentos de medição que alimentam julgamento humano
  (passe manual) ou uma comparação numérica pontual.

---

## Onde o Viva Maracanã coincide, diverge, ou inventou a roda

**Coincide, com nome e respaldo direto na comunidade:**

- A regra central da ADR-0017 — teste não deve reprovar por mudança de composição, só por
  comportamento que sobrevive ao refactor — é a mesma tese de Dodds ("you should very rarely have
  to change tests when you refactor code") e do antipadrão "implementation-coupled" de Pocock
  ("the tell: the test breaks when you refactor but behavior hasn't changed"). O Viva Maracanã só
  aplicou essa tese, já batizada, ao caso específico de composição visual.
- Preferir teste unitário puro antes de navegador ("unitário antes de navegador", item 2 da
  ADR-0017) é a mesma hierarquia small→large de Google Testing Blog e a pirâmide de Fowler: teste
  mais barato e mais estável primeiro, e-2-e como último recurso, reduzido "a bare minimum".
- A justificativa de reduzir e2e por fragilidade e lentidão (94%→consolidado, 8min42s→1min30s na
  ADR-0014) reproduz o argumento textual de Fowler ("notoriously flaky", "run pretty slowly") e do
  Google ("the larger the test [...] the more likely it is to be flaky") — com números próprios
  medidos no repositório, não emprestados.
- "Portão verde encerra a verificação; repita só após mudança" tem primo direto no princípio geral
  de CI incremental (não citado aqui por fonte nomeada, mas prática difundida) e no espírito de
  `verification-before-completion` de Jesse Vincent — que também trata "rodar de novo, fresco"
  como a unidade mínima de confiança, embora com ênfase inversa (não confie em evidência velha,
  em vez de não repita à toa).
- Segunda opinião de contexto fresco antes de contar como pronto — seja `/codex:review` ou
  `/codex:adversarial-review` — coincide ponto a ponto com a seção "Add an adversarial review
  step" da própria Anthropic: revisor vê só o diff e o critério, não o raciocínio que produziu a
  mudança; e o aviso do Viva Maracanã contra "finding em excesso" (tratar achado do Codex "como
  defeito da rodada: corrige ou explica com causa") é mais rígido que o aviso da Anthropic contra
  over-engineering por perseguir todo achado — vale registrar que a Anthropic recomenda filtrar
  achado de revisor por relevância, e o processo do Viva Maracanã não documenta esse filtro; é uma
  lacuna a considerar, não um erro.

**Diverge, ou vai além do que a fonte diz:**

- Amarrar "revisor independente" a **outro modelo** (Codex/GPT em vez de um subagente Claude
  fresco) é uma escolha mais forte do que qualquer fonte lida prescreve. Anthropic e Pocock
  fundamentam a independência em contexto isolado, não em fornecedor diferente; o Viva Maracanã lê
  isso como "revisor que não compartilha o seu viés" e estende para viés de modelo. É uma hipótese
  razoável (dois modelos treinados diferente têm menos correlação de erro que duas janelas do
  mesmo modelo), mas não é fato documentado em nenhuma das fontes — é interpretação local.
- O plugin oficial da OpenAI (`codex-plugin-cc`) usa Codex **de dentro do Codex CLI**, chamado por
  hooks do Claude Code; o README nomeia o risco de loop longo Claude↔Codex drenando limite de uso.
  O Viva Maracanã evita esse modo automático (usa `/codex:review` e `/codex:adversarial-review`
  como comando explícito, não como Stop hook automático) — o que é mais conservador que o padrão
  que o próprio plugin oferece e disponibiliza por padrão desligado, e evita exatamente o risco que
  o README do Codex avisa.

**Inventou a roda (sem par direto na literatura pesquisada) — e se é boa:**

- A **tabela "Portões por mudança"** amarrando tipo de arquivo tocado (CSS, JS de movimento, par de
  cores, decisão de direção, pendência de cliente, rota/metadata) a um comando específico não tem
  equivalente nomeado nas fontes de quality gate pesquisadas (ThoughtWorks, ou o que se achou
  delas). O padrão de indústria mais próximo é "risk-based testing", que gradua por risco de
  negócio, não por tipo de arquivo — mas a ideia geral, "quanto mais a mudança pode quebrar
  silenciosamente, mais portão", é a mesma lógica, só que operacionalizada de um jeito mais
  concreto e verificável (arquivo tocado é fato objetivo; risco de negócio é julgamento). Isso é
  uma tradução prática defensável do princípio geral, provavelmente melhor para um agente seguir
  do que uma regra de risco abstrata, mas não é o vocabulário nem a métrica de nenhuma fonte lida.
- A distinção "teste vs. inspeção que se revê olhando" como duas categorias de verificação
  igualmente legítimas — em vez de tratar "olhar para a composição" como um substituto pior ou
  provisório do teste — não aparece formulada assim em nenhuma fonte. A Anthropic trata screenshot
  como só mais um tipo de "check" dentro do mesmo espectro binário passa/falha; o Viva Maracanã
  trata composição como **inerentemente não testável por design** (não "ainda não temos teste para
  isso", mas "não deveria ter teste, porque testar travaria a composição"). É uma posição mais
  forte e mais bem fundamentada operacionalmente (a ADR-0017 documenta o caso concreto de
  `home.spec.ts` com 1968 linhas morrendo na primeira troca de design) do que qualquer fonte
  consultada — e parece uma boa invenção: ela resolve exatamente o problema que Dodds e Pocock
  descrevem em abstrato ("implementation-coupled") para o caso específico, difícil de generalizar,
  de decisão visual.
- O **passe manual** com percentual de cobertura automatizável citado (57%, Deque) e checklist
  humano explícito para o resto é mais estruturado do que qualquer fonte de acessibilidade
  consultada aqui (nenhuma foi pedida nesta rodada além da citação já presente no repo) — não foi
  verificado como prática nomeada na indústria, mas o formato "diga o que a máquina cobre, o resto
  é seu" é coerente com o espírito de "não afirme sem evidência" de Jesse Vincent.
- O que a comunidade faz e o Viva Maracanã não: nenhuma das fontes lidas discute portão específico
  para "conteúdo do cliente" ou "pendência com dono" como categoria de verificação — isso é
  necessidade de domínio do projeto (ADR-0022, texto do cliente sobe como veio), não uma prática
  geral de engenharia de software; não há o que comparar.

---

## Fontes

- Anthropic, "Best practices for Claude Code" — https://code.claude.com/docs/en/best-practices
  (capturado em 2026-09-18, sem data de publicação visível na página)
- Anthropic, "Hooks reference" — https://code.claude.com/docs/en/hooks (não lido por fetch direto
  nesta pesquisa; citações vieram de resumo de busca em 2026-09-18)
- obra/superpowers (Jesse Vincent), repositório e skill `verification-before-completion` —
  https://github.com/obra/superpowers e
  https://raw.githubusercontent.com/obra/superpowers/main/skills/verification-before-completion/SKILL.md
  (lido em 2026-09-18)
- Matt Pocock, skills `tdd`, `implement`, `code-review`, `diagnosing-bugs`, `codebase-design` —
  arquivos locais em
  `C:\Users\marco\.claude\plugins\cache\mattpocock\mattpocock-skills\1.2.3\skills\engineering\`
  (lidos em 2026-09-18, sem data de versão além de "1.2.3" no caminho)
- Kent C. Dodds, "Write tests. Not too many. Mostly integration." —
  https://kentcdodds.com/blog/write-tests (13/07/2019)
- Kent C. Dodds, "The Testing Trophy and Testing Classifications" —
  https://kentcdodds.com/blog/the-testing-trophy-and-testing-classifications (referenciado por
  busca, não lido por fetch direto)
- Martin Fowler / Ham Vocke, "The Practical Test Pyramid" —
  https://martinfowler.com/articles/practical-test-pyramid.html (26/02/2018)
- Google Testing Blog, "Test Sizes" — https://testing.googleblog.com/2010/12/test-sizes.html
  (13/12/2010; corpo do artigo não recuperado por fetch, só metadados e comentários — definições de
  small/medium/large vieram de resumo de busca)
- Google Testing Blog, "Flaky Tests at Google and How We Mitigate Them" —
  https://testing.googleblog.com/2016/05/flaky-tests-at-google-and-how-we.html (referenciado por
  busca)
- openai/codex-plugin-cc, README — https://github.com/openai/codex-plugin-cc/blob/main/README.md
  (lido em 2026-09-18)
- ThoughtWorks Technology Radar, citação sobre quality gates em fluxo agêntico (edição/data exata
  não identificada — achado só por resumo de busca em 2026-09-18)
- Kent Beck, "Test Desiderata" — https://medium.com/@kentbeck_7670/test-desiderata-94150638a4b3
  (outubro de 2019, referenciado por busca, não lido por fetch direto)
- DHH, "TDD is dead. Long live testing." —
  https://dhh.dk/2014/tdd-is-dead-long-live-testing.html (23/04/2014, lido em 2026-09-18)
- aihero.dev / Matt Pocock, "Tracer Bullets: Keeping AI Slop Under Control" —
  https://www.aihero.dev/tracer-bullets (referenciado por busca, não lido por fetch direto)
- aihero.dev, "Essential AI Coding Feedback Loops For TypeScript Projects" —
  https://www.aihero.dev/essential-ai-coding-feedback-loops-for-type-script-projects (referenciado
  por busca)
- Repositório Viva Maracanã: `docs/adr/0017-o-que-merece-um-teste.md`,
  `docs/adr/0014-suite-e2e-isolada-e-conferida.md`, `docs/agents/especialistas-por-etapa.md`,
  `docs/agents/passe-manual.md`, `package.json`, `tests/unit/rotas.test.ts`,
  `tests/e2e/paginas.spec.ts`, `scripts/medicao/README.md` (lidos em 2026-09-18)
