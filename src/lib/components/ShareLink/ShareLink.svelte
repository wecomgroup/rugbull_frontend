<script>
  import InputContainer from "$lib/components/BetController/PrimaryContainer.svelte";
  import Share2Icon from "$lib/icons/Share2Icon.svelte";

  const link = "telegram.me/TGBetOfficialBot?start=513739291";
</script>

<InputContainer>
  <div class="row">
    <span style="word-break: break-all">{link}</span>
    <div style="flex:1"/>
    <button>
      <Share2Icon/>
      Share
    </button>
  </div>
</InputContainer>

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