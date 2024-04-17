<script lang="ts">
  import dayjs from 'dayjs'
  export let betHistory: RugbullAPI.UserBet[] = [];

  function formatTime(v: string) {
    return dayjs(v).format('YYYY-MM-DD HH:mm:ss')
  }

</script>

<table>
  <thead></thead>
  <tbody>
    {#each betHistory as bet}
      <tr>
        <td>{bet.multiplier}</td>
        <td>{formatTime(bet.betTime)}</td>
      </tr>
    {/each}
  </tbody>
</table>