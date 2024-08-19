<script>
  import { createEventDispatcher } from "svelte";
  import Card from "../layout/Card.svelte";
  import Countdown from "../texts/Countdown.svelte";
  import TitleH2 from "../texts/TitleH2.svelte";
  import DropdownOnClick from "../layout/DropdownOnClick.svelte";
  import ChevronDown from "$lib/icons/ChevronDown.svelte";

  export let variant = "blue";
  export let title = "Title";
  export let description = "Description";
  export let image = "/images/rugbull2/Lightning.svg";
  export let expirationTime = -1;
  export let affectAmount = -1;
  export let coinIcon = "/images/user/coin.svg";
  export let options = [{ label: "Option 1", value: 1, price: 120 }];

  let selectedOption = options[0];

  const dispatch = createEventDispatcher();
</script>

<Card {variant}>
  <div class="card-content">
    <img class="image" alt="icon" src={image} />
    <TitleH2>{title}</TitleH2>
    <p class="description">{description}</p>
    {#if expirationTime > 0}
      <div class="flex items-center w-full">
        <p class="flex-1">Time Left</p>
        <div class="Tag mono">
          <Countdown targetTime={expirationTime} />
        </div>
      </div>
    {/if}
    {#if affectAmount > 0}
      <div class="flex items-center w-full">
        <p class="flex-1">Amount</p>
        <div class="Tag mono">
          <Countdown targetTime={affectAmount} />
        </div>
      </div>
    {/if}
    <DropdownOnClick
      style="width: 100%"
      buttonWrapperStyle="width: 100%"
      dropdownWrapperStyle="width: 100%"
    >
      <div slot="button">
        <button class="dropdown-button flex items-center p-3 space-between">
          {selectedOption.name}
          <ChevronDown />
        </button>
      </div>
      <div slot="dropdown" class="dropdown-container glow">
        {#each options as option}
          <button
            class="dropdown-item flex p-3 w-full"
            on:click={() => {
              selectedOption = option;
            }}
          >
            {option.name} - {option.price}
          </button>
        {/each}
      </div>
    </DropdownOnClick>
    <button class="buy-button" on:click={() => dispatch("buy", selectedOption)}>
      Buy for {selectedOption.price}
      <img class="icon" alt="icon" src={coinIcon} />
    </button>
  </div>
</Card>

<style lang="scss">
  main {
    display: grid;
    gap: 1.2rem;
    justify-content: center;
    padding: 1rem 0;
  }

  p {
    color: var(--text-gray);
  }

  .description {
    text-align: center;
  }

  .Tag {
    background: rgb(114, 127, 160, 0.2);
    padding: 0.5rem 1rem;
    border-radius: 0.5rem;
  }

  .card-content {
    display: grid;
    justify-items: center;
    padding: 1rem;

    gap: 1rem;

    .image {
      height: 6rem;
    }
  }

  .buy-button {
    position: relative;
    cursor: pointer;
    background-image: var(--gradient1);
    height: 4rem;
    width: 100%;

    font-size: 1.2rem;
    font-weight: 600;
    text-transform: uppercase;

    border-radius: 1rem;
    color: white;
    transition: all 0.3s ease;

    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;

    box-shadow: 0 6px 0 rgb(59, 95, 124, 0.5);

    &[data-disabled="true"] {
      pointer-events: none;
    }

    &[data-loading="true"] {
      pointer-events: none;
    }

    &:disabled,
    &[disabled] {
      background-image: var(--background-2);
      color: var(--text-gray);
    }

    &:active {
      background-image: var(--gradient2);
    }
  }

  .dropdown-button {
    width: 100%;
    border-radius: 0.75rem;
    background: rgb(114, 127, 160, 0.5);
  }

  .dropdown-container {
    width: 100%;
    border-radius: 0.75rem;
    font-size: 0.8rem;
    --bg: rgb(37, 46, 78);
  }

  .glow {
    background: linear-gradient(180deg, var(--bg) 0, var(--bg2) 100%);
    // border: 2px solid var(--border);
    box-shadow:
      inset 0 0 1rem var(--bg2),
      var(--shadow);
  }
</style>
