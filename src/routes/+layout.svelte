<script>
  import "$lib/styles/global.scss";
  import { page } from "$app/stores";
  import { goto } from "$app/navigation";
  import { browser } from "$app/environment";
  import Shortcuts from "$lib/components/layout/Shortcuts.svelte";
  import { QueryClient, QueryClientProvider } from "@tanstack/svelte-query";
  import SocketProvider from "$lib/components/layout/SocketProvider.svelte";

  const queryClient = new QueryClient();

  /// Handle query to localStorage here
  $: {
    if ($page.url.searchParams.get("token") && browser) {
      localStorage.setItem("token", $page.url.searchParams.get("token"));

      // remove token from url
      goto($page.url.pathname);
    }
  }
</script>

<svelte:head>
  <title>Rugbull</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="true" />
  <link
    href="https://fonts.googleapis.com/css2?family=Rubik:ital,wght@0,300..900;1,300..900&display=swap"
    rel="stylesheet"
  />
</svelte:head>

<SocketProvider>
  <QueryClientProvider client={queryClient}>
    <div data-theme="dark">
      <slot />
    </div>
  </QueryClientProvider>
</SocketProvider>

<Shortcuts />
