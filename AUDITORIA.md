# Auditoria Técnica e Pedagógica — Master Strings
> Data: 2026-04-23 | Auditor: Claude Sonnet 4.6

---

## 1. Inventário Completo de Arquivos

### Ponto de Entrada

| Arquivo | O que faz |
|---------|-----------|
| `src/main.ts` | Cria a app Vue, registra Pinia e o Router, monta em `#app`. Limpo e correto. |
| `src/App.vue` | Raiz da SPA — só envolve `<RouterView>` num `div` dark. Correto. |
| `src/style.css` | Importa Tailwind CSS e duplica estilos do `body` (redundância menor). |

### Router

| Arquivo | O que faz |
|---------|-----------|
| `src/router/index.ts` | 5 rotas lazy-loaded. Usa `createWebHistory()` — requer configuração server-side para funcionar em deploy estático (SPA fallback). **Sem guards de autenticação/progressão**. |

### Store (Pinia)

| Arquivo | O que faz |
|---------|-----------|
| `src/store/progress.ts` | Armazena `userName` e `lessonsProgress` em `localStorage`. Expõe `setUserName`, `markLessonComplete`, `isLessonComplete`. Sem watcher reativo — persiste apenas em chamadas explícitas. |

### Views (Páginas)

| Arquivo | Rota | O que faz | Estado |
|---------|------|-----------|--------|
| `src/views/Home.vue` | `/` | Formulário de entrada com nome do usuário. Botão muda de "Começar Agora" para "Continuar Jornada" se já há nome salvo. | ✅ Funcional |
| `src/views/Dashboard.vue` | `/dashboard` | Lista os 3 módulos com estado de conclusão. Tem guard básico (redireciona para `/` se sem nome), mas não reativo. | ⚠️ Pequenos problemas |
| `src/views/lessons/Intro.vue` | `/lesson/intro` | Módulo 1: explica as 12 notas cromáticas e a escala natural. Fretboard completo interativo + destaque da escala de Dó na 5ª corda. | ⚠️ Bug de Markdown |
| `src/views/lessons/Chords.vue` | `/lesson/chords` | Módulo 2: biblioteca de 36 acordes com shapes CAGED, arpejo animado e seletor de velocidade. | ⚠️ Bug de click |
| `src/views/lessons/Scales.vue` | `/lesson/scales` | Módulo 3: 8 escalas com shapes dinâmicos por tom, playback sequencial animado. | ⚠️ Bug de click |

### Componentes

| Arquivo | O que faz | Estado |
|---------|-----------|--------|
| `src/components/Fretboard.vue` | O coração visual do projeto. Renderiza o braço da guitarra com cordas, trastes, marcadores, notas ativas e animação de nota tocando. Props: `strings`, `frets`, `activeNotes`, `playingNote`, `showAllNotes`, `interactiveNotes`. | ⚠️ Bug de corda solta |
| `src/components/HelloWorld.vue` | **Arquivo morto** — scaffold padrão do Vite, nunca importado em lugar algum. | ❌ Deletar |

### Dados

| Arquivo | O que faz |
|---------|-----------|
| `src/data/chords.ts` | Define 36 acordes gerados algoritmicamente com a função `cagedShapes()`. Cobre 12 raízes cromáticas × tipos (maior, menor, dom7, maj7, min7). Usa OPEN = `[4, 9, 2, 7, 11, 4]` para calcular notas por corda/traste. |
| `src/data/scales.ts` | 8 templates de escalas. `buildScalesForRoot(root)` recalcula todos os shapes para qualquer das 12 notas raiz. Exporta `ROOT_NOTES` e `scaleTemplateKeys`. |

### Utilitários

| Arquivo | O que faz |
|---------|-----------|
| `src/utils/audio.ts` | `AudioManager` singleton. `PolySynth(FMSynth)` simulando violão acústico. Efeitos: Reverb (1.5s) + Compressor. `getFretNote(stringIdx, fret)` converte posição do braço em nota Tone.js. |

