<script>
  import CopyIcon from "$lib/icons/CopyIcon.svelte";
  import FieldLayout from "$lib/components/layout/FieldLayout.svelte";

  export let id;
  export let text;
  export let label

  function copyToClipboard() {
    navigator.clipboard.writeText(text);
  }
</script>

<FieldLayout {id} {label}>
  <div class="CopyableCode">
  <pre>
    {text}
  </pre>
    <button class="icon" on:click={copyToClipboard}>
      <CopyIcon/>
    </button>
  </div>
</FieldLayout>

<style>
  .CopyableCode {
    display: grid;
    grid-template-columns: 1fr auto;
    gap: 0.5rem;

    padding: 0.5rem 0.75rem;
    background: var(--background-2);
    border-radius: 1rem;

    align-items: center;
  }

  pre {
    white-space: pre-line;
    word-break: break-all;
    font-size: 16px;
    font-weight: 400;
    font-family: "Rubik", monospace;

    text-align: left;
  }

  .icon {
    color: var(--gray);
    padding: 4px;
  }

</style>