<script lang="ts">
  import dayjs from 'dayjs'
  import relativeTime from 'dayjs/plugin/relativeTime'
  import {ONE_DAY} from "$lib/utils/date";
  import TrophyIcon from "$lib/icons/TrophyIcon.svelte";

  dayjs.extend(relativeTime)

  export let betHistory: RugbullAPI.UserBet[] = [];

  function formatTime(v: string) {
    const d = dayjs(v)
    const diff = d.diff();
    console.log(diff)
    if (diff < -ONE_DAY) {
      return d.fromNow()
    }
    return dayjs(v).format('HH:mm:ss')
  }

</script>

<table>
  <thead>
  <tr>
    <th>Win</th>
    <th>Amount</th>
    <th>Multiplier</th>
    <th>Bet on</th>
    <th class="show-only-desktop">Cashout</th>
  </tr>
  </thead>
  <tbody>
  {#each betHistory as bet}
    <tr>
      <td>
        {#if bet.isWin}
          <img alt="Win" src="/images/rugbull/win-image.webp" height="32"/>
          {:else}
          <img alt="Lost" src="/images/rugbull/lose-image.webp" height="32"
               style="filter: grayscale()"
          />
        {/if}
      </td>
      <td>{bet.amount}</td>
      <td>{bet.multiplier}</td>
      <td>{formatTime(bet.createdAt)}</td>
      <td class="show-only-desktop">{formatTime(bet.updatedAt)}</td>
    </tr>
  {/each}
  </tbody>
</table>

<style lang="scss">
  .show-only-desktop {
    display: none;
    @media (min-width: 768px) {
      display: table-cell;
    }
  }

  table {
    width: 100%;
    border-collapse: collapse;
  }

  th, td {
    padding: 4px 8px;
    text-align: right;
  }

  th {
    background-color: #432E09;
  }

  tr:nth-child(even) {
    background-color: #252525;
  }
</style>