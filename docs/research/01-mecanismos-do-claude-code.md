# Mecanismos de configuração do Claude Code — o que é documentado, em fonte primária

Data: 2026-09-18

Pergunta: para embasar a decisão de transformar o método de trabalho deste repositório em
configuração global do Claude Code, o que a documentação primária realmente diz sobre cada
mecanismo — CLAUDE.md (global/projeto/local/gerenciado), skill, plugin, marketplace, hook,
auto-memory e sub-agente? Este documento não propõe estrutura nova; levanta fato com citação.

Convenção: cada seção separa **Fato documentado** (citação literal + URL + data da fonte) de
**Opinião/interpretação** (leitura minha do que isso implica, marcada como tal).

---

## 1. CLAUDE.md global vs. projeto vs. local vs. gerenciado — e onde cada coisa vai

### Fato documentado

A doc de memória (`code.claude.com/docs/en/memory`) lista quatro escopos de CLAUDE.md, em ordem
de carregamento (do mais amplo ao mais específico), com propósito e exemplos de uso:

| Escopo | Local | Propósito | Exemplos de uso |
| --- | --- | --- | --- |
| Managed policy | `/etc/claude-code/CLAUDE.md` (Linux/WSL), equivalentes macOS/Windows | Instruções da organização, geridas por TI | Padrão de código da empresa, políticas de segurança, compliance |
| User instructions | `~/.claude/CLAUDE.md` | Preferências pessoais para todos os projetos | Estilo de código pessoal, atalhos de ferramenta |
| Project instructions | `./CLAUDE.md` ou `./.claude/CLAUDE.md` | Instruções compartilhadas com o time | Arquitetura do projeto, padrão de código, workflows comuns |
| Local instructions | `./CLAUDE.local.md` | Preferências pessoais só deste projeto, no `.gitignore` | URLs de sandbox, dados de teste preferidos |

> "For large projects, you can break instructions into topic-specific files using project rules."
> "CLAUDE.md files are additive: all levels contribute content to Claude's context simultaneously
> ... When instructions conflict, Claude uses judgment to reconcile them, with more specific
> instructions typically taking precedence." (features-overview)

Sobre **tamanho**: "**Size**: target under 200 lines per CLAUDE.md file. Longer files consume
more context and reduce adherence." E, no `best-practices`: "Keep it concise. For each line, ask:
'Would removing this cause Claude to make mistakes?' If not, cut it. **Bloated CLAUDE.md files
cause Claude to ignore your actual instructions!**"

A tabela do `best-practices` diz o que incluir e o que excluir:

| ✅ Include | ❌ Exclude |
| --- | --- |
| Bash commands Claude can't guess | Anything Claude can figure out by reading code |
| Code style rules that differ from defaults | Standard language conventions Claude already knows |
| Testing instructions and preferred test runners | Detailed API documentation (link to docs instead) |
| Repository etiquette (branch naming, PR conventions) | Information that changes frequently |
| Architectural decisions specific to your project | Long explanations or tutorials |
| Developer environment quirks (required env vars) | File-by-file descriptions of the codebase |
| Common gotchas or non-obvious behaviors | Self-evident practices like "write clean code" |

Sobre a diferença entre CLAUDE.md e skill (`features-overview`, aba "CLAUDE.md vs Skill"):

> "**Put it in CLAUDE.md** if Claude should always know it: coding conventions, build commands,
> project structure, 'never do X' rules. **Put it in a skill** if it's reference material Claude
> needs sometimes (API docs, style guides) or a workflow you trigger with `/<name>` (deploy,
> review, release)."

E a própria doc de memória, na seção "When to add to CLAUDE.md":

> "Keep it to facts Claude should hold in every session: build commands, conventions, project
> layout, 'always do X' rules. If an entry is a multi-step procedure or only matters for one part
> of the codebase, move it to a skill or a path-scoped rule instead."

Sobre `AGENTS.md`: "Claude Code reads `CLAUDE.md`, not `AGENTS.md`. If your repository already
uses `AGENTS.md` for other coding agents, create a `CLAUDE.md` that imports it so both tools read
the same instructions without duplicating them." A forma recomendada é `@AGENTS.md` no topo do
CLAUDE.md do projeto — exatamente o padrão que este repositório já usa.

Auto memory tem propósito e tipo diferentes de CLAUDE.md (tabela "CLAUDE.md vs auto memory"):

