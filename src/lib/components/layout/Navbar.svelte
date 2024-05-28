<script>
  import WalletMobile from "$lib/components/wallet/WalletMobile.svelte";
  import Avatar from "$lib/components/user/Avatar.svelte";
  import Burger from "$lib/components/layout/Burger.svelte";
  import Menu from "$lib/components/layout/Menu.svelte";

  let open = false;
</script>


<div id="navbar">
  <Burger on:click={() => open = !open}/>
  <div style="flex: 1"/>
  <WalletMobile/>
  <Avatar/>
</div>

<Menu bind:open/>

<style>
  #navbar {
    background-color: #0A0C14;

    display: flex;
    align-items: center;
    gap: 8px;

    padding: 8px 8px;

  }
</style>