<div class="roles-container">
  <div class="scrolling-words-container">
    <span style="color: #5f6368">i'm a</span>
    <div class="scrolling-words-box">
      <ul>
        <li style="color: #666666">Software Developer</li>
        <li style="color: #4285f4">Computer Scientist</li>
        <li style="color: #ea4335">Super Ninja</li>
        <li style="color: #debff4">Vim Evangelist</li>
        <li style="color: #34a853">DevOps Engineer</li>
        <li style="color: #fbbc04">Full-stack Wizard</li>
        <li style="color: #c7828b">Caffeine Enthusiast</li>
        <li style="color: #84a4f9">Cloud Specialist</li>
        <li style="color: #fcbeb1">Product Owner</li>
        <li style="color: #d480aa">Rampant Automator</li>
        <li style="color: #e69cff">Prolific Emoji User</li>
        <li style="color: #666666">Software Developer</li>
      </ul>
    </div>
  </div>
</div>

<style lang="scss">
  @use 'sass:math';

  .roles-container {
    height: 50vh;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .scrolling-words-container {
    display: flex;
    align-items: center;
    font-size: 6vw;
    font-weight: 600;
  }

  @media screen and (min-width: 700px) {
    .scrolling-words-container {
      font-size: 40px;
    }
  }

  .scrolling-words-box {
    height: 3rem;
    margin: auto;
    overflow: hidden;

    ul {
      margin: 0 0.625rem;
      padding: 0;
      animation: scrollUp 14s infinite;
      li {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        height: 3rem;
        list-style: none;
      }
    }
  }

  // Variables
  $item-count: 12;

  @keyframes scrollUp {
    @for $i from 0 through ($item-count - 1) {
      // Note order of operations here!
      #{math.div($i, $item-count) * 100%},
      #{math.div(($i + 1), $item-count) * 100%} {
        transform: translateY(math.div(-100%, $item-count) *$i);
      }
    }
  }
</style>