### Assets / Configuração

| Arquivo | Status |
|---------|--------|
| `src/assets/vue.svg` | ❌ Não usado — deletar |
| `vite.config.ts` | Mínimo: plugins `vue()` + `tailwindcss()`. Sem alias de paths, sem base URL configurada para deploy. |
| `tsconfig.*.json` | Configuração TypeScript padrão do Vite. Sem path aliases. |
| `package.json` | Versão `0.0.0`. Scripts: `dev`, `build`, `preview`. Sem `test`. |
| `README.md` | ❌ Conteúdo genérico do scaffold Vite — não descreve o projeto. |
| `yarn-error.log` | ❌ Arquivo de erro de instalação — não deveria estar no repositório. |
| `dist/` | Build de produção gerado. Presente no repositório — **não deveria** (deveria estar no `.gitignore`). |

---

## 2. Análise de UX/UI

### 2.1 Fluxo de Navegação

```
/ (Home) → /dashboard → /lesson/intro
                      → /lesson/chords
                      → /lesson/scales
```

**Pontos positivos:**
- Fluxo linear e intuitivo para um iniciante.
- A Home pede o nome antes de entrar, criando senso de personalização.
- O botão "Voltar para o Painel" em todas as lições é consistente.

**Problemas identificados:**
- **Sem progressão bloqueada**: O usuário pode acessar Escalas sem ter feito a Introdução. Pedagogicamente isso é problemático — Escalas pressupõe conhecimento do Módulo 1.
- **Guard não reativo no Dashboard**: `const user = store.userName` captura uma string estática, não um `ref`. Se o store mudar após o setup, a variável não atualiza. O redirecionamento usa `router.push('/')` sem `await` dentro de `<script setup>`, causando flash da página antes do redirect.
- **Sem "continuar de onde parou"**: O Dashboard mostra quais módulos foram concluídos, mas não direciona o usuário para o próximo módulo não concluído.
- **Sem reset de progresso**: Não há como o usuário limpar seu histórico ou trocar de nome sem limpar o localStorage manualmente.
- **Sem breadcrumb**: Dentro de uma lição, não fica claro em que módulo o usuário está dentro da trilha geral.

### 2.2 Consistência Visual

**Pontos positivos:**
- Design dark mode coeso em todo o site (zinc-950, zinc-900, gradientes purple/blue).
- Glassmorphism na Home (backdrop-blur + bordas semitransparentes) está bem executado.
- Hierarquia tipográfica consistente: títulos `font-black`, subtítulos `font-bold`, body em zinc-300/400.
- Sistema de cores das notas é consistente entre Chords e Scales (indigo = raiz, sky = terça, etc.).

**Inconsistências:**
- O botão "Concluir Módulo" tem estilos diferentes em cada lição: verde em Intro, âmbar em Chords, cinza em Scales. Deveria ser sempre o mesmo estilo para ação primária.
- O título "Módulo Escalas & Solos" usa `&amp;` literalmente no HTML (deveria usar `&amp;amp;` ou simplesmente "e" ou "—"). Na prática isso aparece como `&` correto no navegador, mas é inconsistente com os outros títulos.
- A legenda das escalas diz "Notas com borda = Notas especiais" mas usa um emoji de alvo (🎯) que não condiz visualmente com o marcador real no braço.
- O Dashboard usa um grid `md:grid-cols-2` para 3 módulos, deixando o terceiro card solitário na segunda linha no breakpoint médio. Visualmente desequilibrado.

### 2.3 Feedback ao Usuário

**O que existe:**
- Animação da nota tocando (círculo aumenta + borda amarela brilhante) — muito boa.
- Badge "Concluído" com CheckCircle no Dashboard.
- Botão muda de "Iniciar Módulo" para "Revisar Módulo" após conclusão.
- Texto `animate-pulse` no Módulo 1 chamando atenção para a interatividade.

