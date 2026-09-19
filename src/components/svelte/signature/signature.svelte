<script>
  // Images arrive as props, not slots: an unhydrated slot is wrapped in an
  // inline <astro-static-slot> which breaks the flex layout.
  let { guySrc, guySrcSet, mysterySrc, mysterySrcSet } = $props();
</script>

<div class="signature">
  <img class="guy" alt="its me" src={guySrc} srcset={guySrcSet} />
  <img
    class="mystery"
    alt="its a mystery!!"
    src={mysterySrc}
    srcset={mysterySrcSet}
  />
</div>

<style>
  .signature {
    width: 100vw;
    height: 100dvh;

    display: flex;
    flex-direction: column;
    justify-content: space-between;
    position: relative;
  }

  .guy {
    padding-top: 35vh;
    max-width: 40vw;
    margin-right: 50vw;
    align-self: flex-end;
  }

  .mystery {
    position: absolute;
    bottom: 0;
    max-width: 30vw;
    align-self: center;
  }
</style>
