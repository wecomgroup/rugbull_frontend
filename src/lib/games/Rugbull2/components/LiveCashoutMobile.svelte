<script context="module">
  export function randomUserEscape() {
    return {
      key: Date.now().toString(),
      time: Date.now(),
      amount: Math.random() * 10000,
      avatar: '/images/user/avatar.jpg',
      userName: 'John Doe',
      multiplier: Math.random() * 10,
      isUser: false,
    }
  }
</script>

<script>
  import LiveCashoutMobileItem from "$lib/games/Rugbull2/components/LiveCashoutMobileItem.svelte";
  import {spring} from 'svelte/motion';

  /**@type {Rugbull.UserEscape[]}*/
  export let items = []
  export let style = undefined

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

<div class="row flex gap-2 scrollbar-0 noselect" {style}>
  {#each items as item, index}
    {#if index === 0}
      <LiveCashoutMobileItem
          amount={item.amount}
          avatar={item.avatar}
          glow={item.isUser}
          style="transform: translate(-{$x}px,0)"
      />
    {:else}
      <LiveCashoutMobileItem
          amount={item.amount}
          avatar={item.avatar}
          glow={item.isUser}
          style="transform: translate(-{$x2}px,0)"
      />
    {/if}

  {/each}

</div>

<style>
  div {
    overflow: auto;
    padding-bottom: 1rem;
  }
</style>