**O que falta:**
- **Nenhum estado de loading**: O Tone.js pode demorar para inicializar. Na primeira vez que o usuário clica, pode haver um atraso silencioso. Sem spinner ou mensagem "Carregando áudio...".
- **Nenhum feedback de erro**: Se o áudio falhar (ex.: política autoplay bloqueada pelo browser), nada informa o usuário.
- **Nenhuma confirmação de ação**: Clicar "Concluir Módulo" redireciona imediatamente sem confirmação — fácil de acionar por acidente.
- **Sem contador de progresso geral**: Ex.: "1 de 3 módulos concluídos".

### 2.4 Acessibilidade

**Problemas sérios:**
- **Sem `aria-label` nos botões de notas/acordes/escalas**: O Fretboard não tem atributos ARIA. Um leitor de tela não consegue descrever o conteúdo.
- **Contraste de cor**: Texto `text-zinc-500` sobre fundo `zinc-900` tem contraste insuficiente (< 3:1 em vários pontos).
- **Sem foco visível padronizado**: Os botões têm `focus:ring` apenas no input de nome. Os botões de acordes/escalas não têm estado de foco acessível.
- **Sem `alt` ou descrição textual** do braço da guitarra.

### 2.5 Responsividade Mobile

**O que funciona:**
- Padding responsivo com `p-4 sm:p-12`.
- O sidebar de acordes e conteúdo principal empilham verticalmente em mobile (`lg:grid-cols-4`).
- O nome do usuário some em telas pequenas (`hidden sm:block`).

**Problemas:**
- **O Fretboard tem scroll horizontal** (`overflow-x-auto`) com `minWidth: max(800, numFrets*60)px`. Em um celular de 390px, o braço fica com 1320px de largura (22 trastes × 60px), exigindo muito scroll. Isso torna os módulos quase inutilizáveis em mobile sem interação por zoom/scroll.
- **Botão de velocidade some o label em mobile** (`hidden sm:inline`) mas o `<select>` fica sem contexto visual.
- **A largura fixa `w-[85%]`** nas lições cria margens simétricas mas em telas muito pequenas (<375px) pode cortar conteúdo.

### 2.6 Legibilidade

- Tamanho de fonte adequado para desktop (body `text-lg` nas lições).
- Fonte monospace nos chips de notas (Intro) diferencia bem código/teoria de texto corrido.
- **Problema**: Os marcadores de notas no Fretboard têm `text-[10px]` — ilegíveis em telas de baixa resolução ou para usuários com visão reduzida.

---

## 3. Funcionalidades Implementadas — Como Funcionam

### 3.1 Sistema de Autenticação por Nome

**Como funciona:** O usuário digita seu nome na Home. Ao submeter, `store.setUserName()` salva em localStorage. O Dashboard lê `store.userName` para exibir o avatar e saudar. Persiste entre sessões.

**Funciona:** ✅ Sim, com ressalvas (guard não reativo, sem validação de tamanho/caracteres).

### 3.2 Fretboard Interativo

**Como funciona:** O componente renderiza 6 cordas × N trastes em loops `v-for` aninhados. Para cada célula `(string, fret)`:
- Se `showAllNotes=true`: mostra a nota calculada por `getNoteLabel(s, f)` = `(openNote[s-1] + f) % 12`.
- Se `activeNotes` contém `{string: s, fret: f}`: renderiza o marcador colorido com label customizado.
- Se `interactiveNotes=true`: hover highlight + click dispara `audio.playNote(getFretNote(s, f))`.
- Se `playingNote = {string: s, fret: f}`: o marcador cresce 50% + borda amarela brilhante.

**Funciona:** ✅ Núcleo funciona corretamente. Ver seção 4 para os bugs.

### 3.3 Sistema de Áudio (Tone.js)

**Como funciona:** `AudioManager` usa um `PolySynth<FMSynth>` com envelope de ataque rápido e decaimento lento (simula uma nota de guitarra). A cadeia de efeitos é: Synth → Compressor(-20dB, ratio 4) → Reverb(1.5s) → Destination. O método `getFretNote(string, fret)` usa `Tone.Frequency(openNote).transpose(fret).toNote()` para calcular a nota exata. O áudio só inicia após a primeira interação do usuário (`Tone.start()`) respeitando a política de autoplay dos browsers.

