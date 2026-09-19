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
