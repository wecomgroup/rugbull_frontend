<script>
  import BetController from "$lib/components/BetController/BetController.svelte";
  import HamsterLoader from "$lib/components/loaders/HamsterLoader.svelte";
  import SimpleLoader from "$lib/components/loaders/SimpleLoader.svelte";
  import Modal from "$lib/components/Modal/Modal.svelte";
  import BetButton from "$lib/components/BetController/BetButton.svelte";

  let open = false;
</script>

<BetController/>
<HamsterLoader/>
<SimpleLoader variant="sm"/>

<BetButton size="sm" on:click={() => open = true}>Open Modal</BetButton>

<Modal bind:open>
  <div slot="title">Title</div>
  <div slot="body">
    Test
  </div>
</Modal>