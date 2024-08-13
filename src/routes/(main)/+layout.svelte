<script>
  import Navbar from "$lib/components/layout/Navbar.svelte";
  import SocketProvider from "$lib/components/layout/SocketProvider.svelte";
  import { QueryClient, QueryClientProvider } from "@tanstack/svelte-query";

  const queryClient = new QueryClient();
</script>

<Navbar />

<SocketProvider>
  <QueryClientProvider client={queryClient}>
    <div data-theme="dark">
      <slot />
    </div>
  </QueryClientProvider>
</SocketProvider>
