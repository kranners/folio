<!-- 
    Exercise in Vue for a randomized single gentle wave effect.
    The wave should slowly scroll
-->

<script lang="ts">
const boundedRandom = (min: number, max: number) =>
  Math.random() * (max - min + 1) + min;

export default {
  data: function () {
    return {
      opacity: 0.3,
      duration: boundedRandom(7, 30),
      delay: boundedRandom(0, 7),
      offset: boundedRandom(0, 10),
      red: boundedRandom(125, 255),
      green: boundedRandom(125, 255),
      direction: Math.random() > 0.5 ? "normal" : "reverse",
    };
  },
};
</script>

<template>
  <div>
    <br />

    <svg
      class="waves"
      xmlns="http://www.w3.org/2000/svg"
      xmlns:xlink="http://www.w3.org/1999/xlink"
      viewBox="0 24 150 28"
      preserveAspectRatio="none"
      shape-rendering="auto"
    >
      <defs>
        <linearGradient id="fadeGrad" y2="1" x2="0">
          <stop offset="0.5" stop-color="white" stop-opacity="0" />
          <stop offset="1" stop-color="white" stop-opacity=".5" />
        </linearGradient>

        <mask id="fade" maskContentUnits="objectBoundingBox">
          <rect width="1" height="1" fill="url(#fadeGrad)" />
        </mask>
        k
        <path
          mask="url($fade)"
          id="gentle-wave"
          d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z"
        />
      </defs>
      <g class="parallax">
        <!-- Somewhat evil use of inline styles to allocate random duration and delay per wave -->
        <use
          xlink:href="#gentle-wave"
          x="48"
          :y="`${offset}`"
          :fill="`rgba(${red},${green},255,${opacity})`"
          :style="`animation: move-forever ${duration}s cubic-bezier(.55, .5, .45, .5) -${delay}s infinite ${direction}`"
        />

        <use
          xlink:href="#gentle-wave"
          transform="scale(-1, 1)"
          x="48"
          :y="`${offset}`"
          :fill="`rgba(${red},${green},255,${opacity})`"
          :style="`animation: move-forever ${duration}s cubic-bezier(.55, .5, .45, .5) -${delay}s infinite ${direction}`"
        />
      </g>
    </svg>
  </div>
</template>

<style>
@keyframes move-forever {
  0% {
    transform: translate3d(-90px, 0, 0);
  }

  100% {
    transform: translate3d(85px, 0, 0);
  }
}
</style>

<style scoped>
/* Ensure the entire wave container stretches across the whole screen to fill the effect */
.waves {
  /* Ensure each wave stacks on top of eachother for the effect to work */
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100vw;
  height: 80vh;
  max-height: 100vh;
}
</style>
