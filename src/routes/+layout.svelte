<script>
  import './global.scss'
  import Command from "$lib/components/CommandMenu/CommandMenu.svelte";
  import {page} from '$app/stores'
  import {goto} from "$app/navigation";
  import {browser} from "$app/environment";

  const menus = [
    {label: "Rugbull", href: "/games/rugbull"},
    {label: "Rugbull (Debug)", href: "/games/rugbull/debug"},
    {label: "Components", href: "/components"},
    {label: "Fairness", href: "/games/rugbull/fairness"},
  ]

  /// Handle query to localStorage here
  $:{
    if($page.url.searchParams.get('token') && browser){
      localStorage.setItem('token', $page.url.searchParams.get('token'))

      // remove token from url
      goto($page.url.pathname)
    }
  }
</script>
<svelte:head>
  <title>Rugbull</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="true">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet">
</svelte:head>

<div data-theme="dark">
  <slot/>
</div>

<Command menus={ menus }/>