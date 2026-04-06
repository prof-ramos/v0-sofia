# Auditoria Estática de UI/UX e Acessibilidade — SOFIA

> **Data**: 2026-04-06
> **Escopo**: Análise estática de código (sem execução, sem simulação visual)
> **Arquivos analisados**: 13 componentes TSX, 1 CSS global, 1 layout

---

## PROMPT 1 — Descoberta e Mapeamento

### 1.1 Arquivos e Estrutura Visível

| Tipo                | Caminho                                       | Notas                                          |
|---------------------|-----------------------------------------------|------------------------------------------------|
| Configuração tema   | `app/globals.css`                             | Tokens de cor, animações, bubble styles        |
| Layout raiz         | `app/layout.tsx`                              | Metadata, fontes, `<html lang="pt-BR">`        |
| Página principal    | `app/page.tsx`                                | Renderiza `<ChatContainer />`                  |
| Página 404          | `app/not-found.tsx`                           | Tela de erro com link para home                |
| Erro (boundary)     | `app/error.tsx`                               | Error boundary com botão reset                 |
| Componente header   | `components/sofia/header.tsx`                 | Logo ASOF + título + badge                     |
| Container chat      | `components/sofia/chat-container.tsx`         | Orquestra chat, sessão, feedback               |
| Input chat          | `components/sofia/chat-input.tsx`             | Textarea + botão enviar                        |
| Mensagem chat       | `components/sofia/chat-message.tsx`           | Bubble user/assistant + feedback buttons       |
| Lista mensagens     | `components/sofia/message-list.tsx`           | Scroll + typing indicator                      |
| Tela boas-vindas    | `components/sofia/welcome-screen.tsx`         | Logo + sugestões de perguntas                  |
| Botão (shadcn)      | `components/ui/button.tsx`                    | Base com variantes CVA (não usado no chat)     |
| Ícone enviar        | `components/icons/SendIcon.tsx`               | SVG inline com aria-label                      |
| Provider tema       | `components/theme-provider.tsx`               | Wrapper next-themes                            |

### 1.2 Stack de UI e Estilização

O projeto utiliza **Next.js 16.2** com **React 19** e **Tailwind CSS 4.2** como sistema de estilização principal. Não há Tailwind config separado — a configuração é feita diretamente em `globals.css` via `@theme inline` (padrão Tailwind v4). A biblioteca de componentes **shadcn/ui** está instalada (`components/ui/button.tsx` com CVA + Radix Slot), porém apenas o componente `Button` foi adicionado e **não é utilizado** nos componentes de chat — os botões do chat são implementados com `<button>` nativo e classes Tailwind diretas.

Os **design tokens** vivem em `app/globals.css` sob `:root` (CSS custom properties) e são expostos ao Tailwind via `@theme inline`. O sistema de cores segue a identidade visual ASOF: paleta navy (`--navy-dark: #0C1A2E`, `--navy: #0F2240`, `--navy-mid: #1B3358`), paleta gold (`--gold: #C8A84E`, `--gold-light: #E2C47A`, `--gold-pale: #F5EDD0`) e neutros (`--cream: #F7F5F0`, `--ink: #111827`, `--text-muted: #6B7280`). Tokens semânticos mapeiam para estas cores: `--primary → --navy`, `--accent → --gold`, `--background → --cream`, etc.

A **tipografia** é definida em `@theme inline` com três famílias: sans-serif (`Trebuchet MS`), serif (`Georgia`) e mono (`Geist Mono` via `next/font/google`). Não há escala tipográfica formal — os tamanhos são definidos ad-hoc via classes arbitrárias (`text-[14px]`, `text-[10px]`, `text-[11px]`, `text-[26px]`, etc.) em cada componente.

O **espaçamento** segue majoritariamente a grade de 4px do Tailwind (`gap-2`, `px-4`, `py-3`, etc.), com algumas exceções usando valores arbitrários fora da grade (`py-[7px]`, `gap-3.5`).

As **animações** são definidas em `globals.css` (`fade-up`, `message-enter`, `typing-pulse`) e respeitam `prefers-reduced-motion: reduce`. Componentes individuais usam `transition-*` do Tailwind para micro-interações (hover, active).

### 1.3 Componentes de UI Mapeados

#### Botões

