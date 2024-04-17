<script>
  import './global.scss'
  import Command from "$lib/components/CommandMenu/CommandMenu.svelte";

  const menus = [
    {label: "Rugbull", href: "/games/rugbull"},
    {label: "Rugbull (Debug)", href: "/games/rugbull/debug"},
    {label: "Components", href: "/components"},
  ]

</script>
<svelte:head>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400&display=swap" rel="stylesheet">
</svelte:head>

<div data-theme="dark">
  <slot/>
</div>

<Command menus={ menus }/>