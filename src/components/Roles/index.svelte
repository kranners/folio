<div class="roles-container">
  <div class="scrolling-words-container">
    <span class="im-a" style="color: #011c53">i'm a</span>
    <div class="scrolling-words-box">
      <ul class="flex flex-col items-center">
        <li class="role" style="color: #666666">Software Developer</li>
        <li class="role" style="color: #4285f4">Computer Scientist</li>
        <li class="role" style="color: #ea4335">Part-time Ninja</li>
        <li class="role" style="color: #debff4">Vim Evangelist</li>
        <li class="role" style="color: #34a853">Nix Obsessive</li>
        <li class="role" style="color: #fbbc04">Full-stack Wizard</li>
        <li class="role" style="color: #c7828b">Caffeine Enthusiast</li>
        <li class="role" style="color: #84a4f9">TypeScript Gymnast</li>
        <li class="role" style="color: #fcbeb1">Slack Fiend</li>
        <li class="role" style="color: #d480aa">Rampant Automator</li>
        <li class="role" style="color: #e69cff">Prolific Emoji User</li>
        <li class="role" style="color: #666666">Software Developer</li>
      </ul>
    </div>
  </div>
</div>

<style lang="scss">
  @use 'sass:math';

  .roles-container {
    padding-top: 15vh;
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .scrolling-words-container {
    display: flex;
    align-items: center;

    font-size: 40px;
  }

  .role {
    white-space: nowrap;
    overflow: hidden;

    font-weight: 800;
  }

  @media screen and (max-width: 700px) {
    .scrolling-words-container {
      flex-direction: column;
    }

    .im-a {
      font-size: 40px;
    }
  }

  @media screen and (max-width: 700px) {
    .scrolling-words-container {
      font-size: 8vw;
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
