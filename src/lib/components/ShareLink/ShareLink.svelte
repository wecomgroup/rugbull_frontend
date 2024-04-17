<script>
  import Share2Icon from "$lib/icons/Share2Icon.svelte";
  import ContainerV2 from "$lib/components/BetController/ContainerV2.svelte";

  const link = "telegram.me/TGBetOfficialBot?start=513739291";
</script>

<ContainerV2>
  <div class="row">
    <span style="word-break: break-all">{link}</span>
    <div style="flex:1"/>
    <button>
      <Share2Icon/>
      Share
    </button>
  </div>
</ContainerV2>

<style lang="scss">
  .row {
    display: flex;
    align-items: center;
    width: 100%;
    padding: 0 8px;

    color: var(--brand);

    span {
      text-decoration: underline;
    }

    button {
      display: flex;
      align-items: center;
      gap: 8px;
    }
  }
</style>