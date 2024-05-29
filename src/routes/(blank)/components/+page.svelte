<script lang="js">
  import BetController from "$lib/components/bet-controller/BetController.svelte";
  import HamsterLoader from "$lib/components/loaders/HamsterLoader.svelte";
  import SimpleLoader from "$lib/components/loaders/SimpleLoader.svelte";
  import Modal from "$lib/components/modals/Modal.svelte";
  import Pagination from "$lib/components/bet-controller/Pagination.svelte";
  import EnergyModule from "$lib/components/bet-controller/EnergyModule.svelte";
  import ContainerV2 from "$lib/components/bet-controller/ContainerV2.svelte";
  import Divider from "$lib/components/layout/Divider.svelte";
  import Logo from "$lib/components/brand/Logo.svelte";
  import LogoSquare from "$lib/components/brand/LogoSquare.svelte";
  import Comet from "$lib/games/Rugbull2/components/Comet.svelte";
  import Navbar from "$lib/components/layout/Navbar.svelte";
  import ResultsRow from "$lib/games/Rugbull2/components/ResultsRow.svelte";
  import {spring} from "svelte/motion";
  import {onMount} from "svelte";
  import IconToggleButton from "$lib/components/buttons/IconToggleButton.svelte";
  import SoundOffIcon from "$lib/icons/SoundOffIcon.svelte";
  import ShieldIcon from "$lib/icons/ShieldIcon.svelte";
  import SoundOnIcon from "$lib/icons/SoundOnIcon.svelte";
  import BottomModal from "$lib/components/modals/BottomModal.svelte";
  import IconButton from "$lib/components/buttons/IconButton.svelte";
  import CloseIcon from "$lib/icons/CloseIcon.svelte";
  import CloseIcon2 from "$lib/icons/CloseIcon2.svelte";
  import CardsIcon from "$lib/icons/CardsIcon.svelte";
  import MenuItem from "$lib/components/layout/MenuItem.svelte";
  import GameIcon from "$lib/icons/GameIcon.svelte";
  import PeopleIcon from "$lib/icons/PeopleIcon.svelte";

  let open = false;
  let openBottom = false;

  const time = spring(0);

  onMount(() => {
    time.set(1)
  });
</script>

<Navbar/>
<main>
  <div class="row">
    <Logo/>
    <LogoSquare/>
  </div>


  <Divider/>

  <ContainerV2 class="flex gap-2">
    <IconButton icon={CloseIcon2}/>
    <IconToggleButton iconTrue={ShieldIcon} iconFalse={ShieldIcon}/>
    <IconToggleButton iconTrue={SoundOnIcon} iconFalse={SoundOffIcon}/>

  </ContainerV2>
  <ContainerV2 class="flex gap-2">
    <ResultsRow/>
  </ContainerV2>

  <ContainerV2>
    <MenuItem selected={true} icon={GameIcon} label="Game"/>
    <MenuItem icon={PeopleIcon} label="Referral System"/>
    <MenuItem icon={CardsIcon} label="Magic Cards"/>
  </ContainerV2>

  <Divider/>

  <button on:click={() => open = true}>Open Modal</button>
  <button on:click={() => openBottom = true}>Open Bottom Modal</button>

  <Divider/>


  <ContainerV2
      style="width: 300px; height: 100px; overflow: hidden; display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px">
    <Comet style="transform: translate({Math.random() * 100}%, {Math.random() * 80 + 20}px)"/>
    <Comet style="transform: translate({Math.random() * 100}%, {Math.random() * 80 + 20}px)"/>
    <Comet style="transform: translate({Math.random() * 100}%, {Math.random() * 80 + 20}px)"/>
  </ContainerV2>

  <Divider/>
  <BetController/>

  <Divider/>
  <HamsterLoader/>
  <SimpleLoader/>

  <Divider/>


  <Modal bind:open>
    <div slot="title">Title</div>
    <div slot="body">
      Test
    </div>
  </Modal>

  <BottomModal bind:open={openBottom}
               showCloseIcon={true}
  >
    <div slot="body">
      <h2>Internet</h2>
      <div>Life, Liberty, and the pursuit of Happiness</div>
    </div>
  </BottomModal>

  <br/>
  <ContainerV2 style="display: grid; justify-items: center">
    <Pagination/>
  </ContainerV2>

  <div class="col-2 full-w">
    <EnergyModule glow="1"/>
    <EnergyModule/>
  </div>

</main>

<style>
  main {
    margin: 0 auto;
    padding: 20px 0;

    display: grid;
    gap: 8px;
    grid-template-columns: 1fr;
    justify-items: center;
  }

  .row {
    display: flex;
    gap: 8px;
  }

  .col-2 {
    display: grid;
    gap: 8px;
    grid-template-columns: 1fr 1fr;
  }

  .full-w {
    width: 100%;
  }

  button {
    border-radius: 4px;
    width: fit-content;
    padding: 8px 16px;
    background: #333;
    color: white;
    border: none;
    cursor: pointer;
  }

  @media (min-width: 375px) {
    main {
      padding: 20px;
    }
  }
</style>