| Tipo       | Elemento              | Arquivo                                 | Observação                                |
|------------|-----------------------|-----------------------------------------|-------------------------------------------|
| Enviar     | `<button type="submit">` | `components/sofia/chat-input.tsx:55` | Circular, `w-11 h-11` (44px)             |
| Feedback+  | `<button type="button">` | `components/sofia/chat-message.tsx:91` | Pill, `px-3 py-1 text-[10px]`            |
| Feedback-  | `<button type="button">` | `components/sofia/chat-message.tsx:103` | Pill, `px-3 py-1 text-[10px]`            |
| Sugestão   | `<button>`            | `components/sofia/welcome-screen.tsx:43` | Pill, `px-3.5 py-[7px] text-[11px]`     |
| Reset erro | `<button>`            | `app/error.tsx:34`                      | `h-11 min-h-[44px]`                       |
| Voltar 404 | `<Link>`              | `app/not-found.tsx:23`                  | `h-11 min-w-[44px] min-h-[44px]`         |
| Base shadcn| `<Button>` (CVA)      | `components/ui/button.tsx`              | Não utilizado nos componentes de chat     |

#### Inputs e Formulários

| Tipo     | Elemento     | Arquivo                              | Observação                       |
|----------|-------------|--------------------------------------|-----------------------------------|
| Textarea | `<textarea>` | `components/sofia/chat-input.tsx:42` | `aria-label`, placeholder, auto-resize |

#### Layout e Containers

| Tipo      | Elemento   | Arquivo                                 | Observação               |
|-----------|-----------|-----------------------------------------|--------------------------|
| Header    | `<header>` | `components/sofia/header.tsx:7`         | Logo + título + badge    |
| Container | `<div>`   | `components/sofia/chat-container.tsx:71` | `flex flex-col h-screen` |
| Lista msg | `<div>`   | `components/sofia/message-list.tsx:21`  | Scrollável, `chat-scroll`|
| Footer    | `<footer>` | `components/sofia/chat-container.tsx:86` | Créditos ASOF           |
| Main 404  | `<main>`   | `app/not-found.tsx:11`                  | ✅ Landmark correto      |

#### Feedback e Status

| Tipo              | Elemento        | Arquivo                                | Observação                          |
|-------------------|----------------|----------------------------------------|-------------------------------------|
| Typing indicator  | `<div role="status">` | `components/sofia/message-list.tsx:32` | `aria-live="polite"`, `sr-only` text |
| Error boundary    | `<div role="alert">` | `app/error.tsx:17`                     | ✅ Semântica correta                 |

---

## PROMPT 2 — Validação Estática de Regras

