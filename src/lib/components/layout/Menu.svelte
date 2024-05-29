<script>
  import BottomModal from "$lib/components/modals/BottomModal.svelte";
  import Logo from "$lib/components/brand/Logo.svelte";
  import GameIcon from "$lib/icons/GameIcon.svelte";
  import PeopleIcon from "$lib/icons/PeopleIcon.svelte";
  import CardsIcon from "$lib/icons/CardsIcon.svelte";
  import MenuItem from "$lib/components/layout/MenuItem.svelte";

  export let open = false;

  const MENUS = [
    {icon: GameIcon, label: "Game", href: "/",},
    {icon: PeopleIcon, label: "Referral System", href: "/referral" },
    {icon: CardsIcon, label: "Magic Cards", href: "/magic-cards"},
  ]
</script>

<BottomModal bind:open
             showCloseIcon={true}>
  <div slot="body" class="grid justify-items-start gap-4">
    <Logo/>

    <h2 class="mb-2">Menu</h2>

    <div class="grid gap-4 pl-2">
      {#each MENUS as {icon, label, href}}
        <MenuItem {icon} {label} {href}/>
      {/each}
    </div>
  </div>
</BottomModal>