# AGENTS.md

Rules for working in this repository. They exist because the mockup is only useful while
it still matches the real Microsoft pages.

## Working agreements

- **Behaviour over decoration.** Errors appear only after the visitor acts; no state is
  prefilled that the real page would leave empty; no control is added that the real page
  does not have. If the reference has no Next button, there is no Next button.
- **Ask, don't guess, when a change would move a pixel.** New copy, a new control, or a
  different spacing needs a reference — a capture in `screenshots/` or a file in
  `mockup-downloaded -by-single-file/`.
- **Never claim to have looked at a screenshot.** Say what was measured instead.
- `legacy/` is the reference. Do not format, modernise or delete it.

## Before you finish

```bash
npm run verify     # typecheck + lint + test + build
```

All four must be green. Do not commit a change that only passes three.

## Conventions

- TypeScript strict, path alias `@/*` → `src/*`, named exports for components.
- CSS lives in `src/styles/*.module.css` and is consumed as `s['class-name']`; join
  conditional classes with `cx()` from `src/utils/cx.ts`.
- **Never retype a CSS value.** Copy it out of `legacy/styles.css`. No unit conversions,
  no colour normalisation, no "cleaner" shorthand.
- **Element ids come from the real pages** and are part of the contract (see
  `ARCHITECTURE.md`). Add them, keep them, do not rename them.
- Icons use the real Fluent path data (`src/components/brand/icons.tsx`). Do not
  hand-draw an approximation.
- Tests live beside the code: `src/**/*.test.{ts,tsx}`, Vitest + jsdom. Query by role,
  label or text — CSS Module class names are hashed and must not be asserted on.
- One page per file, one concern per component. If a page grows a reusable piece, that
  piece moves to `src/components/`.

## Git

- Work on the branch handed to you; commit in small, honest messages.
- Keep generated output out of Git: `dist/`, `coverage/`, `node_modules/` are ignored.
- Large captures (`screenshots/`, `mockup-downloaded -by-single-file/`) are working
  material — check with the user before adding bulk to the repository.
