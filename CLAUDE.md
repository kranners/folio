# migrate-to-css

## Motivations and Context

- Utility soup is unreadable. Class strings like `pointer-events-none absolute inset-x-0 bottom-8 flex justify-center` carry the whole layout inside the markup. Styling should read as CSS, in a stylesheet, next to the thing it styles.
- Fewer dependencies. `tailwindcss`, `@tailwindcss/vite` and `sass` all come out of `package.json`, and the plugin comes out of `astro.config.mjs`. The build should need no styling tooling beyond what Astro and Vite already do.
- This is a poly-framework site. Five islands across Astro, React, Preact, Svelte and Vue share one Tailwind vocabulary today. Native CSS travels between frameworks without a shared build step, so an island can be rewritten in another framework without dragging its styling system along.
- It is a portfolio. Hand-written CSS is part of what it demonstrates.

## Outcomes

- Every Tailwind class is gone from `src/`. No `@import "tailwindcss"`, no `@utility`, no `@variant`, no utility class names in any `.astro`, `.jsx`, `.svelte` or `.vue` file.
- Styles use each framework's own scoping. `<style>` in `.astro`, `<style>` in `.svelte`, `<style scoped>` in `.vue`, and `.module.css` files for the React and Preact islands. `src/components/react/call-to-action/styles.module.scss` becomes `styles.module.css` as plain CSS.
- Plain `.css` only. No Sass anywhere.
- `src/styles/global.css` holds three things and nothing else: a hand-written reset, `:root` custom properties, and the rules that genuinely cross island boundaries — the shared card footprint (today's `card-size` utility, used by `deck.jsx` and `hand.jsx`) and the framework-bubble reveal pair keyed on `html[data-frameworks-revealed]`.
- The reset is written by hand and covers only what this site needs. It must preserve the parts of Tailwind preflight the layout silently depends on: `box-sizing: border-box`, zeroed default margins, block-level images with `max-width: 100%`, and a system sans-serif font stack on the root. Losing any of these changes the rendering.
- Colours become custom properties in `:root` — the five section backgrounds (`#F9F9F9`, `#FEE3AC`, `#B5DCF0`, `#AECEA6`, `#E3C9D6`), the greys, the link blue, the hint navy `#011c53`, the frappuccino brown `#733e19`, and whatever `text-teal-600` resolves to. Breakpoints stay literal, because custom properties cannot be used in `@media` conditions: `lg` is `min-width: 64rem`, `md` is `min-width: 48rem`, and the call-to-action keeps its existing `max-width: 700px`.
- Every value Tailwind was computing is resolved to a literal read from the current build output (`dist/_astro/main-head.*.css`), not guessed. This includes the spacing scale behind `calc(var(--spacing) * 68)` and `* 88`, the type scale behind `text-3xl` / `text-lg` / `text-xl` / `text-4xl`, `font-bold` / `font-black`, and the teal of the logomark.
- The `.snap-start` JS hook is replaced by a data attribute. `Section` renders `data-section`; `scroll-hint/index.jsx` and `call-to-action/index.jsx` use `closest("[data-section]")`. Behaviour no longer depends on a class name that exists for styling reasons.
- `ScrollHint` is positioned by a CSS custom property, not a class passed across the island boundary. `index.astro` sets `--scroll-hint-bottom`; the component's module rule reads `bottom: var(--scroll-hint-bottom, <default>)`. The `className` prop is removed.
- The site is visually equivalent, not necessarily pixel-identical. Small awkwardnesses that existed only because of Tailwind — arbitrary-value magic numbers, the underscore-escaped `calc`, duplicated `h-dvh w-screen max-h-[-webkit-fill-available]` stacks — may be tidied where the result is clearly the same design. The five sections, the mobile viewport fixes from `168457c`, and the iOS carousel swipe all still work.
- `404.astro` already uses plain scoped CSS, but inherits preflight today. It is re-checked after the reset lands.
- `npm run build` (which runs `astro check`) and `npm run lint` both pass. Visual equivalence is confirmed by the author manually, at desktop and mobile widths, across all five sections.

## Scope

- package.json
  - Remove `tailwindcss`, `@tailwindcss/vite` from dependencies.
  - Remove `sass` from devDependencies.
- astro.config.mjs
  - Remove the `@tailwindcss/vite` import and the `vite.plugins` block.
- src/styles/global.css
  - Drop `@import "tailwindcss"` and the `@utility card-size` block.
  - Add a hand-written reset:
    - `*, *::before, *::after { box-sizing: border-box; }`
    - `* { margin: 0; }`
    - `img, svg, video { display: block; }`
    - `img, video { max-width: 100%; height: auto; }`
    - `html { font-family: var(--font-sans); }`
    - `button { font: inherit; color: inherit; background: none;`
      `border: 0; }`
  - Add `:root` custom properties:
    - `--font-sans: -apple-system, BlinkMacSystemFont, "Segoe UI",`
      `Roboto, "Helvetica Neue", "Noto Sans", Arial, sans-serif,`
      `"Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol",`
      `"Noto Color Emoji"`
    - `--section-signature: #F9F9F9`, `--section-roles: #FEE3AC`
    - `--section-companies: #B5DCF0`, `--section-coffee: #AECEA6`
    - `--section-contact: #E3C9D6`
    - `--grey: #666`
    - `--link-blue: #6FA2D7`, `--hint-navy: #011c53`
    - `--frappuccino: #733e19`, `--deal-ink: #4a230f`
    - `--logomark-teal: oklch(60% .118 184.704)`
  - Keep only the `.framework-bubble` reveal pair, unchanged.
- src/components/astro/section/index.astro
  - Add a `style` prop, merged with `backgroundColor` on the root div.
  - Replace `class="snap-start ..."` with `data-section`.
  - Add a scoped `<style>` block:
    - `[data-section] { scroll-snap-align: start; display: flex;`
      `flex-direction: column; overflow: hidden; height: 100dvh;`
      `width: 100vw; max-height: -webkit-fill-available; }`
    - `.body { position: relative; flex-grow: 1; }`
    - `.layer { position: absolute; inset: 0; }`
    - `.bubble { user-select: none; pointer-events: none; }`
    - Both absolute children carry `.layer`; the two repeated
      `h-dvh w-screen max-h-[-webkit-fill-available]` stacks on them
      collapse into `inset: 0`.
- src/components/astro/framework-bubble/index.astro
  - Strip all classes; keep `.framework-bubble` on the root div.
  - Add scoped `<style>`:
    - `.framework-bubble { display: flex; align-items: flex-end;`
      `position: relative; width: 100vw; height: 100dvh; }`
    - `.stack { display: flex; flex-direction: column;`
      `align-items: center; justify-content: center;`
      `position: relative; max-width: 10rem; }`
    - `.bubble { width: 15vw; }` with
      `@media (min-width: 48rem) { .bubble { width: 20vw; } }`
    - `.logo { position: absolute; width: 25%; margin-top: 40%; }`
    - Use `:global()` or `is:global` as needed for `<Image>` classes.
- src/pages/index.astro
  - Remove `className` props from both `<ScrollHint>` uses.
  - Pass `style={{ "--scroll-hint-bottom": "calc(12vw + 1.5rem)" }}`
    to the signature `<Section>`.
  - Replace the scroll container classes with a `.sections` class.
  - Add scoped `<style>`:
    - `.sections { height: 100dvh; width: 100vw; overflow-y: scroll;`
      `scroll-snap-type: y mandatory; }`
- src/pages/404.astro
  - Re-check `.wrapper` and `.heading` against the new reset.
  - Replace `color: #666` with `var(--grey)`.
- src/components/svelte/logomark/index.svelte
  - Strip classes; add a `<style>` block:
    - `.logomark { position: absolute; top: 20%; left: 50%;`
      `transform: translate(-50%, -50%);`
      `mix-blend-mode: difference; }`
    - `p { width: 10rem; margin-right: 0.5rem; font-size: 2.25rem;`
      `line-height: calc(2.5 / 2.25); text-align: center;`
      `color: var(--logomark-teal); font-weight: 900;`
      `user-select: none; }`
- src/components/svelte/signature/signature.svelte
  - Strip classes; add a `<style>` block:
    - `.signature { width: 100vw; height: 100dvh; display: flex;`
      `flex-direction: column; justify-content: space-between;`
      `position: relative; }`
    - `.guy { padding-top: 35vh; max-width: 40vw;`
      `margin-right: 50vw; align-self: flex-end; }`
    - `.mystery { position: absolute; bottom: 0; max-width: 30vw;`
      `align-self: center; }`
- src/components/vue/frappuccino-link/frappuccino-link.vue
  - Strip classes; keep `float`, `ease-all`, `glow` rules as-is.
  - Add to the existing `<style scoped>`:
    - `.container { position: relative; width: 100%; height: 100%;`
      `display: flex; align-items: center; justify-content: center; }`
    - `.glow { pointer-events: none; display: flex;`
      `align-items: center; justify-content: center; }`
    - `.cup { max-width: 24rem; width: 60vw; pointer-events: auto; }`
    - `.cup:hover { max-width: 28rem; width: 70vw; }`
    - `.caption { position: absolute; left: 0; right: 0;`
      `bottom: 8dvh; text-align: center;`
      `color: var(--frappuccino); }`
    - `.caption p { font-size: 35px; }`
    - `.caption a { font-size: 20px; text-decoration: underline; }`
- src/components/preact/roles/index.jsx
  - Add `styles.module.css` alongside; import as `Styles`.
  - Replace every `className` string with a module class:
    - `.frame { height: 100dvh; display: flex;`
      `align-items: center; justify-content: center; }`
    - `.line { font-size: 1.875rem; line-height: calc(2.25 / 1.875);`
      `font-weight: 700; display: flex; flex-direction: row;`
      `align-items: center; gap: 0.75rem; white-space: nowrap; }`
    - `.prefix { color: var(--hint-navy); }`
    - `.window { height: 2.25rem; overflow: hidden; }`
    - `.list { display: flex; flex-direction: column;`
      `align-items: flex-start; }`
    - `.role { line-height: 2.25rem; }`
- src/components/react/onboarding-hint/index.jsx
  - Add `styles.module.css`; import as `Styles`.
  - `.hint { user-select: none; pointer-events: none;`
    `text-transform: lowercase; white-space: nowrap;`
    `font-size: 1.125rem; line-height: calc(1.75 / 1.125);`
    `font-weight: 600; color: var(--hint-navy); }`
  - `@media (min-width: 48rem) { .hint { font-size: 1.25rem;`
    `line-height: calc(1.75 / 1.25); } }`
- src/components/react/scroll-hint/index.jsx
  - Remove the `className` prop from the signature entirely.
  - Change `closest(".snap-start")` to `closest("[data-section]")`.
  - Add `styles.module.css`; import as `Styles`.
  - `.hint { pointer-events: none; position: absolute; left: 0;`
    `right: 0; display: flex; justify-content: center;`
    `bottom: var(--scroll-hint-bottom, 4rem); }`
- src/components/react/call-to-action
  - Rename `styles.module.scss` to `styles.module.css`; update import.
  - Replace `#666` with `var(--grey)` and `#6FA2D7` with
    `var(--link-blue)`.
  - Change `closest(".snap-start")` to `closest("[data-section]")`.
  - Replace the hint wrapper classes with a `.hint` module class:
    - `.hint { pointer-events: none; position: absolute; left: 0;`
      `right: 0; bottom: 2rem; display: flex;`
      `justify-content: center; }`
- src/components/react/companies/styles.module.css
  - New file, imported by `deck.jsx` and `hand.jsx`.
  - `.cardSize { width: min(62vw, 60dvh - 10.5rem);`
    `max-width: 17rem; aspect-ratio: 3 / 4; }`
  - `@media (min-width: 64rem) { .cardSize {`
    `width: min(18vw, 60dvh - 12rem); max-width: 22rem; } }`
- src/components/react/companies/card-face.jsx
  - Add `card-face.module.css`; replace all `className` strings.
  - `.shell { width: 100%; height: 100%;`
    `border: 2px solid currentColor; border-radius: 1rem;`
    `padding: 1.25rem; background: #fff;`
    `box-shadow: 0 20px 25px -5px #0000001a,`
    `0 8px 10px -6px #0000001a; display: flex;`
    `flex-direction: column; justify-content: center;`
    `align-items: center; text-align: center; }`
  - `.face { gap: 0.5rem; }` with `lg` override `gap: 1.25rem`.
  - `.back { position: relative; gap: 0.5rem; }`
  - `.logo { pointer-events: none; padding: 0.5rem;`
    `max-width: 50%; }`
  - `.name { text-transform: lowercase; font-size: 1.25rem;`
    `line-height: calc(1.75 / 1.25); font-weight: 600; }`
    with `md` override `1.5rem` / `calc(2 / 1.5)`.
  - `.role { text-transform: lowercase; font-size: 1rem;`
    `line-height: calc(1.5 / 1); font-weight: 300; }`
    with `md` override `1.25rem` / `calc(1.75 / 1.25)`.
  - `.backName { font-size: 1.125rem;`
    `line-height: calc(1.75 / 1.125); }`
    with `md` override `1.25rem` / `calc(1.75 / 1.25)`.
  - `.blurb { font-size: 0.75rem; line-height: 1.375;`
    `font-weight: 300; }`
    with `md` override `font-size: 0.875rem`.
  - `.corner { pointer-events: none; position: absolute;`
    `width: 1.75rem; height: 1.75rem; object-fit: contain; }`
  - `.topLeft { top: 0.75rem; left: 0.75rem; }`
  - `.bottomRight { bottom: 0.75rem; right: 0.75rem;`
    `transform: rotate(180deg); }`
  - All `md` overrides use `@media (min-width: 48rem)`.
- src/components/react/companies/deck.jsx
  - Import `./styles.module.css`; use `Styles.cardSize` on the `ul`.
  - Add to that file:
    - `.deck { display: grid; grid-template-rows: 1fr;`
      `grid-template-columns: 1fr; }`
    - `.card { grid-row: 1 / 1; grid-column: 1 / 1; }`
    - `.inert { pointer-events: none; }`
    - `.swipe { width: 100%; height: 100%; cursor: grab; }`
    - `.swipe:active { cursor: grabbing; }`
- src/components/react/companies/hand.jsx
  - Import `./styles.module.css`; use `Styles.cardSize` on each `li`.
  - Add to that file:
    - `.hand { position: absolute; left: 50%; top: -4rem;`
      `transform: translateX(-50%); width: 100vw; display: flex;`
      `flex-direction: row; align-items: center; gap: 1rem;`
      `padding: 4rem 2rem 5rem; overflow-x: auto;`
      `scroll-snap-type: x mandatory; }`
    - `@media (min-width: 64rem) { .hand { overflow-x: visible;`
      `justify-content: center; } }`
    - `.slot { position: relative; flex-shrink: 0;`
      `scroll-snap-align: center; }`
    - `.flipper { position: relative; width: 100%; height: 100%;`
      `cursor: pointer; }`
    - `.faceLayer { position: absolute; inset: 0; }`
    - `.hint { pointer-events: none; position: absolute; left: 0;`
      `right: 0; bottom: 100%; margin-bottom: 0.5rem;`
      `display: flex; justify-content: center; }`
- src/components/react/companies/index.jsx
  - Add `index.module.css`; replace all `className` strings.
  - Replace `RESTING_INK` / `PRESSED_INK` class constants with
    `.resting { color: var(--deal-ink); }` and
    `.pressed { color: #fff; }`.
  - `.frame { width: 100vw; height: 100dvh;`
    `padding-top: calc(20dvh + 5.5rem); padding-bottom: 1.5rem;`
    `overflow: visible; display: flex; flex-direction: column;`
    `align-items: center; justify-content: center; }`
  - `.controls { position: relative; z-index: 10;`
    `margin-bottom: 2rem; display: flex; align-items: center;`
    `justify-content: center; }`
  - `.dealButton { display: block; cursor: pointer;`
    `transition: color 150ms; }`
  - `.dealButton:disabled { cursor: default; opacity: 0.5; }`
  - `.dealIcon { display: block; height: 5rem; width: auto; }`
    with `@media (min-width: 64rem) { height: 7rem; }`
  - `.centreHint { pointer-events: none; position: absolute;`
    `inset: 0; display: flex; align-items: center;`
    `justify-content: center; }`
  - `.sideHint { pointer-events: none; position: absolute;`
    `left: 100%; top: 50%; margin-left: 1rem;`
    `transform: translateY(-50%); }`
  - `.stage { position: relative; display: flex;`
    `align-items: center; justify-content: center; }`
  - `.hidden { opacity: 0; pointer-events: none; }`

## Out of scope

- No visual redesign. Every rule reproduces a value read from
  `dist/_astro/main-head.D1OgK1yZ.css`.
- No change to any island's framework, markup structure, or
  animation logic beyond swapping class names.
- No removal of the unused Inter `<link>` in `main-head/index.astro`.
- No CSS nesting, no PostCSS, no design-token generator.
- No change to `eslint.config.ts`, `tsconfig.json`, or CI.
- No new shared stylesheet beyond `global.css` and the per-island
  `.module.css` files listed above.

## Verification steps

- `npm install && npm run build` passes from a clean `dist`.
- `npm run lint` passes.
- `grep -rn "tailwind" src astro.config.mjs package.json` is empty.
- `grep -rn "scss\|sass" src package.json` is empty.
- `grep -rn "snap-start" src` is empty.
- Manual check at desktop and mobile widths, all five sections:
  - Logomark sits over every section in teal, blend difference.
  - Scroll snapping locks to each section on both axes.
  - Scroll hints sit at the same height as before and fade out.
  - Cards match the deck footprint when dealt and gathered.
  - Card swipe works by touch on iOS Safari.
  - Hand scrolls horizontally under 64rem, centres above it.
  - Framework bubbles stay hidden until the contact section,
    then fade in on scrolling back up.
  - No scrollbar or gap appears from mobile viewport height.
- `/404` renders centred with the same grey heading.
