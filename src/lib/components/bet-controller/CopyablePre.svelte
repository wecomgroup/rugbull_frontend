<script>
  import CopyIcon from "$lib/icons/CopyIcon.svelte";

  export let text;
  export let label = undefined;

  function copyToClipboard() {
    navigator.clipboard.writeText(text);
  }
</script>

{#if label}
  <label>{label}</label>
{/if}
<div class="CopyableCode">
  <pre>{text}</pre>
  <button class="icon" on:click={copyToClipboard}>
    <CopyIcon />
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
  label {
    color: var(--gray)
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
