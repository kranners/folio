# folio

This is my personal portfolio website, written using Astro and deployed to https://cute.engineer.

The site is simple by design, outside of some interactivity and motion graphics.

## Current work

The original premise of this portfolio website was that it would use Astro islands with every integration to create a poly-framework single page site.

That is, different parts of the site would be written in Svelte, React, Preact, and Vue.

Since then the original premise has drifted more towards fancy motion graphics, which is fun but not exactly the original idea.

The way that this poly-framework-ness was called out before was through these callout bubbles that I drew, which contained each framework's logo.

The problem with this method of calling out in my mind is that it distracted from the actual page content towards this gimmick, and detracted from the otherwise simple and minimalist design, and directed attention towards something that most site viewers probably don't really care about.

Recently I've introduced onboarding text to make it more clear how to interact with the site, which makes me think to reintroduce this poly-framework idea.

The idea would be this:
1. You scroll through the entire site to the bottom
2. Some onboarding text appears and tells you to scroll back up
3. When you scroll back up, the framework bubbles appear on each frame's corner to say which framework the thing was built in

This way it might be a bit of a cinematic surprise to a viewer that the page they just looked at was actually written using 4 different frameworks.

### Module-level scope

- Fix the JSX renderer include globs in `astro.config.mjs`
  - `**/react/*` and `**/preact/*` currently match zero files
    - `*` does not cross `/`, components sit two levels deep
  - Change both to `**/react/**` and `**/preact/**`
- Restore the missing Vue bubble asset
  - `git show 52e0802^:src/components/LanguageHeader/logos/vue.svg`
  - Write to `src/components/astro/framework-bubble/assets/vue.svg`
  - Add a `vue` entry to `FRAMEWORKS`
- Make the bubble visible on every viewport
  - Drop `hidden md:flex` from the bubble wrapper
  - Shrink the bubble width below `md` so it clears frame content
  - Keep the bottom-left anchor, the drawn tail points left
- Own the latch and the hint from CallToAction `src/components/react/call-to-action/index.jsx`
  - `IntersectionObserver` on `ref.current.closest(".snap-start")`, threshold `0.9`
  - Sets `document.documentElement.dataset.frameworksRevealed`, then disconnects
  - One observer drives both the latch and the hint
  - Reuse `OnboardingHint` directly, as `Companies` already does
  - Latches after the first show so it never nags twice
  - Accepts a page-level latch owned by a leaf island
    - It moves with CallToAction if that frame is ever converted
- Reveal the bubbles with CSS only in `src/styles/global.css`
  - Add a `framework-bubble` class to the bubble wrapper
  - `.framework-bubble` defaults to `opacity: 0` with a `600ms` transition
  - `html[data-frameworks-revealed] .framework-bubble` sets `opacity: 1`
- Wire the sections in `index.astro`
  - Pass `framework` to every `Section`
  - Signature is Svelte, Roles is Preact, Companies is React
  - Frappuccino is Vue, CallToAction is React
  - Two React bubbles is accepted, CallToAction is not being converted
- Convert Signature to Svelte
  - New `src/components/svelte/signature/`, holding the wrapper, SFC and assets
  - Thin `index.astro` wrapper calls `getImage()` on both PNGs
  - Pass `src` and `srcSet` as props, never slots
    - Unhydrated slots wrap in inline `astro-static-slot` and break the flex layout
  - Delete `src/components/astro/signature/`
- Convert Frappuccino to Vue
  - New `src/components/vue/frappuccino-link/`, same wrapper and asset layout
  - Port the existing `<style>` keyframes into the SFC verbatim
  - Wrapper calls `getImage()` on `cup.png`, passes `src` and `srcSet`
  - Delete `src/components/astro/frappuccino-link/`
- Convert Roles to Preact
  - New `src/components/preact/roles/index.jsx`
  - Drop `motion`
      - Replace with `element.animate()` inside a `useEffect`
        - `Y_OFFSET_KEYFRAMES` becomes `transform` keyframes
        - `TIMES` becomes `offset`
        - `backOut` becomes `cubic-bezier(0.34, 1.56, 0.64, 1)`
  - Mount with `client:only="preact"`
  - Delete `src/components/react/roles/`

### Checks to verify

- `npm run lint` and `npm run build` both clean
- No "More than one JSX renderer" warning in build output
- Signature and Frappuccino ship no client JS, check `dist/_astro`
- Scroll to the bottom, hint appears, scroll up, bubbles fade in
- Reload mid-reveal, bubbles are hidden again
- Check bubble placement against content at phone width
- iPhone SE viewports are rendered with and without bubbles sensibly
- Bubbles do not shift existing content

### Out of scope

- Dependency bumps, patch-level plus TypeScript 6 to 7
