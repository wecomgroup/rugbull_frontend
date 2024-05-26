<script lang="ts">
  import dayjs from 'dayjs'
  import relativeTime from 'dayjs/plugin/relativeTime'
  import {ONE_DAY} from "$lib/utils/date";
  import {fly} from 'svelte/transition'
  import Pagination from "$lib/components/bet-controller/Pagination.svelte";

  dayjs.extend(relativeTime)

  export let betHistory: RugbullAPI.UserBet[] = [];
  export let totalCount = 0;
  export let limit = 10;
  export let page = 1;

  function formatTime(v: string) {
    const d = dayjs(v)
    const diff = d.diff();

    if (diff < -ONE_DAY) {
      return d.fromNow()
    }
    return dayjs(v).format('HH:mm:ss')
  }

</script>

<table class="table-primary">
  <thead>
  <tr>
    <th></th>
    <th>Win Amount</th>
    <th>Multiplier</th>
    <th>Bet on</th>
    <th class="show-only-desktop">Cashout</th>
  </tr>
  </thead>
  <tbody>
  {#each betHistory as bet}
    <tr in:fly={{y: 20}}>
      <td>
        {#if bet.isWin}
          <img alt="Win" src="/images/rugbull/win-image.webp" height="32"/>
        {:else}
          <img alt="Lost" src="/images/rugbull/lose-image.webp" height="32"
               style="filter: grayscale()"
          />
        {/if}
      </td>
      <td>{(parseFloat(bet.amount) * parseFloat(bet.multiplier)).toFixed(6)}</td>
      <td>{bet.multiplier}</td>
      <td>{formatTime(bet.createdAt)}</td>
      <td class="show-only-desktop">{formatTime(bet.updatedAt)}</td>
    </tr>
  {/each}
  </tbody>
</table>
<div style="display: grid; justify-items: center">
  <Pagination total={Math.ceil(totalCount / limit)} bind:page/>
</div>

<style lang="scss">
  .show-only-desktop {
    display: none;
    @media (min-width: 768px) {
      display: table-cell;
    }
  }

</style>