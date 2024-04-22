<script>
  import {onMount} from "svelte";
  import {goto} from "$app/navigation";

  onMount(() => {
    localStorage.removeItem('token')
    goto('/login')
  })
</script>