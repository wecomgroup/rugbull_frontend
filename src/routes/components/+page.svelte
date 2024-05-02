<script>
  import BetController from "$lib/components/BetController/BetController.svelte";
  import HamsterLoader from "$lib/components/loaders/HamsterLoader.svelte";
  import SimpleLoader from "$lib/components/loaders/SimpleLoader.svelte";
  import Modal from "$lib/components/Modal/Modal.svelte";
  import BetButton from "$lib/components/BetController/BetButton.svelte";
  import Pagination from "$lib/components/BetController/Pagination.svelte";
  import EnergyModule from "$lib/components/BetController/EnergyModule.svelte";
  import ContainerV2 from "$lib/components/BetController/ContainerV2.svelte";

  let open = false;
</script>

<main>
  <BetController/>
  <HamsterLoader/>
  <SimpleLoader/>

  <BetButton size="sm" on:click={() => open = true}>Open Modal</BetButton>

  <Modal bind:open>
    <div slot="title">Title</div>
    <div slot="body">
      Test
    </div>
  </Modal>

  <br/>
  <ContainerV2>
    <Pagination/>
  </ContainerV2>

  <div class="col-2">
    <EnergyModule glow="1"/>
    <EnergyModule/>
  </div>

</main>

<style>
  main{
    display: grid;

    grid-template-columns: 1fr;

    gap: 8px;
    max-width: 600px;

    margin: 0 20px;

    @media (min-width: 700px) {
      grid-template-columns: 1fr 1fr;
      margin: 0 auto;
    }
  }

  .col-2 {
    display: grid;
    grid-template-columns: 1fr 1fr;
  }
</style>