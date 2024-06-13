<script>
  import {fly, fade} from 'svelte/transition'
  import CloseIcon2 from "$lib/icons/CloseIcon2.svelte";
  import IconButton from "$lib/components/buttons/IconButton.svelte";
  import {spring}  from "svelte/motion";
  import {onMount} from "svelte";
  import {createAnimationLoop} from "$lib";

  export let open
  export let showCloseIcon = false;
  export let closeWhenClickOutside = true;
  export let fullscreen = false;
  export let modalWidth = 420;
  export let allowScroll = false;

  let time = Date.now()

  function close() {
    open = false
  }

  function handle(e) {
    e.stopPropagation()
  }

  function preventScroll(e) {
    if (allowScroll) return
    e.stopPropagation()
    e.preventDefault()
  }

  function handleTouchStart(e) {
    if (allowScroll) return
    e.stopPropagation()
  }

  function handleTouchMove(e) {
    if (allowScroll) return
    e.stopPropagation()
    e.preventDefault()
  }

  onMount(() => {
    const animation = createAnimationLoop(({t}) => {
      time = t
    })
    animation.startLoop()
    return  () => {
      animation.stopLoop()
    }
  })

</script>

{#if open}
  <button class="Modal"
          on:click={closeWhenClickOutside && close}
          data-has-close-icon={showCloseIcon}
          on:wheel={preventScroll}
          on:touchmove={preventScroll}
          data-variant={fullscreen ? "fullscreen" : ""}
          style="--gradient: linear-gradient(90deg, #0496FF {(Math.sin(time / 1000) * 0.5 + 0.5) *100}%, #FF35DE 100%)"
  >
    <button class="container"
            in:fly={{ y: 20, duration: 600}}
            on:click={handle}
            on:touchstart={handleTouchStart}
            on:touchmove={handleTouchMove}
            data-variant={fullscreen ? "fullscreen" : ""}
            style={`--modalWidth: ${modalWidth}px`}
    >
      <div class="container-inside"
      >
        <div class="glow-bar"/>
        <div class="body">
          <slot name="body"/>
        </div>
        {#if showCloseIcon}
          <div class="close-icon">
            <IconButton
                icon={CloseIcon2}
                on:click={close}
            />
          </div>
        {/if}
      </div>
    </button>
  </button>
{/if}

<style lang="postcss">
  .Modal {
    position: fixed;
    top: 0;
    left: 0;
    background: radial-gradient(circle, rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.9));
    width: 100vw;
    height: 100vh;
    z-index: 1000;

    -webkit-tap-highlight-color: transparent;
    backdrop-filter: blur(10px);
  }

  .Modal[data-variant="fullscreen"] {
    background-color: var(--background);
  }

  .container {
    position: fixed;
    bottom: 0;
    left: 50%;

    transform: translate(-50%);

    width: calc(100vw);

    max-height: calc(100vh - 4rem);
    max-width: 440px;
    box-sizing: border-box;
    border-top-left-radius: 16px;
    border-top-right-radius: 16px;

    background-color: var(--background);
    padding: 0.5em;

    border: 2px solid #24273A;
  }

  .container[data-variant="fullscreen"] {
    background-color: var(--background);
    width: 100vw;
    height: 100vh;
    max-width: 100vw;

  }

  .body {
    text-align: center;
    white-space: pre-wrap;
  }

  .close-icon {
    position: absolute;
    top: 0;
    right: 0;
    padding: 0.5rem;
  }

  .Modal[data-has-close-icon="true"] {
  }

  @screen tablet {
    .container {
      /* padding: 1em; */
    }
  }

  .glow-bar {
    margin: 0 auto;
    height: 0.25rem;
    width: 4rem;
    border-radius: 0.25rem;
    --shadow: 0px 0px 8px var(--brand);

    background: var(--gradient);
    box-shadow: var(--shadow);

  }
</style>