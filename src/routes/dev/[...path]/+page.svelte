<script>
  import DevFrame from "$lib/components/layout/DevFrame.svelte";

  import {page} from "$app/stores";

  $: url = $page.url.pathname === '/dev/home' ? '/' : $page.url.pathname.replace('/dev', '')

</script>


<DevFrame src={url}/>