**Funciona:** ✅ Funciona bem. A síntese FMSynth com os parâmetros usados produz um som plausível de guitarra de nylon/violão. O timing de inicialização é sólido.

### 3.4 Geração de Acordes (CAGED)

**Como funciona:** A função `cagedShapes(root, intervals, ...)` calcula 5 shapes baseados na posição da raiz na 6ª e 5ª corda. Para cada shape, define um range de trastes e chama `gen()` que itera todas as cordas dentro do range, verificando se a nota cromática da posição pertence ao acorde. Retorna apenas shapes com ≥ 3 notas.

**Funciona:** ✅ Matematicamente correto. A visualização é precisa harmonicamente. Limitação: os shapes são posições teóricas, não dedilhados práticos.

### 3.5 Geração de Escalas por Tom

**Como funciona:** `buildScalesForRoot(root)` calcula `rootFret6 = (root - 4 + 120) % 12` (fret da raiz na 6ª corda) e aplica offsets pré-definidos para cada shape de cada escala. `gen()` é análogo ao de acordes — varre frets e seleciona as que pertencem à escala.

**Funciona:** ✅ Correto e elegante. A recalculação reativa ao mudar o tom é imediata.

### 3.6 Playback Animado (Arpejo/Escala)

**Como funciona:** Itera as notas em ordem (graves→agudas), para cada nota agenda um `setTimeout(t * speedMs)` que:
1. Seta `playingNote.value` para a posição atual.
2. Toca a nota via `audio.playNote()`.
3. Após `speedMs - 20ms`, limpa `playingNote` (se ainda for a mesma nota).

**Funciona:** ✅ Animação correta para a maioria dos casos. Ver seção 4 para bug de nota solta e bug de múltiplos cliques.

### 3.7 Rastreamento de Progresso

**Como funciona:** `store.markLessonComplete('intro')` seta `lessonsProgress['intro'] = true` e serializa em localStorage. `store.isLessonComplete(id)` retorna o booleano. O Dashboard usa isso para mostrar o badge e mudar o texto do botão.

**Funciona:** ✅ Sem problemas funcionais. Limitação: progresso só existe localmente.

---

## 4. Funcionalidades Quebradas ou Incompletas

### Bug 1 — Texto Markdown Renderizado Literalmente (Intro.vue:89-90)
**Severidade: Média**

O template usa sintaxe Markdown (`**texto**`) dentro de tags HTML `<p>`:

```html
Vamos visualizar apenas as notas **naturais** (sem o sustenido)
```

Vue não processa Markdown — os asteriscos aparecem literalmente no browser. O trecho também usa `<br/>` dentro de uma string de template que funciona, mas os `**...**` não.

**Correção:** Substituir `**texto**` por `<strong>texto</strong>`.

---

### Bug 2 — Corda Solta (Fret 0) Não Funciona no Playback Animado (Fretboard.vue:103-110)
**Severidade: Alta**

O marcador visual de fret=0 (corda solta) é renderizado dentro da célula do fret=1, posicionado em `-left-10`. Isso causa dois problemas:

1. **O click nesta posição dispara `handleFretClick(s, 1)`** (fret 1), não fret 0 — toca a nota errada.
2. **A animação `playingNote` nunca ilumina a nota solta** porque o loop `v-for f in numFrets` começa em f=1, nunca produz f=0. Quando `playingNote = {fret: 0}`, nenhuma célula corresponde e o marcador permanece apagado.

**Impacto:** Acordes e escalas com cordas soltas (ex.: E aberto, Am aberto) não animam nem tocam a nota solta corretamente.

---

### Bug 3 — Clique Individual nas Notas Desativado em Chords e Scales (sem aviso)
**Severidade: Média**

