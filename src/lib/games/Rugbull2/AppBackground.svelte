<script lang="js">
  import {spring} from 'svelte/motion';
  import {onMount} from "svelte";
  import ScrollableImage from "$lib/games/Rugbull2/components/ScrollableImage.svelte";

  const backgroundX = spring(0, {
    stiffness: 0.1,
  });

  onMount(() => {
    backgroundX.set(-500);

    function mouseMove(e) {
      backgroundX.set(-e.clientX * 4);
    }

    window.addEventListener('mousemove', mouseMove);
  })

</script>

<!--Crater -->
<ScrollableImage x={$backgroundX}
              height="100px"
              src="/images/rugbull2/crater.webp"
/>

<!--Star background -->