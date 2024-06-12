<script>
export let variant = "blue" ; // red gray
</script>

<div class="Card glow" data-variant={variant}>
  <slot/>
</div>

<style>

  .Card {
    max-width: 300px;
    border-radius: 1rem;


  }

  .Card[data-variant=blue] {
    --bg: rgb(12, 23, 62, 0.5);
    --bg2: rgb(32, 61, 164, 1.0);
    --border: #0A94FE;
    --shadow: -2px 6px 4px rgba(0, 0, 0, 0.25);
  }
  .Card[data-variant=red] {
    --bg: rgb(76, 11, 35,0.5);
    --bg2: rgb(178, 27, 81);
    --border: #E6376E;
    --shadow: -2px 6px 4px rgba(0, 0, 0, 0.25);
  }
  .Card[data-variant=gray] {
    --bg: rgb(42, 56, 104, 0.5);
    --bg2: rgb(5, 72, 121);
    --border: #9ABEE5;
    --shadow: -2px 6px 4px rgba(0, 0, 0, 0.25);
  }

  .glow {
    background: linear-gradient(180deg, var(--bg) 0, var(--bg2) 100%);
    border: 2px solid var(--border);
    box-shadow: inset 0 0 1rem var(--bg2), var(--shadow);
  }

</style>