Os componentes `Chords.vue` e `Scales.vue` renderizam o Fretboard **sem** passar `:interactiveNotes="true"`:

```html
<!-- Chords.vue:144 -->
<Fretboard v-if="activeShape" :activeNotes="activeShape.notes" :frets="maxFret" :playingNote="playingNote" />
```

Isso desativa o click-to-play individual. Porém, a legenda em `Chords.vue:149` diz:
> "Clique em qualquer casa para ouvir a nota individualmente!"

Essa instrução está incorreta — o clique não funciona. Scales.vue tem o mesmo problema (legenda similar implícita na interface).

**Correção:** Adicionar `:interactiveNotes="true"` nos dois Fretboards, ou remover a legenda.

---

### Bug 4 — Múltiplos Cliques em "Ouvir e Ver" Empilham Playbacks
**Severidade: Baixa-Média**

Clicar no botão "Ouvir e Ver" enquanto um arpejo/escala está tocando inicia um novo `setTimeout` chain sem cancelar o anterior. O resultado é múltiplos arpejos sobrepostos tocando simultaneamente, com animações conflitando.

**Correção:** Usar uma flag `isPlaying` ou limpar os timeouts pendentes antes de iniciar novo playback.

---

### Bug 5 — Guard do Dashboard Produz Flash Visual
**Severidade: Baixa**

```typescript
// Dashboard.vue:11-13
const user = store.userName
if (!user) {
  router.push('/')
}
```

`router.push` é assíncrono mas não está sendo `await`-ado. O componente renderiza brevemente antes do redirect. Em conexões lentas ou durante SSR/pré-renderização, isso pode causar conteúdo visível por um frame.

**Correção:** Usar `beforeEach` navigation guard no router ou `await router.push('/')`.

---

### Bug 6 — `const user = store.userName` Não é Reativo
**Severidade: Baixa**

```typescript
// Dashboard.vue:9
const user = store.userName // string estática, não ref
```

Se `store.userName` mudar depois (ex.: via outro componente), `user` no template não atualiza. Em situações normais de uso isso não aparece, mas é um antipadrão.

**Correção:** Usar `computed(() => store.userName)` ou acessar diretamente `store.userName` no template.

---

### Incompleto 1 — Shapes CAGED Podem Ser Impossíveis de Tocar

A geração algorítmica de shapes preenche TODAS as notas do acorde dentro de um range de trastes, em todas as cordas. Isso pode produzir configurações com 5-6 notas em posições que nenhum ser humano consegue tocar simultaneamente (ex.: casa 5 na 6ª corda + casa 5 na 5ª corda + casa 7 na 2ª corda + casa 7 na 1ª corda = requer 4 dedos em configuração impossível).

**Impacto pedagógico:** Um iniciante que veja o shape e tente reproduzi-lo pode ficar frustrado por não conseguir. Sem indicação de quais notas priorizar ou dedilhado sugerido.

---

### Incompleto 2 — Módulo de Introdução Não Ensina Nada de Técnica

O Módulo 1 cobre teoria de notas cromáticas muito bem, mas não aborda:
- Como se segurar na guitarra.
- Nomes das cordas (E-A-D-G-B-e ou Mi-Lá-Ré-Sol-Si-Mi).
- O que é um semitom/tom (fisicamente nas casas).
- Como ler tablatura ou cifra.

Para um site que se propõe a ser o "início da jornada", a ausência de conteúdo sobre o instrumento físico em si é uma lacuna.

---

### Incompleto 3 — Nenhum Exercício ou Interatividade Didática

Todas as lições são de **consumo passivo** — o usuário lê e ouve. Não há:
- Quiz de identificação de notas ("Qual nota está na casa 5 da 3ª corda?").
- Exercício de montar um acorde.
- Teste de identificação de escala.

O botão "Concluir Módulo" pode ser clicado imediatamente sem o usuário ter interagido com nada.

---

## 5. Análise do Conteúdo Educacional

### 5.1 Módulo 1 — Introdução às Notas

