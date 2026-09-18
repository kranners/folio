<script>
  // Images arrive as props, not slots: an unhydrated slot is wrapped in an
  // inline <astro-static-slot> which breaks the flex layout.
  let { guySrc, guySrcSet, mysterySrc, mysterySrcSet } = $props();
</script>

<div class="w-screen h-dvh flex flex-col justify-between relative">
  <img
    class="pt-[35vh] max-w-[40vw] mr-[50vw] self-end"
    alt="its me"
    src={guySrc}
    srcset={guySrcSet}
  />
  <img
    class="absolute bottom-0 max-w-[30vw] self-center"
    alt="its a mystery!!"
    src={mysterySrc}
    srcset={mysterySrcSet}
  />
</div>
