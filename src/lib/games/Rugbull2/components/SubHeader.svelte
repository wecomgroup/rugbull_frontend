<script>
  export let label = "Next game";
  export let number = "10:00";
</script>

<div class="grid justify-items-center">
  <h3>{label}</h3>
  <div class="grid number-text">
    <p class="shadow-text">{number}</p>
    <p class="front-text">{number}</p>
  </div>
</div>

<style>
  h3 {
    color: #a8aaca;
    font-size: 1rem;
    font-weight: 400;
  }

  p {
    font-size: 3rem;
    font-weight: 900;
    /* text-shadow: 0 0.35rem 0 #4A5158; */

    background: -webkit-linear-gradient(#fff, #b8c9da);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .shadow-text {
    text-shadow: 0 0.35rem 0 #4a5158;
  }

  .number-text {
    display: grid;
    & > * {
      grid-row: 1;
      grid-column: 1;
    }
  }
</style>