**Correção musical:** ✅ Impecável.
- As 12 notas cromáticas estão corretas.
- A observação sobre E-F e B-C não terem sustenido é didaticamente importante e está correta.
- A escala de Dó na 5ª corda: frets 3(C), 5(D), 7(E), 8(F), 10(G), 12(A), 14(B), 15(C) — todos verificados e corretos.

**Profundidade:** ⚠️ Superficial para uma lição introdutória completa.

**Faltam:**
- Nomes das cordas em aberto (E-A-D-G-B-e) e como memorizá-los.
- Explicação de oitavas (por que a casa 12 é a mesma nota uma oitava acima).
- O conceito de tom vs. semitom aplicado às casas.
- Como a distribuição de notas no braço segue um padrão repetível.

### 5.2 Módulo 2 — Acordes

**Correção musical:** ✅ Impecável.
- Todas as definições de intervalos estão corretas: MAJ=[0,4,7], MIN=[0,3,7], MAJ7=[0,4,7,11], MIN7=[0,3,7,10], DOM7=[0,4,7,10].
- Todas as 36 combinações (12 raízes × tipos) estão harmonicamente corretas.
- A descrição "resolve para Fá Maior" no C7 é um detalhe de teoria funcional correto e relevante.

**Profundidade:** ⚠️ Boa cobertura de variedade, mas falta progressão pedagógica.

**Problemas:**
- **Nenhum acorde "aberto" (open chord)**: C, Am, Em, G abertos são os primeiros acordes que qualquer guitarrista aprende. A biblioteca começa pelos shapes CAGED que pressupõem conhecimento intermediário.
- **Faltam acordes fundamentais:**
  - Power chords / quintas (5) — base do rock
  - sus2, sus4 — onipresentes em pop
  - dim, dim7, m7b5 — essenciais em jazz/harmonia
  - Acordes aumentados (aug/+5)
- **Nenhuma explicação de como usar o acorde**: por que usar Cmaj7 ao invés de C? Em que contexto usar o dominante? Como encadear acordes numa progressão?
- **CAGED sem explicação visual de dedilhado**: saber que o acorde "tem esse formato" no braço não ajuda o iniciante a colocar os dedos.

### 5.3 Módulo 3 — Escalas

**Correção musical:** ✅ Impecável.
- Todos os 8 intervalos estão corretos e verificados.
- A denominação "Menor Natural (Eólia)" está tecnicamente correta — é o 6º modo da escala maior.
- A descrição da Menor Melódica como "jazz version, ascending" está implicitamente correta.
- DIMINISHED=[0,2,3,5,6,8,9,11] — padrão Tom-Semitom correto.
- WHOLE_TONE=[0,2,4,6,8,10] — hexafônica de tons inteiros, correto.

**Profundidade:** ⚠️ Boa seleção de escalas avançadas, mas falta a mais importante para iniciantes.

**Problema crítico — Pentatônica MAIOR ausente:**
A Pentatônica Maior ([0,2,4,7,9]) está completamente ausente. É a escala fundamental para solos em pop, country e blues melódico — em muitos contextos é ensinada antes da pentatônica menor. Um guitarrista iniciante notará essa ausência rapidamente.

**Faltam também:**
- **Modos da escala maior**: Dórico (rock/jazz), Mixolídio (blues/rock), Frígio (metal/flamenco), Lídio (rock progressivo) são os modos mais usados na guitarra. Qualquer guitarrista que explore solos vai querer esses modos.
- **Como usar a escala sobre acordes**: nenhuma explicação de "use pentatônica menor sobre progressão de blues em A" ou "use Dórico sobre Am7".
- **Relação entre escala e tom da música**: nenhuma explicação de tonalidade.

### 5.4 Avaliação Geral do Conteúdo

