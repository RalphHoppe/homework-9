# Architecture

A single-page app with one component per step of the Microsoft sign-in flow, rendered
inside one shell. The design goal is unusual and drives most decisions below: **the pages
must look exactly like the captured reference pages**, so this is a refactor of
`legacy/*.html`, not a redesign.

## Layers

```
main.tsx ─▶ App.tsx ─▶ layout/FlowShell ─▶ steps/* ─▶ components/* ─▶ styles/*
                 │                  │
                 │                  └─▶ layout/StepBody (the part that moves)
                 └─▶ flow/*  (routing, session, account helpers)
```

## One box

The flow is **one box** that never unmounts. Moving from one step to the next changes
what is inside it, not what is on the screen around it: the background, the box, the logo
and the footer stay put, and only the contents of the box are replaced. The steps are
still routes — every step keeps its own URL, so a reload, a bookmark and the browser's
back button all work — but in normal use nothing loads, because the shell is already
there.

`components/layout/FlowShell.tsx` is that shell, and it is the only layout:

- It renders `BackgroundLayers`, the box, the logo (or the Fluent banner with its back /
  close button), the step, a trailing slot, and the footer.
- It reads the step it is showing from `flow/steps.ts` and takes the shape of that step's
  family: `classic` (old pages, square white card, no radius) or `fluent` (new pages,
  rounded card with a soft shadow). Crossing between the two families **morphs the same
  box** — radius, shadow, padding, width, typography and height all transition — rather
  than swapping one card for another. `layout/box.module.css` holds that transition.
- The footer belongs to the family too, so it swaps without morphing.
- `captured` steps (the two that were saved from the live flow) carry ids on the shell,
  the background and the footer that the hand-written pages have no use for; the shell
  renders them for those steps only.

`components/layout/StepBody.tsx` is the part that moves. A step wraps its own
contents in it — the shell cannot, because not everything a step renders should
move:

|           | classic (`/`, `/pick-account`, `/work-password`, `/approve-sign-in`, `/work-enter-code`) | Fluent (the other four)                                        |
| --------- | ---------------------------------------------------------------------------------------- | -------------------------------------------------------------- |
| element   | the contents of the card — **not** the row of buttons pinned to it                       | the contents of the card                                       |
| effect    | slides 200px and fades in                                                                | fades in                                                       |
| direction | in from the right going forward, from the left going back                                | none                                                           |
| timing    | `0.25s cubic-bezier(.5, 0, .5, 1)`, `animation-fill-mode: both`                          | `250ms cubic-bezier(.1, 0.9, 0.2, 1)` = `--curveDecelerateMax` |

The direction travels with the navigation: `useFlowNavigation` compares the two steps in
`STEP_ORDER` and puts the answer in the router location state, which `useFlowDirection`
reads. Steps reached by a plain link or by loading the page carry no direction and slide
in forward, the way the reference slides in its first view.

The classic slide is `transform`, where the reference animates `left`: the row of buttons
pinned to the card is placed with `left`, and an animation on the same property would
leave it moved once it settled. The logo is left out of the slide, the way the captures
leave it out of `.pagination-view` — and so is that pinned row, for the same reason
`transform` was chosen: an animated element is a containing block for anything placed
with `position: absolute`, so a pinned row inside `StepBody` would measure its 44px from
the body instead of from the card, and every `Next`, `Back`, `Sign in` and `Verify`
button would sit off the spot the reference puts it on.

Two deliberate differences from the reference, noted in the components:

- **The outgoing view is not animated.** The reference fades it out (`hide-to-left` /
  `hide-to-right`) over the first half of the transition. This app renders one step at a
  time, and holding two copies of a step would duplicate every element id in the
  document — so the incoming view starts immediately instead of after a 0.25s delay.
- **The box grows and shrinks instead of jumping.** Height cannot be transitioned to
  `auto`, so the shell keeps the height the last step settled at in a ref and animates
  from there — measured in a layout effect, never during render.

`components/layout/StepTrailing.tsx` is the escape hatch for a step that wants something
below the box but above the footer: the sign-in step's second card ("Sign-in options")
is declared inside the step and portalled into the shell's trailing slot, so it stays
with the step that owns it and lands in the right place in the document.

### `flow/` — the state of the flow

- `steps.ts` — `STEPS`: every step in flow order, with its path, its design family,
  whether it was captured from the live flow, and which button leads its banner (`back`
  or `close`, Fluent only). **This is the one place the shape of the flow is described**;
  the router table, the shell and the direction helper all read from it.
- `routes.ts` — `ROUTES` (the only place a path is spelled out) and `RoutePath`.
- `account.ts` — pure helpers: `classifyAccount`, `maskEmail`, `withAccount`, and the
  `localStorage` read/write behind the `msft-demo-email` key.
- `SessionProvider.tsx` — the one piece of shared state: `account`. It is **derived**, not
  copied: `?email=` wins, then the stored name, then `DEFAULT_ACCOUNT`. Only a name the
  visitor typed is written back to storage.
