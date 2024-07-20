<script lang="ts">
import Wave from "./Wave.vue";

export default {
  components: {
    Wave,
  },
};
</script>

<template>
  <div class="container">
    <Wave />
    <Wave />
    <Wave />
    <Wave />
    <Wave />
    <Wave />
  </div>
</template>

<style scoped>
.container {
  width: 100vw;
  max-width: 100vw;
  height: 60vh;
  /* position: absolute; */
  bottom: 0;
}
</style>