| Aspecto | Nota | Comentário |
|---------|------|------------|
| Correção musical | 10/10 | Nenhum erro encontrado |
| Cobertura — Notas | 7/10 | Falta técnica e mnemônico de cordas |
| Cobertura — Acordes | 6/10 | Falta abertos, power chords, sus, dim |
| Cobertura — Escalas | 7/10 | Falta pentatônica maior e modos |
| Progressão pedagógica | 5/10 | Sem bloqueio, sem exercícios, sem conexão entre módulos |
| Aplicabilidade prática | 4/10 | Teoria bem apresentada, sem tradução para prática |

---

## 6. Avaliação da Proposta e Onboarding

### 6.1 Proposta de Valor

A proposta é clara: **"entender o braço da guitarra"** através de visualização interativa. Isso é diferenciador — a maioria dos sites de guitarra usa imagens estáticas de diagramas. O Fretboard interativo com áudio é genuinamente superior.

**Problema:** A proposta não está declarada em nenhum lugar visível antes da entrada. A Home pede o nome sem explicar o que o site oferece. Um usuário novo não sabe se vai aprender teoria, técnica, músicas específicas, ou leitura de partitura.

**Recomendação:** Adicionar na Home uma seção de proposta com 3 bullet points: "O que você vai aprender aqui".

### 6.2 Onboarding

O onboarding atual:
1. Digita o nome → entra no Dashboard.
2. Vê 3 módulos → clica para iniciar.
3. Lê o conteúdo → clica "Concluir".

**Problemas:**
- **Barreira zero**: qualquer clique no botão conclui o módulo, mesmo sem ler/interagir. O progresso não reflete aprendizado real.
- **Sem orientação sequencial**: os módulos não são numerados visivelmente e não há um "próximo módulo sugerido" após concluir um.
- **Sem contexto de duração**: o usuário não sabe quanto tempo cada módulo leva.
- **O nome serve apenas para exibição**: pede-se o nome como se fosse criar uma conta, mas não há consequências além de um "Olá, João".

### 6.3 Progressão Pedagógica

A sequência Notas → Acordes → Escalas é **pedagogicamente correta** em alto nível. O problema é a execução:

- **Notas** deveriam incluir mnemônicos de cordas e como se orientar no braço antes de mostrar o fretboard completo.
- **Acordes** deveriam começar pelos shapes abertos (os mais fáceis) antes de partir para CAGED.
- **Escalas** deveriam começar com pentatônica maior e menor (as mais simples) antes de saltar para Menor Harmônica e Diminuta.

A progressão atual vai de básico (12 notas) para muito avançado (Diminuta, Tons Inteiros) sem degraus intermediários.

---

## 7. Sugestões de Melhoria — Priorizadas

### 🔴 Prioridade Alta (Bugs / Problemas que quebram a experiência)

**P1 — Corrigir texto Markdown literal (Intro.vue)**
Substituir `**texto**` por `<strong>texto</strong>` no template. 5 minutos de trabalho.

**P2 — Adicionar `:interactiveNotes="true"` no Fretboard de Chords e Scales**
Ou remover a legenda que diz que é possível clicar. A instrução incorreta confunde o usuário.

**P3 — Corrigir bug de corda solta (fret 0) no Fretboard**
Mover o marcador de fret=0 para fora do loop do fret=1, ou usar um elemento posicionado absolutamente fora do container de trastes. Garantir que `handleFretClick(s, 0)` seja chamado e que `playingNote.fret === 0` seja testado corretamente.

**P4 — Impedir múltiplos playbacks simultâneos**
Adicionar uma ref `isPlaying` e um array de timeout IDs. Ao clicar "Ouvir e Ver", cancelar os timeouts pendentes antes de iniciar o novo.

---

### 🟡 Prioridade Média (Experiência educacional e UX importantes)

**P5 — Adicionar Pentatônica Maior às escalas**
Intervalo: `[0, 2, 4, 7, 9]`. Usar offsets similares à pentatônica menor. É a segunda escala mais importante para guitarristas e está completamente ausente.

**P6 — Adicionar os 4 modos principais**
Dórico, Mixolídio, Frígio e Lídio. Cada um com sua característica sonora explicada em uma linha. São a evolução natural após as pentatônicas.