- `useFlowNavigation.ts` — `go(path, account?)`: navigates and carries the account along.
- `usePageTitle.ts` — sets `document.title`, matching the reference `<title>`.
- `useBodyFamily.ts` — sets `body[data-family]`, which selects the typography of the look.

### `components/` — the shared pieces

- `layout/` — `FlowShell` (the one box), `StepBody` (the part of a step that
  moves), `StepTrailing` (the portalled slot below the box), `BackgroundLayers`.
- `brand/` — `MicrosoftLogo` (two sizes, one per look) and `icons.tsx` (the Fluent icon
  path data, copied from the captures — never redrawn).
- `common/` — `IdentityBadge`, `IconButton` (back / close), `DemoNote`, and the two
  footers.
- `fields/` — `UnderlineField` (classic), `FluentTextField` (floating label, reveal
  toggle), `CodeEntry` (six boxes, paste, arrows, backspace), `InlineError`,
  `ValidationMessage`.

### `steps/` — one step each

Each step is self-contained: it owns its own local form state, its own validation copy,
and renders only its own contents — the box it sits in belongs to the shell. It wraps
what should animate in `<StepBody>`, and leaves out what should not: on the classic
steps the row of buttons pinned to the bottom of the card (`Next`, `Back`, `Sign in`,
`Verify`) stays **outside** it. Those rows are placed with `position: absolute`, and an
animated element is a containing block for absolutely placed descendants — wrapped in
one, every pinned button would move off the spot the reference puts it on. Tests sit next to them as `*.test.tsx`. `steps/elements.tsx` maps each path to
its step element, so the flow description in `flow/steps.ts` never has to import a
component.

## Styling

- `styles/global.css` — design tokens (`--colorNeutral*`, `--colorBrand*`, radii,
  shadows, font stacks), the reset, the `body[data-family]` typography split, and the
  fixed background layers. Loaded once from `main.tsx`.
- `styles/classic.module.css` and `styles/fluent.module.css` — CSS Modules, one per look,
  **ported verbatim** from `legacy/styles.css`. Both are scoped by a single `root`
  ancestor class that the shell applies; rules are reached as `.root .tile` and consumed
  as `s['tile']`.
- `components/layout/box.module.css` — the one box: the morph between the two looks, and
  the height transition.
- Values are not rounded, converted or "cleaned up". If the reference says
  `padding: 24px 32px 32px`, the module says exactly that.
- The two captured work steps disagree with the hand-written pages in one place — their
  card leaves 28px under itself instead of 20px — so that value lives on a step class
  (`.sign-in-box.verify-box`) rather than on the shared rule.
- Two ids became classes during the port (`#usernameError`, `#passwordError`,
  `#alertRegion`) because CSS Modules cannot scope ids. The React markup uses them as
  **both** the class and the `id`, so existing selectors and tests keep working.
- Tailwind, Fluent UI and any other component library were rejected on purpose: they
  would change the look.

## Element ids are a contract

The ids (`i0116`, `idA_PWD_ForgotPassword`, `proof-confirmation-email-input`, `codeEntry`,
`aadTile`, `msaTile`, `bannerText`, `idDiv_SAOTCAS_Title`, `idTxtBx_SAOTCC_OTC`, …) come
from the real pages and are reused verbatim as React `id`s. The reference links
(`aria-describedby`, `for`/`id`) and the tests depend on them; renaming one is a breaking
change, not a tidy-up.

## Testing

Vitest + jsdom + Testing Library, `src/**/*.test.{ts,tsx}`:

- `src/flow/account.test.ts` — the pure helpers.
- `src/steps/*.test.tsx` — behaviour per step: what shows before you touch anything,
  which error appears when you submit too early, where each button or link goes.
- `src/components/layout/FlowShell.test.tsx` — that the box is the same element before
  and after a step change, that it morphs with the family, and that the footer and the
  animation follow the family too.
- `src/App.test.tsx` — the route table and the unknown-route fallback.
- `src/test/fidelity.test.tsx` — renders every step inside the shell and compares its
  element ids, copy and title with the `legacy/*.html` page it replaced. This is the test
  that fails if someone changes the words or drops an id from the reference.

`src/test/renderFlow.tsx` mounts the flow — `MemoryRouter` + `SessionProvider` + the
shell with all of its routes — at the route a test names, and exposes `location()` so a
test can assert the navigation that followed a click.

Query by role, label or text — never by CSS class. CSS Modules hash class names, so
`.subtitle` does not exist in the rendered DOM even though it exists in the source.

## Adding a step

1. `ROUTES` in `flow/routes.ts`.
2. `STEPS` in `flow/steps.ts` — its family decides the box, the footer, the banner and
   the animation.
3. `src/steps/NewStepStep.tsx` — its contents in `<StepBody>`, anything pinned to the
   card outside it — plus its element in `src/steps/elements.tsx` and its route in
   `src/App.tsx`.
4. `src/steps/NewStepStep.test.tsx`.
5. `legacy/` reference for the copy and the CSS — and nothing else changes.
