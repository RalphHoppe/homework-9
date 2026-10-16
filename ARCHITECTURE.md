# Architecture

A single-page app with one component per step of the Microsoft sign-in flow. The design
goal is unusual and drives most decisions below: **the pages must look exactly like the
captured reference pages**, so this is a refactor of `legacy/*.html`, not a redesign.

## Layers

```
main.tsx ─▶ App.tsx ─▶ pages/* ─▶ components/* ─▶ styles/*
                 │
                 └─▶ flow/*  (routing, session, account helpers)
```

### `flow/` — the state of the flow

- `routes.ts` — `ROUTES` (the only place a path is spelled out), `RoutePath`, `STEP_ORDER`.
- `account.ts` — pure helpers: `classifyAccount`, `maskEmail`, `withAccount`, and the
  `localStorage` read/write behind the `msft-demo-email` key.
- `SessionProvider.tsx` — the one piece of shared state: `account`. It is **derived**, not
  copied: `?email=` wins, then the stored name, then `DEFAULT_ACCOUNT`. Only a name the
  visitor typed is written back to storage.
- `useFlowNavigation.ts` — `go(path, account?)`: navigates and carries the account along.
- `usePageTitle.ts` — sets `document.title`, matching the reference `<title>`.
- `useBodyFamily.ts` — sets `body[data-family]`, which selects the typography of the look.

### `components/` — the shared pieces

- `layout/` — `ClassicLayout` and `FluentLayout` render the background layers and the
  `outer / middle` skeleton of their look, and set `data-family`. Every page picks one.
- `brand/` — `MicrosoftLogo` (two sizes, one per look) and `icons.tsx` (the Fluent icon
  path data, copied from the captures — never redrawn).
- `common/` — `IdentityBadge`, `IconButton` (back / close), `DemoNote`, and the two
  footers.
- `fields/` — `UnderlineField` (classic), `FluentTextField` (floating label, reveal
  toggle), `CodeEntry` (six boxes, paste, arrows, backspace), `InlineError`,
  `ValidationMessage`.

### `pages/` — one step each

Each page is self-contained: it owns its own local form state, its own validation copy,
and renders one layout. They share nothing but `flow/` and `components/`, which keeps a
change to one step from moving another. Tests sit next to them as `*.test.tsx`.

## Styling

- `styles/global.css` — design tokens (`--colorNeutral*`, `--colorBrand*`, radii,
  shadows, font stacks), the reset, the `body[data-family]` typography split, and the
  fixed background layers. Loaded once from `main.tsx`.
- `styles/classic.module.css` and `styles/fluent.module.css` — CSS Modules, one per look,
  **ported verbatim** from `legacy/styles.css`. Both are scoped by a single `root`
  ancestor class that the matching layout component applies; rules are reached as
  `.root .tile` and consumed as `s['tile']`.
- Values are not rounded, converted or "cleaned up". If the reference says
  `padding: 24px 32px 32px`, the module says exactly that.
- Two ids became classes during the port (`#usernameError`, `#passwordError`,
  `#alertRegion`) because CSS Modules cannot scope ids. The React markup uses them as
  **both** the class and the `id`, so existing selectors and tests keep working.
- Tailwind, Fluent UI and any other component library were rejected on purpose: they
  would change the look.

## Element ids are a contract

The ids (`i0116`, `idA_PWD_ForgotPassword`, `proof-confirmation-email-input`, `codeEntry`,
`aadTile`, `msaTile`, `bannerText`, …) come from the real pages and are reused verbatim as
React `id`s. The reference links (`aria-describedby`, `for`/`id`) and the tests depend on
them; renaming one is a breaking change, not a tidy-up.

## Testing

Vitest + jsdom + Testing Library, `src/**/*.test.{ts,tsx}`:

- `src/flow/account.test.ts` — the pure helpers.
- `src/pages/*.test.tsx` — behaviour per step: what shows before you touch anything,
  which error appears when you submit too early, where each button or link goes.
- `src/App.test.tsx` — the route table and the unknown-route fallback.
- `src/test/fidelity.test.tsx` — renders every step and compares its element ids,
  copy and title with the `legacy/*.html` page it replaced. This is the test that
  fails if someone changes the words or drops an id from the reference.

`src/test/renderPage.tsx` mounts a page inside `MemoryRouter` + `SessionProvider` and
exposes `location()` so a test can assert the navigation that followed a click.

Query by role, label or text — never by CSS class. CSS Modules hash class names, so
`.subtitle` does not exist in the rendered DOM even though it exists in the source.

## Adding a step

1. `ROUTES` in `flow/routes.ts`.
2. `src/pages/NewStepPage.tsx` inside the matching layout.
3. Route in `src/App.tsx`.
4. `src/pages/NewStepPage.test.tsx`.
5. `legacy/` reference for the copy and the CSS — and nothing else changes.
