<script>
  import {onMount} from "svelte";
  import {goto} from "$app/navigation";

  onMount(() => {
    function handleKey(/**@type {KeyboardEvent}*/e) {
      if (e.ctrlKey && e.key === 'd') {
        goto('/debug');
      }
    }

    window.addEventListener('keydown', handleKey);
    return () => {
      window.removeEventListener('keydown', handleKey);
    }
  });
</script>