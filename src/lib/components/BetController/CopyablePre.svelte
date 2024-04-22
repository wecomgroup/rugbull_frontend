<script>
  import CopyIcon from "$lib/icons/CopyIcon.svelte";

  export let text;

  function copyToClipboard() {
    navigator.clipboard.writeText(text);
  }
</script>

<div class="CopyableCode">
  <pre>{text}</pre>
  <button class="icon" on:click={copyToClipboard}>
    <CopyIcon/>
  </button>
</div>

<style>
  .CopyableCode {
    display: grid;
    grid-template-columns: 1fr auto;

    padding: 8px;
    background: #333;
    color: white;
    border-radius: 6px;

    align-items: center;
  }

  pre {
    font-size: 16px;
    white-space: pre-wrap;
    word-break: break-all;
  }

  .icon {

    padding: 4px;
  }
</style>