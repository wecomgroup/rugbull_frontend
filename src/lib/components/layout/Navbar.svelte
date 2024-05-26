<script>
  import WalletMobile from "$lib/components/wallet/WalletMobile.svelte";
  import Avatar from "$lib/components/user/Avatar.svelte";
  import Burger from "$lib/components/layout/Burger.svelte";
</script>


<div id="navbar">
  <Burger/>
  <div style="flex: 1"/>
  <WalletMobile/>
  <Avatar/>
</div>

<style>
  #navbar {
    display: flex;
    align-items: center;
    gap: 8px;

    padding: 8px 8px;
  }
</style>