| | CLAUDE.md files | Auto memory |
| --- | --- | --- |
| Who writes it | Você | Claude |
| What it contains | Instructions and rules | Learnings and patterns |
| Use for | Coding standards, workflows, project architecture | Your preferences, corrections you give Claude, project context Claude can't derive from the code |

Sobre excesso de instrução em geral: "Both are loaded at the start of every conversation. Claude
treats them as context, not enforced configuration. To block an action regardless of what Claude
decides, use a PreToolUse hook instead. **The more specific and concise your instructions, the
more consistently Claude follows them.**"

E no padrão de falha documentado em `best-practices`: "**The over-specified CLAUDE.md.** If your
CLAUDE.md is too long, Claude ignores half of it because important rules get lost in the noise.
Fix: Ruthlessly prune. If Claude already does something correctly without the instruction, delete
it or convert it to a hook."

Fonte: <https://code.claude.com/docs/en/memory> (fetch em 2026-09-18); tabela e citações de
`best-practices` em <https://code.claude.com/docs/en/best-practices> (fetch em 2026-09-18, essa
página é o destino do redirect 308 de `anthropic.com/engineering/claude-code-best-practices` —
ou seja, o post de engenharia da Anthropic foi fundido na doc oficial); `features-overview` em
<https://code.claude.com/docs/en/features-overview> (fetch em 2026-09-18).

### Opinião/interpretação

A doc separa claramente três eixos: (1) **escopo** — quem compartilha o arquivo (máquina inteira,
usuário, time, indivíduo no projeto); (2) **carga** — CLAUDE.md carrega sempre, skill carrega sob
demanda; (3) **natureza do conteúdo** — regra sempre válida vs. procedimento de várias etapas vs.
fato específico de uma sessão/decisão. O texto "if an entry is a multi-step procedure... move it
to a skill" é a frase mais operacional para decidir se algo é CLAUDE.md ou skill.

---

## 2. Anatomia de SKILL.md

### Fato documentado

Estrutura mínima: "Every skill needs a `SKILL.md` file with two parts: YAML frontmatter between
`---` markers that tells Claude when to use the skill, and markdown content with the instructions
Claude follows when the skill runs." O nome do diretório vira o comando (`.claude/skills/deploy/
SKILL.md` → `/deploy`).

Campos de frontmatter (com citação literal onde a doc frisa comportamento):

- `name` — rótulo de exibição; opcional, default é o nome do diretório. "In a personal or project
  skill, `name` sets only the display label shown in skill listings, and the command still comes
  from the directory name."
- `description` — "Claude uses this to decide when to apply the skill." É o **gatilho**: o texto
  que o modelo compara com a tarefa do usuário para decidir invocar.
- `when_to_use` — "Appended to `description` in the skill listing and counts toward the
  1,536-character cap."
- `disable-model-invocation` — "Set to `true` to prevent Claude from automatically loading this
  skill. Use for workflows you want to trigger manually with `/name`." Nesse caso a descrição
  **não** entra em contexto: "Description NOT in context, full skill loads when you invoke."
- `user-invocable` — "Set to `false` when only Claude should invoke the skill: Claude Code hides
  it from the `/` menu and doesn't run it when you type `/name`. Use for background knowledge
  users shouldn't invoke directly."
- `allowed-tools` / `disallowed-tools` — ferramentas liberadas/removidas "for the turn that
  invokes this skill. The grant clears when you send your next message."
- `model` / `effort` — troca modelo/esforço só durante a skill ativa; "The session model resumes
  when you send your next prompt."
- `context: fork` + `agent:` — roda a skill num sub-agente forkado; `background` (default `true`)
  controla se espera o resultado no mesmo turno.
- `argument-hint`, `arguments` — dica de autocomplete e nomes posicionais para `$name`.
- `paths` — "Glob patterns that limit when this skill is activated. ... Claude loads the skill
  automatically only when working with files matching the patterns."
- `hooks` — "Hooks that Claude Code registers when the skill is invoked and keeps running for the
  rest of the session."
- `license`, `compatibility` — do padrão externo agentskills.io; "Claude Code accepts the field
  but doesn't act on it."

Sobre como o modelo decide invocar: a descrição é sempre carregada em contexto por padrão (exceto
com `disable-model-invocation: true`), e "Claude matches your task against skill descriptions to
decide which are relevant. If descriptions are vague or overlap, Claude may load the wrong skill
or miss one that would help."

Progressive disclosure — tamanho recomendado e por quê: "**Keep `SKILL.md` under 500 lines. Move
detailed reference material to separate files.**" E sobre custo recorrente: "Keep the body itself
concise. Once a skill loads, its content stays in context across turns, so every line is a
recurring token cost. State what to do rather than narrating how or why, and apply the same
conciseness test you would for CLAUDE.md content."

A doc distingue dois tipos de conteúdo dentro de uma skill: "**Reference content** adds knowledge
Claude applies to your current work... **Task content** gives Claude step-by-step instructions
for a specific action... These are often actions you want to invoke directly with `/skill-name`."

Pastas de apoio dentro da skill — estrutura documentada:

```
my-skill/
├── SKILL.md (required - overview and navigation)
├── reference.md (detailed API docs - loaded when needed)
├── examples.md (usage examples - loaded when needed)
└── scripts/
    └── helper.py (utility script - executed, not loaded)
