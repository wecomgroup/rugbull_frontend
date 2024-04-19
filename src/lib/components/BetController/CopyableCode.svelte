<script>
  import CopyIcon from "$lib/icons/CopyIcon.svelte";

  export let text;

  function copyToClipboard() {
    navigator.clipboard.writeText(text);
  }
</script>

<div class="CopyableCode">

  <code>
    {text}
  </code>
  <button class="icon" on:click={copyToClipboard}>
    <CopyIcon/>
  </button>
</div>

<style>
  .CopyableCode {
    display: grid;
    grid-template-columns: 1fr auto;
    padding: 8px 8px 8px 8px;
    background: var(--brand);
    color: black;

    align-items: center;
  }
  code {
    word-break: break-all;
    font-size: 16px;
  }

  .icon {

    padding: 4px;
  }
</style>