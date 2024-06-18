<main class="grid">
  <slot name="animation"/>
  <slot name="controller"/>
</main>

<style>
  main {
    display: flex;
    flex-direction: column;
    & > div:nth-child(2) {
      z-index: 2;
    }
  }
</style>