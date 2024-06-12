<script>
  export let style = undefined;
</script>

<div class="grid number-text" {style}>
  <p class="shadow-text">
    <slot/>
  </p>
  <h1 class="front-text">
    <slot/>
  </h1>
</div>

<style>
  h1, p {
    font-size: 3rem;
    font-weight: 700;
    /* text-shadow: 0 0.35rem 0 #4A5158; */

    background: -webkit-linear-gradient(#fff, #AAD5FF);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
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
