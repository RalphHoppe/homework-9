# Microsoft sign-in flow — mockup

A pixel-faithful, interactive mockup of the Microsoft sign-in flow, rebuilt as a real
**Vite + React + TypeScript** application. Nothing here talks to Microsoft: it is a front-end
reproduction used to study the flow, and every page says so where the real one asks you to
trust it.

## Pages

| Route              | Page                       | Look               |
| ------------------ | -------------------------- | ------------------ |
| `/`                | Sign in                    | classic (2015-ish) |
| `/pick-account`    | Pick an account            | classic            |
| `/get-a-code`      | Get a code to sign in      | Fluent             |
| `/verify-email`    | Verify your email          | Fluent             |
| `/enter-code`      | Enter your code            | Fluent             |
| `/password`        | Enter your password        | Fluent             |
| `/work-password`   | Work or school password    | classic            |
| `/approve-sign-in` | Approve sign in request    | classic            |
| `/work-enter-code` | Enter code (Authenticator) | classic            |

`src/test/fidelity.test.tsx` is the guard on the whole idea: it renders every step and
compares its element ids, copy and title against the HTML page it replaced.

Moving from one step to the next is animated the way the reference animates it — the
classic steps slide 200px and fade in, the Fluent steps fade in while their box changes
height. `ARCHITECTURE.md` has the numbers.

The account name is carried along the flow as `?email=…` (and remembered in
`localStorage` under `msft-demo-email`), so every step can show the same identity the
real pages show. An unknown route goes back to `/`.

```
sign-in ──▶ pick an account ──┬─▶ get a code ──▶ verify email ──▶ enter code
                              │        └── "Use your password" ──▶ personal password
                              └─▶ work or school password ──▶ approve sign in request
                                                                    │
                                        "I can't use my Authenticator app" ──▶ enter code
```

The last two steps were saved from the live flow rather than written by hand
(`legacy/app-auth-work.html`, `legacy/enter-code-work.html`), so they keep the ids their
capture carries — including the ones on the shell around the background and the card.

## Commands

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # typecheck + production bundle into dist/
npm run preview    # serve the built bundle
npm test           # vitest: page behaviour, routing, flow helpers, legacy fidelity
npm run typecheck  # tsc --noEmit
npm run lint       # oxlint
npm run format     # prettier
npm run verify     # typecheck + lint + test + build, the whole gate
```

## Layout

```
src/
  main.tsx            React entry point
  App.tsx             route table
  pages/              one component per step (+ a colocated *.test.tsx)
  components/         layout / brand / common / fields — the shared pieces
  flow/               routing constants, session + account helpers, hooks
  styles/             global.css (tokens, reset, background) + the two CSS Modules
  assets/             logo, background, icons
  test/               vitest setup and the render helper
legacy/               the original hand-written HTML pages, kept for reference
```

The `verify` script is the gate: typecheck, lint, test and build have to be green
together. `.github/workflows/ci.yml` runs the same four on every push.

`ARCHITECTURE.md` explains how the pieces fit together; `AGENTS.md` is the rulebook for
changing things without breaking the illusion.

## `legacy/`

The seven original HTML pages live on in `legacy/` with their `styles.css` and `flow.js`.
They are the reference the React pages were ported from — keep them, and diff against
them when a pixel is in question. They are deliberately **not** formatted or modernised.
