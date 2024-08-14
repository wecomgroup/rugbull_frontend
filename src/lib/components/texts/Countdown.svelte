<script>
  import { onMount } from "svelte";
  import dayjs from "dayjs";
  import duration from "dayjs/plugin/duration";
    import { formatDuration } from "$lib/utils/format";

  dayjs.extend(duration);

  export let targetTime;

  let timeLeft = 0;

  onMount(() => {
    const id = setInterval(() => {
      timeLeft = dayjs(targetTime).diff(dayjs(), "millisecond");
    }, 100);
  });
</script>

{formatDuration(timeLeft)}
