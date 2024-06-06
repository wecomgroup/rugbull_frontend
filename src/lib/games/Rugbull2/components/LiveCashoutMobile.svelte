<script context="module">
  export function randomUserEscape() {
    return {
      time: Date.now(),
      amount: Math.random() * 10000,
      avatar: '/images/user/avatar.jpg',
      userName: 'John Doe',
      multiplier: Math.random() * 10,
      isUser: Math.random() > 0.6,
    }
  }
</script>
<script>
  import LiveCashoutMobileItem from "$lib/games/Rugbull2/components/LiveCashoutMobileItem.svelte";
  import {fly} from 'svelte/transition';
  import {spring} from 'svelte/motion';

  /**@type {Rugbull.UserEscape[]}*/
  export let items = []

  let x = spring(0);
  let x2 = spring(0);

  $: {
    if (items.length > 0) {
      x = spring(200, {stiffness: 0.1});
      x.set(0)
      x2 = spring(200, {stiffness: 0.2});
      x2.set(0)
    }
  }
</script>

<div class="row flex gap-2 scrollbar-0 noselect">
  {#each items as item, index}
    {#if index === 0}
      <LiveCashoutMobileItem
          {...item}
          glow={item.isUser}
          style="transform: translate(-{$x}px,0)"
      />
    {:else}
      <LiveCashoutMobileItem
          {...item}
          glow={item.isUser}
          style="transform: translate(-{$x2}px,0)"
      />
    {/if}

  {/each}

</div>

<style>
  div {
    overflow: auto;
    min-height: 40px;
  }
</style>