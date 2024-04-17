<script>
  import {onMount} from "svelte";
  import {goto} from "$app/navigation";

  let show = false;
  let search = "";
  let selectedIndex = 0;

  /** @type {Array.<{label: string, href: string}>} */
  export let menus = [];

  onMount(() => {
    /**
     * @param e {KeyboardEvent}
     */
    function handleKey(e) {
      if (e.metaKey && e.key === 'k') {
        show = !show;
        search = ""
      }
    }

    window.addEventListener('keydown', handleKey);
    return () => {
      window.removeEventListener('keydown', handleKey);
    }
  })

  $: filteredMenu = menus.filter(menu => menu.href.toLowerCase().includes(search.toLowerCase()) || menu.label.toLowerCase().includes(search.toLowerCase()));

  /**
   * @param e {KeyboardEvent}
   */

  function handleInputKeyDown(e) {
    if (e.key === 'Enter') {
      if (filteredMenu.length > 0) {
        goto(filteredMenu[0].href);
        show = false;
      }
    } else if (e.key === "ArrowDown") {
      selectedIndex = selectedIndex + 1
      if (selectedIndex === filteredMenu.length) selectedIndex = 0;
    } else if (e.key === "ArrowUp") {
      selectedIndex = selectedIndex - 1
      if (selectedIndex === -1) selectedIndex = filteredMenu.length - 1;
    } else if (e.key === "Escape") {
      show = false;
    }
  }


</script>

{#if show}
  <div class="command-component">
    <div>

      <input bind:value={search}
             on:keydown={handleInputKeyDown}
             autofocus/>
      {#each filteredMenu as menu, index}
        <a class:selected={index === selectedIndex} href={menu.href}>{menu.label}</a>
      {/each}
    </div>
  </div>
{/if}

<style lang="scss">
  .command-component {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.7);
    z-index: 9999;

    div {
      margin: 200px auto 0;
      width: fit-content;
      display: grid;

      .selected {
        background-color: #FB295B;
      }
    }

    input {
      font-size: 16px;
      padding: 4px 8px;
    }

    a {
      padding: 4px 8px;
    }
  }
</style>