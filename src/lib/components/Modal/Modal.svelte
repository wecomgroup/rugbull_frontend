<script>
  import {fly, fade} from 'svelte/transition'
  import CloseIcon from "$lib/icons/CloseIcon.svelte";

  export let open
  export let showCloseIcon = false;
  export let closeWhenClickOutside = true;
  export let fullscreen = false;
  export let modalWidth = 420;
  export let allowScroll = false;
  export let hideTitle = false;

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

</script>

{#if open}
  <div class="Modal" on:click={closeWhenClickOutside && close}
       in:fade
       out:fade
       data-has-close-icon={showCloseIcon}
       on:wheel={preventScroll}
       on:touchmove={preventScroll}
       data-variant={fullscreen ? "fullscreen" : ""}
  >
    <div class="container" on:click={handle}
         in:fly={{y: 20}}
         out:fly={{y: 20}}
         on:touchstart={handleTouchStart}
         on:touchmove={handleTouchMove}
         data-variant={fullscreen ? "fullscreen" : ""}
         style={`--modalWidth: ${modalWidth}px`}
    >
      <div class="container-inside"
           data-variant={fullscreen ? "fullscreen" : ""}
      >
        {#if !hideTitle}
          <div class="title">
            <slot name="title"/>
          </div>
        {/if}
        <div class="body">
          <slot name="body"/>
        </div>
        {#if showCloseIcon}
          <div class="close-icon" on:click={close}>
            <CloseIcon/>
          </div>
        {/if}
      </div>
    </div>
  </div>
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
  }

  .Modal[data-variant="fullscreen"] {
    background-color: var(--background);
  }

  .container {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: calc(100vw - 20px);
    max-width: 400px;
    box-sizing: border-box;
    border-radius: 20px;

    background-color: var(--background);
    padding: 0.5em;

    border: 1px solid currentColor;
  }

  .container[data-variant="fullscreen"] {
    background-color: var(--background);
    width: 100vw;
    height: 100vh;
    max-width: 100vw;

  }

  .container-inside {
    padding: 1em;
  }

  .container-inside[data-variant="fullscreen"] {
    border: none;
    padding: 0em;
  }

  .title {
    font-size: 20px;
    font-weight: bold;
    text-align: center;

    padding-bottom: 0.5em;
  }

  .body {
    text-align: center;
    white-space: pre-wrap;
  }

  .close-icon {
    position: absolute;
    top: 0;
    right: 0;
    padding: 0.5em;

    border: 2px solid var(--yellow);
    border-radius: 100%;

    transform: translate(0, -100%);

    cursor: pointer;
  }

  .Modal[data-has-close-icon="true"] {
  }

  @screen tablet {
    .container {
      /* padding: 1em; */
    }
  }
</style>