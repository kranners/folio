<script setup>
// The cup arrives as props, not slots: an unhydrated slot is wrapped in an
// inline <astro-static-slot> which breaks the flex layout.
defineProps({
  src: String,
  srcSet: String,
});
</script>

<template>
  <div class="container">
    <div class="ease-all glow float">
      <a href="https://docs.cute.engineer">
        <img
          class="ease-all cup"
          alt="Coffee cup notebook"
          :src="src"
          :srcset="srcSet"
        />
      </a>
    </div>
    <div class="caption">
      <p>otherwise i would forget everything 👆</p>
      <a href="https://pages.cute.engineer"> opinions go in here </a>
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

.container {
  position: relative;
  width: 100%;
  height: 100%;

  display: flex;
  align-items: center;
  justify-content: center;
}

.glow {
  background: radial-gradient(
    circle at center, 
    rgba(254, 243, 199, 1) 0%, 
    rgba(102, 119, 97, 0) 40%
  );

  width: 80vw;
  aspect-ratio: 1 / 1;

  pointer-events: none;

  display: flex;
  align-items: center;
  justify-content: center;
}

.glow:hover {
  width: 100vw;
  height: 100vh;
}

.cup {
  max-width: 24rem;
  width: 60vw;
  pointer-events: auto;
}

.cup:hover {
  max-width: 28rem;
  width: 70vw;
}

.caption {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 8dvh;

  text-align: center;
  color: var(--frappuccino);
}

.caption p {
  font-size: 35px;
}

.caption a {
  font-size: 20px;
  text-decoration: underline;
}
</style>
