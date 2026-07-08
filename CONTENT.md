# Content sources & accuracy

This is **study material**, so lesson correctness is treated as a first-class concern.

## Source of truth

The **[Frontend Interview Handbook](https://www.frontendinterviewhandbook.com/)** is the primary
reference for topics, canonical solutions, and "what interviewers probe." When a topic lives behind
the handbook's paid tier, cross-check against reputable public sources (MDN, the relevant spec,
official React/Node/Express/MongoDB docs, and widely-cited community solutions) and prefer the
canonical implementation.

Every taught implementation should match the standard, expected interview answer — not a clever
variant. If in doubt, teach the version the handbook/MDN would.

## How accuracy is enforced (tests)

`client/tests/` guards content correctness on every run (`npm test`):

- **`unit/taught-logic.test.js`** — executes the *actual* code taught in the vanilla lessons and
  asserts canonical behavior (e.g. `debounce` fires once on the trailing edge with the latest args;
  `promiseAll` preserves order and rejects fast; `decodeJwt` reads the claims; password `verify`
  accepts the right password and rejects wrong ones; middleware short-circuits; CRUD returns
  201/200/404/204). If a reference implementation regresses, these fail.
- **`unit/lesson-code.test.js`** — every starter/solution snippet (JS/JSX/CSS) must compile
  (esbuild). A broken snippet can never ship silently.
- **`unit/content-integrity.test.js`** — structural correctness: unique ids, valid module/track
  references, required fields, valid `kind`/`difficulty`, editor lessons ship starter code, etc.
- **`unit/curriculum.test.js` / `unit/glossary.test.js`** — navigation/progression helpers and the
  auto-built glossary stay consistent.

## Adding or editing a lesson

1. Confirm the concept and the canonical solution against the handbook (or public sources if paid).
2. Add/adjust the lesson object (see `CLAUDE.md` → *How to add a lesson*).
3. For any runnable utility, add/extend an assertion in `taught-logic.test.js` proving the taught
   code is correct.
4. Run `npm test` — all green before committing.
