<script>
  import Modal from "$lib/components/Modal/Modal.svelte";
  import ContainerV2 from "$lib/components/BetController/ContainerV2.svelte";
  import CopyableCode from "$lib/components/BetController/CopyableCode.svelte";

  let open = true;
  export let clientSeed = 'loading...';
  export let serverHash = 'loading...';
  let totalBets = 0;
  let newClientSeed;
  let nextServerSeed;
</script>

<ContainerV2>
  <button on:click={() => open = true}>Fairness</button>
</ContainerV2>

<Modal showCloseIcon={true} bind:open>
  <div class="modal-body" slot="body">
    <label for="client-seed">Client Seed</label>
    <CopyableCode text={clientSeed} />
    <label for="server-hash">Server Hash</label>
    <CopyableCode text={serverHash} />
  </div>
</Modal>

<style>
  .modal-body {
    display: grid;
    gap: 8px;
  }
  button {
    display: flex;
    align-items: center;
    gap: 8px;

    text-decoration: underline;
    color: var(--brand);
  }
</style>
