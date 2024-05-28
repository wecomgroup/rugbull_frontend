<script>
  export let href = undefined;
  export let icon = undefined;
  export let label = "Home page";
  export let selected = false;
</script>

<a class="flex gap-2 items-center" {href} data-selected={selected}>
  <div class="icon">
    <svelte:component this={icon}/>
  </div>
  <span>{label}</span>
</a>


<style lang="scss">
  a {
    color: var(--text-gray);
    text-decoration: none;
  }
  .icon {
    width: 1.5rem;
    height: 1.5rem;
    display: grid;
    padding: 2px;
  }

  a[data-selected=true] {
    color: white;

    .icon {
      color: #0994FE;
    }
  }
</style>