```

> "Reference supporting files from `SKILL.md` so Claude knows what each file contains and when to
> load it."

O post de engenharia da Anthropic sobre Agent Skills (16 de outubro de 2025) descreve a mesma
lógica em três níveis: "Like a well-organized manual that starts with a table of contents, then
specific chapters, and finally a detailed appendix, skills let Claude load information only as
needed." Nível 1 = nome+descrição no prompt de sistema; nível 2 = corpo do SKILL.md quando
relevante; nível 3+ = arquivos anexos (scripts, reference.md) carregados só quando precisos.

Fontes: <https://code.claude.com/docs/en/skills> (fetch 2026-09-18); post de Agent Skills
<https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills>
(publicado 2025-10-16, fetch 2026-09-18).

### Opinião/interpretação

A doc trata `references/` e `assets/` como convenção de nomenclatura útil, não como pastas com
tratamento especial pelo runtime — o que importa é que `SKILL.md` referencie o arquivo pelo
caminho relativo (`[reference.md](reference.md)`), e o Claude decide quando ler. `scripts/` é
diferente: contém código para **executar**, não para carregar em contexto.

---

## 3. Plugin pessoal e marketplace local

### Fato documentado

Estrutura de plugin (`.claude-plugin/plugin.json` na raiz do plugin, com `skills/`, `commands/`,
`agents/`, `hooks/`, `.mcp.json`, `.lsp.json`, `monitors/`, `bin/`, `settings.json` como
**irmãos** de `.claude-plugin/`, nunca dentro dela):

> "**Common mistake**: Don't put `commands/`, `agents/`, `skills/`, or `hooks/` inside the
> `.claude-plugin/` directory. Only `plugin.json` goes inside `.claude-plugin/`."

Campos de `plugin.json`: `name` (namespace das skills, ex. `/my-first-plugin:hello`),
`description`, `version` (opcional — controla quando o usuário recebe atualização), `author`.

Hooks de plugin vão em `hooks/hooks.json`, com o mesmo formato do bloco `hooks` do
`settings.json`:

```json
{
  "hooks": {
    "PostToolUse": [
      { "matcher": "Write|Edit", "hooks": [{ "type": "command", "command": "..." }] }
    ]
  }
}
```

Duas formas de desenvolver um plugin pessoal sem marketplace:

1. `--plugin-dir ./meu-plugin` ao rodar `claude` — "The `--plugin-dir` flag is useful for
   development and testing. When you're ready to share your plugin with others, see [marketplace
   docs]." Aceita também `.zip` e múltiplos `--plugin-dir` na mesma chamada, ou uma pasta com
   vários plugins dentro (requer Claude Code v2.1.265+).
2. `claude plugin init meu-tool` — "This creates `~/.claude/skills/my-tool/` with a
   `.claude-plugin/plugin.json` manifest and a starter `SKILL.md`. On the next session it loads
   as `my-tool@skills-dir` **with no marketplace or install step.**" Essa é a rota documentada
   para um plugin pessoal permanente sem precisar de marketplace nenhuma.

Marketplace local (`marketplace.json`, obrigatoriamente em `.claude-plugin/marketplace.json`):
campos obrigatórios `name` (kebab-case), `owner` (objeto com `name` obrigatório), `plugins`
(array). Cada entrada de plugin exige `name` e `source`; `source` pode ser um caminho relativo
("Paths resolve relative to the marketplace root, which is the directory containing
`.claude-plugin/`"), um repo GitHub, uma URL git, subdiretório de monorepo git, pacote npm,
arquivo zip, ou uma fonte `command`.

Instalação a partir de repositório git local ou diretório: `/plugin marketplace add ./my-marketplace`
seguido de `/plugin install quality-review-plugin@my-marketplace`. Atualização:
`/plugin marketplace update` — "Users refresh their local copy with `/plugin marketplace update`."

Versionamento: "Setting `version` means users only receive updates when you change this field, so
bump it on every release." Para fontes git sem `version` explícita, "Claude Code uses the source's
resolved commit SHA, so users get an update whenever that commit changes." Aviso explícito: "If
you declare a `version` and push new commits without changing that string, existing users of
those sources keep the cached copy, because Claude Code sees the same version."

`strict` (default `true`): "`plugin.json` is the authority. The marketplace entry can supplement
it with additional components, and both sources are merged." Com `strict: false`, a entrada do
marketplace é a definição inteira e um `plugin.json` com componentes próprios vira conflito.

Validação: `claude plugin validate .` ou `/plugin validate .` — checa sintaxe e schema, não
comportamento.

`claude plugin eval`: "runs your plugin against a suite of test cases and scores the results.
Each case is a realistic prompt plus one or more graders... Use evals to measure how reliably
your plugin steers Claude to the right outcome, to catch regressions when you change the plugin
or a new model ships, and to see what the plugin contributes compared with no plugin at all."
`claude plugin eval init` gera a suíte perguntando sobre o plugin. Formato de caso é distinto do
`evals/evals.json` do plugin skill-creator.

`/skill-doctor`: **não existe** como comando nativo/bundled na documentação atual — o comando
nativo equivalente é `/doctor` (alias `/checkup`), que "Finds unused skills, MCP servers, and
plugins versus their context cost, flags slow hooks... Deduplicates local CLAUDE.md files against
checked-in ones, trims checked-in CLAUDE.md files... Reports findings first and asks for
confirmation before changing anything." `claude doctor` (fora de sessão) imprime diagnóstico
read-only. Existe também um relatório separado, `/skill-doctor`, mencionado em cobertura de
terceiros (dev.to, 2026) como um recurso nativo introduzido em Claude Code v2.1.261 (4 de
setembro de 2026) que mostra "which loaded skills go unused and what they cost in context" —
mas essa página não apareceu nas páginas oficiais indexadas consultadas (`skills`, `commands`,
`plugins`); pode ser um comando novo ainda não documentado na doc consultada, ou um plugin de
terceiro com o mesmo nome (existem pelo menos dois plugins de terceiros chamados
`skill-doctor` no GitHub, não afiliados à Anthropic). Nenhum plugin `skill-doctor` está instalado
neste ambiente (`~/.claude/plugins/cache` não o lista).

Fontes: <https://code.claude.com/docs/en/plugins> (fetch 2026-09-18),
<https://code.claude.com/docs/en/plugin-marketplaces> (fetch 2026-09-18),
<https://code.claude.com/docs/en/plugin-evals> (fetch 2026-09-18),
<https://code.claude.com/docs/en/commands> (fetch 2026-09-18, para `/doctor`);
busca web sobre `/skill-doctor` (2026-09-18, fontes terceiras, sem confirmação na doc oficial).

### Opinião/interpretação

Para um método pessoal de um único operador (Marcos), a rota mais leve documentada é
`claude plugin init` dentro de `~/.claude/skills/`, que dá plugin com `plugin.json` sem exigir
marketplace nem repositório git — carrega automaticamente toda sessão. Marketplace só entra em
jogo se o objetivo for compartilhar com outra pessoa/máquina ou versionar formalmente.

---

## 4. Hooks

### Fato documentado

Definição central: "Hooks are user-defined shell commands. Claude Code runs them at specific
points in its lifecycle, which gives you **deterministic control**: certain actions always happen
rather than relying on the LLM to choose to run them."

Quando usar hook em vez de instrução: a tabela comparativa de `features-overview` (aba "Hook vs
Skill") resume os dois lados:

| Aspecto | Hook | Skill |
| --- | --- | --- |
| Determinism | Always fires on its event; the trigger is guaranteed | Claude interprets the instructions; outcome can vary |
| Best for | Linting after edits, blocking unsafe commands, logging, notifications | Workflows that need reasoning, reference material, multi-step tasks |

> "**Put guardrails in hooks.** An instruction like 'never edit `.env`' in CLAUDE.md or a skill is
> a request, not a guarantee. A `PreToolUse` hook that blocks the edit is enforcement. If a rule
> must hold every time, make it a hook rather than a prompt instruction."

E em `best-practices`: "Use hooks for actions that must happen every time with zero exceptions...
Unlike CLAUDE.md instructions which are advisory, hooks are deterministic and guarantee the
action happens." A doc de memória repete a mesma regra do outro lado: "To block an action
regardless of what Claude decides, use a PreToolUse hook instead," e no troubleshooting: "If the
instruction is something that must run at a specific point, such as before every commit or after
each file edit, write it as a hook instead. Hooks execute as shell commands at fixed lifecycle
events and apply regardless of what Claude decides to do."

Eventos disponíveis (lista completa levantada em `hooks` reference): `SessionStart`, `SessionEnd`,
`Setup`, `UserPromptSubmit`, `UserPromptExpansion`, `Stop`, `StopFailure`, `PreToolUse`,
`PostToolUse`, `PostToolUseFailure`, `PostToolBatch`, `PermissionRequest`, `PermissionDenied`,
`SubagentStart`, `SubagentStop`, `TaskCreated`, `TaskCompleted`, `TeammateIdle`, `FileChanged`,
`CwdChanged`, `DirectoryAdded`, `ConfigChange`, `InstructionsLoaded`, `WorktreeCreate`,
`WorktreeRemove`, `PreCompact`, `PostCompact`, `PreModelSwitch`, `PostModelSwitch`,
`MessageDisplay`, `Notification`, `Elicitation`, `ElicitationResult`.

Formato de `hooks/hooks.json` num plugin (idêntico ao bloco `hooks` de um settings file, mas em
arquivo próprio na raiz do plugin):

```json
{
  "description": "Automatic code formatting",
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write|Edit",
        "hooks": [
          { "type": "command", "command": "${CLAUDE_PLUGIN_ROOT}/scripts/format.sh", "timeout": 30 }
        ]
      }
    ]
  }
}
```

Tipos de hook: `command` (shell), `http` (POST), `mcp_tool`, `prompt` (avalia com um modelo,
Haiku por padrão: "For decisions that require judgment rather than deterministic rules, use
`type: "prompt"` hooks"), `agent` (roda um sub-agente com ferramentas).

Fontes: <https://code.claude.com/docs/en/hooks-guide> (fetch 2026-09-18),
<https://code.claude.com/docs/en/hooks> (fetch 2026-09-18),
<https://code.claude.com/docs/en/features-overview> (fetch 2026-09-18).

### Opinião/interpretação

O critério documentado é objetivo: se a regra precisa valer **sempre, sem exceção e sem depender
do juízo do modelo**, é hook; se depende de julgamento ou é conhecimento aplicável (não uma ação
de sistema), é CLAUDE.md/skill. O hook `bash-cmdline-guard.js` deste repositório é exatamente esse
caso de manual: bloqueia (`exit 2`) em vez de pedir para o modelo lembrar do teto de linha de
comando — e é isso que a doc chama de escolha correta ("Put guardrails in hooks").

---

## 5. Auto-memory

### Fato documentado

Definição: "Auto memory lets Claude accumulate knowledge across sessions without you writing
anything. As it works, Claude saves four kinds of notes for itself." Os quatro tipos, com `type`
no frontmatter do arquivo de memória:

- `user` — "your role, expertise, and working preferences"
- `feedback` — "corrections you give Claude and approaches you confirm"
- `project` — "ongoing work, deadlines, and decisions that Claude can't derive from the code or
  git history"
- `reference` — "where to find information outside the project, such as an issue tracker or
  dashboard"

O que **não** deve ir: "Claude skips anything it can derive from the codebase, such as
architecture, file paths, or debugging fixes. It also skips anything your CLAUDE.md files already
say." E "Claude doesn't save something every session. It decides what's worth remembering based
on whether the information would be useful in a future conversation."

Local: `~/.claude/projects/<project>/memory/`, um `MEMORY.md` índice + um arquivo por memória.
Carregamento: "The first 200 lines of `MEMORY.md`, or the first 25KB, whichever comes first, are
loaded at the start of every conversation." Os arquivos de tópico individuais **não** carregam no
início: "Claude Code doesn't load topic files such as `user_role.md` or `feedback_testing.md` at
startup. Claude reads them on demand using its standard file tools when it needs the information."

Isso é escopo por **repositório git**, compartilhado entre worktrees, e local à máquina: "Auto
memory is machine-local... Files are not shared across machines or cloud environments."

Fontes: <https://code.claude.com/docs/en/memory> (fetch 2026-09-18).

### Opinião/interpretação

A doc não diz explicitamente "não coloque procedimento em auto-memory" (como diz para CLAUDE.md),
mas a definição dos quatro tipos — preferência, correção, contexto de projeto não derivável,
referência externa — não inclui "procedimento repetível de várias etapas". Um arquivo de memória
com "How to apply" de 4 passos numerados que deveria rodar toda vez que o agente compõe uma tela
se parece mais com o "task content" que a doc de skills descreve do que com uma nota de
aprendizado.

---

## 6. Sub-agentes e agents/*.md em plugin

### Fato documentado

Quando usar sub-agente vs. thread principal (`sub-agents`):

> Main conversation: "The task needs frequent back-and-forth or iterative refinement"; "Multiple
> phases share significant context, such as planning, implementation, and testing"; "You're
> making a quick, targeted change"; "Latency matters."
>
> Subagent: "The task produces verbose output you don't need in your main context"; "You want to
> enforce specific tool restrictions or permissions"; "The work is self-contained and can return
> a summary."

Campo `model`: aceita alias (`sonnet`, `opus`, `haiku`, `fable`), ID completo, ou `inherit`
("use the same model as the main conversation"). Ordem de resolução: parâmetro por invocação →
frontmatter do sub-agente → variável de ambiente `CLAUDE_CODE_SUBAGENT_MODEL` → modelo da
conversa principal.

Outros campos de frontmatter: `name` (obrigatório, "Hooks receive this value as `agent_type`"),
`description` (obrigatório, "When Claude should delegate to this subagent"), `tools`,
`disallowedTools`, `permissionMode`, `maxTurns`, `skills` ("Skills to preload into the subagent's
context at startup"), `mcpServers`, `hooks`, `memory` (`user`/`project`/`local`), `background`,
`omitClaudeMd`, `effort`, `isolation: worktree`, `color`, `initialPrompt`, `experimental`.

Em plugin: "Claude Code scans `.claude/agents/` and `~/.claude/agents/` recursively... a subfolder
inside a plugin's `agents/` directory becomes part of the scoped identifier: a file at
`agents/review/security.md` in plugin `my-plugin` registers as `my-plugin:review:security`."

Memória de sub-agente (`memory` field): três escopos — `user`
(`~/.claude/agent-memory/<nome>/`, "the subagent should remember learnings across all projects"),
`project` (`.claude/agent-memory/<nome>/`, versionável), `local`
(`.claude/agent-memory-local/<nome>/`, não versionado). "Subagent memory is part of auto memory:
if you turn auto memory off... the `memory` field has no effect."

Fontes: <https://code.claude.com/docs/en/sub-agents> (fetch 2026-09-18).

### Opinião/interpretação

O campo `skills:` no frontmatter do sub-agente é o mecanismo documentado para pré-carregar
conhecimento específico de etapa (ex.: um sub-agente "revisor de direção de arte" que já chega
com a skill de composição carregada) — algo que hoje neste repositório se faz manualmente citando
`docs/agents/especialistas-por-etapa.md` no prompt.

---

## Onde o Viva Maracanã coincide, diverge, ou inventou a roda

**CLAUDE.md global (`~/.claude/CLAUDE.md`, 39 linhas).** Coincide no tamanho (bem abaixo de 200
linhas) e no gênero de conteúdo — quase tudo é regra determinística sobre o ambiente Windows/Git
Bash (teto de linha de comando), que é exatamente "developer environment quirk" e "gotcha" que a
doc recomenda manter em CLAUDE.md. Mas a doc também diz "Put guardrails in hooks... if a rule must
hold every time." O texto do CLAUDE.md global já é 100% guardrail determinístico ("Regra: conteúdo
de arquivo não vai pela linha de comando") e **já existe um hook** (`bash-cmdline-guard.js`) que
aplica exatamente essa regra por bloqueio de exit-code — ou seja, aqui a config está correta: a
regra está registrada nos dois lugares porque o hook é o enforcement e o CLAUDE.md é a explicação
para quando o hook falha silenciosamente ou para outro agente que leia o arquivo sem rodar o hook
(ex. numa outra ferramenta). Isso é coerente com o texto do CLAUDE.md global, que já nomeia o
hook e diz "se ele bloquear, troque por Write/Edit em vez de insistir." Nada a corrigir aqui.

**AGENTS.md do projeto (65 linhas) + `@AGENTS.md` como import em `CLAUDE.md` (1 linha).** Bate
exatamente com o padrão documentado: "create a `CLAUDE.md` that imports it... A symlink also
works." O repositório usa o import, não symlink (Windows exige admin para symlink, o que a doc
também nota: "On Windows, creating a symlink requires Administrator privileges..., so use the
`@AGENTS.md` import instead" — exatamente a situação daqui). Tamanho também dentro do teto.

**`docs/agents/especialistas-por-etapa.md` e `docs/agents/issue-tracker.md`.** Aqui está a maior
divergência. Esses dois arquivos são **procedimento de várias etapas** por definição —
"especialistas-por-etapa.md" descreve literalmente um ciclo de 4 fases (observar → pesquisar →
compor → criticar) com critério de fechamento por fase, uma tabela de "portão por mudança", e um
protocolo de nomenclatura de tickets. Isso é exatamente o que a doc chama de skill: "If an entry
is a multi-step procedure or only matters for one part of the codebase, move it to a skill." Hoje
esse arquivo não é uma skill do Claude Code — é um markdown comum, referenciado por link em
`AGENTS.md`, que só entra em contexto se alguém (o agente) decidir abrir o arquivo. Isso é o
oposto do comportamento de skill documentado (description sempre em contexto, corpo carregado sob
demanda quando relevante para a tarefa) — aqui a "descoberta" depende inteiramente do agente
lembrar de seguir o link, sem nenhum gatilho automático. Convertê-lo em skill (`description` =
"Use ao compor, revisar ou dar direção de arte a qualquer tela") faria Claude carregá-lo
automaticamente quando a tarefa for de direção de arte, em vez de depender de leitura manual do
AGENTS.md → link → arquivo.

**Auto-memory (`MEMORY.md` + 19 arquivos de tópico).** Na maior parte, bate bem com a doc: quase
todo arquivo é `type: feedback` — correção que o Marco deu numa sessão, com "Why" e "How to
apply", que é exatamente a definição documentada ("corrections you give Claude and approaches you
confirm"). Porém pelo menos dois arquivos são procedimento, não correção pontual:
`estudar-a-disciplina-antes-de-compor.md` e `prototipo-se-compoe-do-zero-nao-se-veste.md` trazem
"How to apply" com passos numerados (1, 2, 3, 4) que descrevem um método a repetir toda vez que
alguém compõe uma tela nova — isso é "task content" no vocabulário de skills, hoje vivendo como
nota de auto-memory. A doc não proíbe isso explicitamente (ela não fala de "procedimento" na seção
de auto-memory), mas a lógica de "multi-step procedure → skill" da seção de CLAUDE.md se aplica
igual aqui: memória carrega por acidente de "Claude decidiu que era relevante lembrar", skill
carrega pela descrição bater com a tarefa — o segundo é mais confiável para um método que **tem**
que rodar toda vez que a tarefa é de direção de arte.

**`subagentes-de-pesquisa-no-sonnet.md`.** É regra de configuração determinística ("todo Agent de
pesquisa leva `model: sonnet`"), não conhecimento nem preferência de projeto — é o tipo de coisa
que a doc resolveria com um sub-agente dedicado com `model: sonnet` fixo no frontmatter (ex. um
sub-agente "pesquisador" reutilizável), em vez de depender do agente lembrar de passar o parâmetro
toda vez que invoca `Agent`. Hoje é auto-memory; a doc sugeriria fixar isso na definição do
sub-agente.

**Nenhum uso de skill, sub-agente de projeto, ou `.claude/rules/`.** `find` neste repositório não
encontrou `.claude/skills/`, `.claude/agents/`, nem `.claude/rules/` — só `.claude/settings.json`
(permissions allowlist + `enabledPlugins`, uso correto e documentado do arquivo). Todo o "método"
do Viva Maracanã (ciclo de direção de arte, protocolo de tickets, portões por tipo de mudança,
regra de qual agente roda em qual modelo) vive em markdown solto lido por convenção humana/de
prompt, nunca nos mecanismos que o Claude Code carrega ou invoca automaticamente. É a maior
distância entre o que existe e o que a doc oferece: nada aqui é "roda automaticamente porque a
descrição bateu" ou "roda sempre porque é hook" — tudo depende de alguém (humano ou agente) abrir
o arquivo certo na hora certa.

**Plugins instalados (`~/.claude/settings.json`, `enabledPlugins`).** Uso correto e já documentado
— `mattpocock-skills`, `context7`, `pyright-lsp`, etc., instalados de marketplaces reais
(`claude-plugins-official`, `humanizer`, `agricidaniel-claude-seo`, `openai-codex`), todos via
`extraKnownMarketplaces` com fonte GitHub, exatamente o padrão da doc de marketplace. Nenhum
plugin pessoal criado ainda para o método do Viva Maracanã — é a peça que falta se a decisão for
"virar plugin pessoal" em vez de "virar CLAUDE.md/skill global".

**`/skill-doctor` citado em `especialistas-por-etapa.md`?** Não — esse arquivo não cita
`/skill-doctor`; a referência a "skill-doctor" veio da tarefa de pesquisa, não do repositório. O
comando nativo documentado equivalente é `/doctor`, que já cobre "finds unused skills... versus
their context cost" e "trims checked-in CLAUDE.md files."

---

## Fontes

- Memory (CLAUDE.md, auto memory, rules): <https://code.claude.com/docs/en/memory> — fetch 2026-09-18
- Skills (SKILL.md anatomy): <https://code.claude.com/docs/en/skills> — fetch 2026-09-18
- Plugins (criar plugin, estrutura, marketplace de comunidade): <https://code.claude.com/docs/en/plugins> — fetch 2026-09-18
- Plugin marketplaces (marketplace.json, fontes, versionamento): <https://code.claude.com/docs/en/plugin-marketplaces> — fetch 2026-09-18
- Plugin evals (`claude plugin eval`): <https://code.claude.com/docs/en/plugin-evals> — fetch 2026-09-18
- Hooks guide (quando usar hook): <https://code.claude.com/docs/en/hooks-guide> — fetch 2026-09-18
- Hooks reference (eventos, schema JSON): <https://code.claude.com/docs/en/hooks> — fetch 2026-09-18
- Sub-agents (model, frontmatter, memory): <https://code.claude.com/docs/en/sub-agents> — fetch 2026-09-18
- Best practices (CLAUDE.md efetivo, esse é o destino do redirect 308 do post de engenharia): <https://code.claude.com/docs/en/best-practices> — fetch 2026-09-18; URL original <https://www.anthropic.com/engineering/claude-code-best-practices> redireciona (308) para a doc acima, verificado em 2026-09-18
- Features overview (match features to your goal, build your setup over time, context cost): <https://code.claude.com/docs/en/features-overview> — fetch 2026-09-18
- Commands reference (`/doctor`): <https://code.claude.com/docs/en/commands> — fetch 2026-09-18
- Post de engenharia da Anthropic sobre Agent Skills: <https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills> — publicado 2025-10-16, fetch 2026-09-18
- Busca web sobre `/skill-doctor` (não confirmado nas páginas oficiais consultadas): resultados de dev.to, mcpmarket.com, getclaudeskills.com, ccleaks.com, juliangoldie.com — consulta 2026-09-18

Arquivos locais lidos para a comparação final:

- `C:\Users\marco\Dev\viva-maracana\AGENTS.md`
- `C:\Users\marco\Dev\viva-maracana\CLAUDE.md`
- `C:\Users\marco\Dev\viva-maracana\.claude\settings.json`
- `C:\Users\marco\.claude\CLAUDE.md`
- `C:\Users\marco\.claude\settings.json`
- `C:\Users\marco\.claude\hooks\bash-cmdline-guard.js`
- `C:\Users\marco\Dev\viva-maracana\docs\agents\especialistas-por-etapa.md`
- `C:\Users\marco\Dev\viva-maracana\docs\agents\issue-tracker.md`
- `C:\Users\marco\.claude\projects\C--Users-marco-Dev-viva-maracana\memory\MEMORY.md` e os 18 arquivos de tópico na mesma pasta