| Categoria        | Arquivo e local                         | Descrição da violação / risco                                                                 | Regra relacionada                     | Sugestão concreta de correção                                                                                       |
|------------------|----------------------------------------|-----------------------------------------------------------------------------------------------|---------------------------------------|---------------------------------------------------------------------------------------------------------------------|
| Touch targets    | `chat-message.tsx:97-99`               | Botões de feedback com `py-1` (4px) e `text-[10px]` — altura estimada ~23px, muito abaixo do mínimo 44px. | Alvo de toque mínimo (44×44px)       | Aumentar para `py-2.5` mínimo e `text-xs` (12px), ou adicionar `min-h-[44px]` com `items-center justify-center`. |
| Touch targets    | `welcome-screen.tsx:48`                | Botões de sugestão com `py-[7px]` (7px) e `text-[11px]` — altura estimada ~30px, abaixo do mínimo 44px. | Alvo de toque mínimo (44×44px)       | Aumentar para `py-3` (12px) e `text-xs` (12px), garantindo altura ≥ 44px.                                         |
| Espaçamento       | `welcome-screen.tsx:48`                | `py-[7px]` é valor arbitrário fora da grade 4px (deveria ser `py-2` = 8px).                    | Grid de espaçamento (múltiplos de 4) | Trocar `py-[7px]` por `py-2`.                                                                                      |
| Espaçamento       | `chat-container.tsx:86`                | Footer com `py-[7px]` — mesmo problema de valor fora da grade 4px.                             | Grid de espaçamento (múltiplos de 4) | Trocar `py-[7px]` por `py-2`.                                                                                      |
| Semântica HTML   | `chat-container.tsx:71`                | Conteúdo principal (header + messages + input + footer) envolvido em `<div>` sem landmark `<main>`. | Estrutura semântica / landmarks      | Adicionar `<main className="flex-1 flex flex-col">` envolvendo a área de mensagens + input.                       |
| Heading hierarchy| `header.tsx:20` + `welcome-screen.tsx:33` | Dois `<h1>` na mesma página: header define `<h1>SOFIA</h1>` e welcome-screen também define `<h1>SOFIA</h1>`. | Um `<h1>` por página                  | No welcome-screen, trocar `<h1>` por `<h2>` (o header já é o h1 da página).                                       |
| ARIA redundante   | `icons/SendIcon.tsx:8`                 | SVG com `role="img" aria-label="Enviar"` dentro de botão que já tem `aria-label="Enviar mensagem"`. Causa duplo anúncio em leitores de tela. | ARIA redundante                       | Remover `role` e `aria-label` do SendIcon (decorativo dentro de botão rotulado). Adicionar `aria-hidden="true"`.   |
| CSS indefinido    | `not-found.tsx:21`                     | `text-[var(--gray-medium)]` — a variável `--gray-medium` não está definida em `globals.css`. Cor pode não renderizar como esperado. | Consistência de tokens               | Substituir por `text-[var(--text-muted)]` (definido como `#6B7280`).                                              |
| Foco visual       | `chat-input.tsx:52`                    | Textarea com `focus:outline-none` — remove outline padrão. Substitui por `focus:border` e `focus:bg`, mas sem `focus-visible:ring` ou `box-shadow`. Indicador de foco pode ser sutil demais para usuários de teclado/baixa visão. | Foco visível obrigatório              | Adicionar `focus-visible:ring-2 focus-visible:ring-[var(--navy)] focus-visible:ring-offset-1` ao textarea.        |
| Foco visual       | `welcome-screen.tsx:48`                | Botões de sugestão sem estilo `focus-visible` explícito. Depende apenas do outline global (`outline-ring/50` em `*`). | Foco visível                         | Adicionar `focus-visible:ring-2 focus-visible:ring-[var(--navy)] focus-visible:ring-offset-2` aos botões.         |
| Foco visual       | `chat-message.tsx:97-99`               | Botões de feedback sem estilo `focus-visible` explícito. Depende apenas do outline global.      | Foco visível                         | Adicionar `focus-visible:ring-2 focus-visible:ring-[var(--gold)]` aos botões.                                     |
| Touch targets     | `components/ui/button.tsx:25`          | Variante `sm` com `h-10` (40px) — ligeiramente abaixo do mínimo 44px.                         | Alvo de toque mínimo                  | Considerar `h-11` para variante `sm`, ou documentar que `sm` é para desktop-only.                                |

---

## PROMPT 3 — Síntese e Relatório Executivo

### 3.1 Resumo Geral de Conformidade

**Classificação: Majoritariamente conforme, com melhorias pontuais em acessibilidade.**

O projeto demonstra boas práticas em vários aspectos: uso consistente de elementos semânticos (`<header>`, `<footer>`, `<main>`, `<form>`, `<button>`), presença de `aria-label` em inputs e botões, `aria-live` no indicador de typing, `sr-only` para texto de screen reader, `role="alert"` no error boundary, e respeito a `prefers-reduced-motion`. Não há violações graves de semântica como `<div onClick>` — todas as ações usam `<button>` nativo com `type` correto.

Os principais riscos concentram-se em **dois pontos**: (1) alvos de toque subdimensionados nos botões de feedback (23px) e sugestões (30px), que afetam diretamente usabilidade mobile; e (2) ausência de `<main>` landmark e duplicação de `<h1>`, que impactam navegação por leitores de tela. Ambos são corrigíveis com mudanças pontuais, sem necessidade de refatoração estrutural.

### 3.2 Problemas por Categoria

#### Acessibilidade (P0)

- **Dois `<h1>` na mesma página**: O header (`header.tsx:20`) e a welcome screen (`welcome-screen.tsx:33`) ambos definem `<h1>SOFIA</h1>`. Leitores de tela anunciam dois headings de nível 1, quebrando a expectativa de hierarquia. Correção: welcome-screen deve usar `<h2>`.
- **Ausência de landmark `<main>`**: O `chat-container.tsx` envolve todo o conteúdo em `<div>`, sem `<main>`. Usuários de leitor de tela não podem saltar para o conteúdo principal. Correção: envolver a área de mensagens + input em `<main>`.
- **ARIA redundante no SendIcon**: O SVG tem `role="img" aria-label="Enviar"` mas está dentro de um `<button aria-label="Enviar mensagem">`. Screen readers anunciam ambos, causando confusão. Correção: `aria-hidden="true"` no SVG.

