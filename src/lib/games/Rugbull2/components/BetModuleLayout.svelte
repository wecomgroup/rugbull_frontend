<div class="BetModuleLayout grid gap-1">
  <div class="left" style="grid-area: a">
    <slot name="left"/>
  </div>
  <div class="right" style="grid-area: b">
    <slot name="right"/>
  </div>
  <div class="bottom" style="grid-area: c">
    <slot name="bottom"/>
  </div>
  <div style="grid-area: d">
    <slot name="button"/>
  </div>
</div>

<style lang="scss">
  .BetModuleLayout {
    border-radius: 1rem;
    overflow: hidden;

    & > * {
      background-color: var(--background-2);
      display: grid;
    }
  }
  .BetModuleLayout {
    grid-template-areas:
    "a b"
    "c c"
    "d d";
    grid-template-columns: 1fr 1fr;
    grid-template-rows: repeat(3, minmax(30px, 1fr));
  }


</style>

