<script lang="js">
  import BetController from "$lib/components/BetController/BetController.svelte";
  import HamsterLoader from "$lib/components/loaders/HamsterLoader.svelte";
  import SimpleLoader from "$lib/components/loaders/SimpleLoader.svelte";
  import Modal from "$lib/components/Modal/Modal.svelte";
  import BetButton from "$lib/components/BetController/BetButton.svelte";
  import Pagination from "$lib/components/BetController/Pagination.svelte";
  import EnergyModule from "$lib/components/BetController/EnergyModule.svelte";
  import ContainerV2 from "$lib/components/BetController/ContainerV2.svelte";
  import Divider from "$lib/components/layout/Divider.svelte";

  let open = false;
</script>

<main style="">
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