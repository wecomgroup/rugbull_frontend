<script>
  export let color = undefined;  // yellow red
</script>

<div class="grid number-text">
  <p class="shadow-text">
    <slot/>
  </p>
  <h2 class="front-text">
    <slot/>
  </h2>
</div>

<style>
  h2, p {
    font-size: 2rem;
    font-weight: 700;
    /* text-shadow: 0 0.35rem 0 #4A5158; */

    background: -webkit-linear-gradient(#fff, #AAD5FF);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    text-align: center;
  }

  .shadow-text {
    text-shadow: 0 0.35rem 0 #3B5F7C;
  }

  .number-text {
    display: grid;

    & > * {
      grid-row: 1;
      grid-column: 1;
    }
  }
</style>
