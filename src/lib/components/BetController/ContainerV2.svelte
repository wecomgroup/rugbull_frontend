<script>
  export let style = undefined;
  export let glow = undefined
</script>
<div class="container-v2" data-glow={glow || undefined} style={style}>
  <slot/>
</div>

<style lang="scss">
  .container-v2 {
    border-radius: 6px;
    border: 1px solid #6f767e;
    background: #f2f2f2;
    box-shadow: 0 4.417391777038574px 4.417391777038574px 0 rgba(0, 0, 0, 0.25);

    padding: 6px;

    @media (min-width: 375px) {
      padding: 8px;
    }
    @media (min-width: 1440px) {
      padding: 12px;
    }
  }

  :global([data-theme='dark']) {
    .container-v2 {
      border-color: #364358;
      background: #1b1b23;
      color: #d4d4d4;
    }
  }

  .container-v2[data-glow]{
    border-color: var(--brand);
    box-shadow: inset 0 0 10px var(--brand);
  }
</style>