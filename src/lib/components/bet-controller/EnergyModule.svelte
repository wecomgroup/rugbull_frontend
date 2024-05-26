<script>
  import ZapIcon from "$lib/icons/ZapIcon.svelte";
  import ContainerV2 from "$lib/components/bet-controller/ContainerV2.svelte";
  import EnergyBar from "$lib/components/loaders/EnergyBar.svelte";

  export let energy = 30;
  export let maxEnergy = 100;
  export let glow = undefined;
</script>

<ContainerV2 style="display: grid" {glow}>
  <EnergyBar amount={energy} maxAmount={maxEnergy} inactive={!glow}/>
  <span class="tag"
        style="margin: -10px 5px 0 0px; justify-self: right; border-radius: 10px; height: fit-content; z-index: 1;display: flex;align-items: center">Energy: {energy}
    <ZapIcon style="height: 16px; width: 16px"/></span>
</ContainerV2>
