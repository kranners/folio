<!-- 
    Exercise in using Svelte with Tailwind for a header icon.
    Will be my initials in a square container with a circle border around them.

    Clicking on the logomark should display a little ping effect, courtesy of Tailwind.
-->

<!-- Flex container -->
<div
  class="z-10 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 mix-blend-difference"
>
  <p
    class="mr-2 text-6xl text-center text-white font-black select-none"
  >
    <!-- Logo content -->
    ajrp
  </p>
</div>