**P7 — Adicionar acordes abertos ao Módulo de Acordes**
Criar uma seção separada no início da lição com os 5 acordes abertos mais comuns (C, G, D, Am, Em) com tablatura ou diagrama simples. Isso cria uma "vitória rápida" para o iniciante antes de entrar no sistema CAGED.

**P8 — Adicionar Power Chords**
`[0, 7]` — Raiz + Quinta. A base do rock. Fácil de implementar com o sistema existente.

**P9 — Corrigir responsividade mobile do Fretboard**
Opções: reduzir o tamanho mínimo de cada casa (de 60px para 40px em mobile), ou criar uma visualização alternativa em mobile (ex.: diagrama de 4 casas ao invés de todo o braço).

**P10 — Módulo de Introdução: adicionar nomes das cordas**
Incluir na seção introdutória os nomes E-A-D-G-B-e com um mnemônico popular ("Elefantes Abrem Dedos Gigantes Brasileiros Especiais" ou similar).

---

### 🟢 Prioridade Baixa (Melhorias de qualidade e polish)

**P11 — Padronizar botão "Concluir Módulo"**
Usar o mesmo estilo (verde com CheckCircle) nos três módulos para consistência visual.

**P12 — Corrigir guard do Dashboard para ser reativo**
```typescript
// Substituir:
const user = store.userName
// Por:
const user = computed(() => store.userName)
// E mover o guard para o router (beforeEach)
```

**P13 — Adicionar explicação de contexto musical para cada escala/acorde**
Uma linha como "Usada em: Blues, Rock clássico, Jimi Hendrix" ao lado do nome. Ajuda o aluno a relacionar teoria com músicas que conhece.

**P14 — Adicionar feedback de loading do áudio**
Na primeira interação, mostrar um toast "🎵 Iniciando áudio..." enquanto `Tone.start()` carrega.

**P15 — Adicionar `<title>` por página**
Atualmente todas as páginas têm o mesmo título genérico do Vite. Usar `useHead` ou `document.title` para dar títulos únicos como "Módulo 1 — Master Strings".

**P16 — Remover arquivos mortos**
- `src/components/HelloWorld.vue`
- `src/assets/vue.svg`
- `yarn-error.log`
- Adicionar `dist/` ao `.gitignore`

**P17 — Atualizar README.md**
Descrever o projeto, como executar localmente (`npm run dev`), e a estrutura de pastas.

**P18 — Adicionar descrição de notas de rodapé explicando dedilhado**
Uma nota como "Estes shapes mostram as posições teóricas das notas. Para dedilhados práticos, explore cada posição e identifique as notas mais confortáveis para sua mão."

---

## Resumo Executivo

**Master Strings é um projeto sólido com uma base técnica muito boa** — a geração algorítmica de acordes e escalas é elegante, o Fretboard interativo com áudio é diferenciador, e o design visual é moderno e coerente. O código TypeScript está bem estruturado e sem débito técnico grave.

**As fraquezas estão principalmente na camada educacional e em bugs pontuais**: o conteúdo é musicalmente correto mas sem progressão pedagógica clara, faltam os acordes e escalas mais básicos para iniciantes (open chords, pentatônica maior), e três bugs afetam diretamente a experiência principal (texto quebrado, clique desativado sem aviso, notas soltas não animam).

**Correções urgentes** (P1-P4) são rápidas e alto impacto. **Adições de conteúdo** (P5-P10) são o maior gap para o produto cumprir sua proposta de trilha completa para guitarristas iniciantes a intermediários.

| Dimensão | Nota |
|----------|------|
| Qualidade do código | 8/10 |
| Design visual | 8/10 |
| Correção musical do conteúdo | 10/10 |
| Completude do conteúdo | 5/10 |
| Experiência do usuário | 6/10 |
| Acessibilidade | 3/10 |
| Responsividade mobile | 5/10 |
| **Média geral** | **6.4/10** |
