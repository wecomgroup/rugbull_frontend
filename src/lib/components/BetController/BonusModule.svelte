<script>
  import CoinsIcon from "$lib/icons/CoinsIcon.svelte";
  import ContainerV2 from "$lib/components/BetController/ContainerV2.svelte";

  export let bonus = 1000;
  export let glow = undefined;
</script>

<ContainerV2 style="display: flex; align-items: center" {glow}>
  <CoinsIcon/>
  <span class="bonus-text">{bonus.toFixed(6)}</span>
</ContainerV2>

<style>
  .bonus-text {
    font-size: 18px;
    @media (min-width: 400px) {
      font-size: 22px
    }
    @media (min-width: 480px) {
      font-size: 32px
    }
    @media (min-width: 570px) {
      font-size: 40px
    }
  }
</style>