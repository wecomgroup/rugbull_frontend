<script lang="js">
  import BetController from "$lib/components/bet-controller/BetController.svelte";
  import HamsterLoader from "$lib/components/loaders/HamsterLoader.svelte";
  import SimpleLoader from "$lib/components/loaders/SimpleLoader.svelte";
  import Modal from "$lib/components/Modal/Modal.svelte";
  import Pagination from "$lib/components/bet-controller/Pagination.svelte";
  import EnergyModule from "$lib/components/bet-controller/EnergyModule.svelte";
  import ContainerV2 from "$lib/components/bet-controller/ContainerV2.svelte";
  import Divider from "$lib/components/layout/Divider.svelte";
  import Logo from "$lib/components/brand/Logo.svelte";
  import LogoSquare from "$lib/components/brand/LogoSquare.svelte";
  import Comet from "$lib/games/Rugbull2/components/Comet.svelte";
  import Navbar from "$lib/components/layout/Navbar.svelte";

  let open = false;
</script>

<Navbar/>
<main>
  <div class="row">
    <Logo/>  <LogoSquare/>
  </div>

  <Divider/>

  <ContainerV2 style="width: 300px; height: 100px; overflow: hidden; display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px">
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

  <button on:click={() => open = true}>Open Modal</button>

  <Modal bind:open>
    <div slot="title">Title</div>
    <div slot="body">
      Test
    </div>
  </Modal>

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
  main{
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