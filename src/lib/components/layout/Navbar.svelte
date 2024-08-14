<script>
  import WalletMobile from "$lib/components/wallet/WalletMobile.svelte";
  import Avatar from "$lib/components/user/Avatar.svelte";
  import Burger from "$lib/components/layout/Burger.svelte";
  import Menu from "$lib/components/layout/Menu.svelte";
  import { uiStore } from "$lib/stores/_ui";

  let open = false;

  const { showNavbar } = uiStore;
</script>

<div class="navbar" class:hide={!$showNavbar}>
  <Burger on:click={() => (open = !open)} />
  <div style="flex: 1" />
  <WalletMobile walletHref="/magic-cards"/>
  <Avatar href="/"/>
</div>

<Menu bind:open />

<style>
  .navbar {
    background-color: #0a0c14;

    display: flex;
    align-items: center;
    gap: 8px;

    padding: 8px 8px;

    position: sticky;
    top: 0;
    z-index: 10;
  }

  .hide {
    display: none;
  }
</style>
