<script setup>
// The cup arrives as props, not slots: an unhydrated slot is wrapped in an
// inline <astro-static-slot> which breaks the flex layout.
defineProps({
  src: String,
  srcSet: String,
});
</script>

<template>
  <div class="relative w-full h-full flex items-center justify-center">
    <div
      class="ease-all glow float pointer-events-none flex items-center justify-center"
    >
      <a href="https://docs.cute.engineer">
        <img
          class="ease-all max-w-sm w-[60vw] hover:max-w-md hover:w-[70vw] pointer-events-auto"
          alt="Coffee cup notebook"
          :src="src"
          :srcset="srcSet"
        />
      </a>
    </div>
    <div class="absolute inset-x-0 bottom-[8dvh] text-[#733e19] text-center">
      <p class="text-[35px]">otherwise i would forget everything 👆</p>
      <a class="text-[20px] underline" href="https://pages.cute.engineer">
        opinions go in here
      </a>
    </div>
  </div>
</template>

<style scoped>
@keyframes float {
  0% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(-5%);
  }

  100% {
    transform: translateY(0);
  }
}

.float {
  animation: 3s ease-in-out 0s float;
  animation-iteration-count: infinite;
}

.ease-all {
  transition: all 0.5s ease-in-out;
}

.glow {
  background: radial-gradient(
    circle at center, 
    rgba(254, 243, 199, 1) 0%, 
    rgba(102, 119, 97, 0) 40%
  );

  width: 80vw;
  aspect-ratio: 1 / 1;
}

.glow:hover {
  width: 100vw;
  height: 100vh;
}
</style>