#### Touch Targets (P0)

- **Botões de feedback (~23px)**: `px-3 py-1 text-[10px]` produz alvo muito pequeno. Em mobile, difícil de acertar sem zoom. Aparece em toda mensagem do assistente.
- **Botões de sugestão (~30px)**: `px-3.5 py-[7px] text-[11px]` também abaixo do mínimo. São o ponto de entrada principal para novos usuários.

#### Foco Visual (P1)

- O textarea remove `outline` nativo e substitui por mudança de borda — indicador sutil demais. Botões de sugestão e feedback dependem do outline global em `*`, que pode ser inconsistente entre navegadores. A recomendação é padronizar com `focus-visible:ring-2` em todos os elementos interativos.

#### Consistência Visual (P2)

- Dois pontos com `py-[7px]` fora da grade 4px. Variável `--gray-medium` referenciada mas não definida. shadcn Button `sm` a 40px (borderline).

### 3.3 Sugestões de Padronização

- Criar **tokens de tamanho para touch targets**: `--touch-min: 44px` e garantir que todos os botões interativos respeitem esse mínimo via `min-h-[var(--touch-min)]` ou `min-h-[44px]`.
- Padronizar **foco visível** com um ring consistente: `focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2` aplicado globalmente ou como variante base de botões.
- Estabelecer **convenção de heading**: o `<header>` define o `<h1>` da aplicação; todos os outros headings na página devem começar em `<h2>`.
- Centralizar **tokens de tipografia** em `@theme inline` (ex.: `--text-xs`, `--text-sm`, `--text-base`) em vez de valores arbitrários `text-[10px]`, `text-[11px]` espalhados pelos componentes.
- Remover `aria-label` de ícones decorativos dentro de elementos já rotulados.

#### 3.3.1 Snippet — Correção P0 (Botões de Feedback com Touch Target Adequado)

```tsx
// components/sofia/chat-message.tsx — linhas 91-114
// ANTES (23px de altura):
<button
  type="button"
  className="font-sans text-[10px] px-3 py-1 rounded-full border ..."
>
  útil
</button>

// DEPOIS (44px de altura, texto legível):
<button
  type="button"
  className="font-sans text-xs px-3.5 py-2.5 rounded-full border min-h-[44px] inline-flex items-center justify-center transition-all duration-150 ..."
>
  útil
</button>
```

```tsx
// components/sofia/welcome-screen.tsx — linha 48
// ANTES (~30px de altura):
className="... text-[11px] ... px-3.5 py-[7px] rounded-3xl ..."

// DEPOIS (44px de altura):
className="... text-xs ... px-4 py-2.5 rounded-3xl min-h-[44px] inline-flex items-center justify-center ..."
```

### 3.4 Backlog Priorizado

| Prioridade | Tipo                  | Descrição resumida                                   | Impacto principal                        |
|------------|-----------------------|------------------------------------------------------|------------------------------------------|
| P0         | Touch targets         | Botões de feedback (~23px) e sugestões (~30px) abaixo do mínimo 44px | Usabilidade mobile, acessibilidade WCAG 2.5.8 |
| P0         | Semântica             | Dois `<h1>` na mesma página (header + welcome-screen) | Leitores de tela, hierarquia de headings  |
| P0         | Semântica             | Ausência de landmark `<main>` no chat-container      | Navegação por screen readers              |
| P0         | ARIA                  | `aria-label` redundante no SendIcon                  | Duplo anúncio em leitores de tela         |
| P1         | Foco visual           | Textarea com `outline:none` e indicador sutil demais  | Usuários de teclado / baixa visão         |
| P1         | Foco visual           | Botões de sugestão/feedback sem `focus-visible` explícito | Consistência de foco                     |
| P1         | Tokens                | `--gray-medium` referenciado mas não definido (404)  | Renderização incorreta de cor             |
| P2         | Espaçamento           | `py-[7px]` fora da grade 4px em 2 locais            | Coesão visual                             |
| P2         | Touch targets         | shadcn Button variante `sm` com 40px (borderline)    | Documentar uso desktop-only               |
