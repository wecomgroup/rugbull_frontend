<script>
  import AppBackground from "$lib/games/Rugbull2/AppBackground.svelte";
  import Card from "$lib/components/layout/Card.svelte";
  import dayjs from "dayjs";
  import duration from "dayjs/plugin/duration";
  import relativeTime from "dayjs/plugin/relativeTime";
  import Title from "$lib/components/texts/Title.svelte";
  import TitleH2 from "$lib/components/texts/TitleH2.svelte";
  import { MagicCardAPI } from "$lib/socket-api/magic-cards";
  import { createQuery } from "@tanstack/svelte-query";

  dayjs.extend(duration);
  dayjs.extend(relativeTime)


  let pointsLimit = 2500;

  const magicCards = createQuery({
    queryKey: ["magic-cards"],
    queryFn: MagicCardAPI.list,
  });

  const TYPES = {
    "Speed up": {
      variant: "blue",
      title: "Speed up",
      description:
        "This kind of magic card is to speed up increment of Locked Point, that means increase 2 points per second",
      image: "/images/rugbull2/Lightning.svg",
      action: "Buy for 150.0",
      icon: "/images/user/coin.svg",
      tagLabel: "TIME TO ACTION",
      tag: dayjs().format("hh:mm:ss"),
    },
    "Expand pool": {
      variant: "red",
      title: "Expand pool",
      description:
        "This kind of magic card is to expand the capacity of Locked Point Pool",
      image: "/images/rugbull2/Potion.svg",
      action: "Buy for 150.0",
      icon: "/images/user/coin.svg",
      tagLabel: "POINTS LIMIT",
      tag: pointsLimit,
    },
    "Double winning": {
      variant: "gray",
      title: "Double winning",
      description:
        "This kind of magic card is to double winning of Free Point within valid period.",
      image: "/images/rugbull2/Double.svg",
      action: "Buy for 200.0",
      icon: "/images/user/coin.svg",
      tagLabel: "TIME TO ACTION",
      tag: dayjs().format("hh:mm:ss"),
    },
  }

  $: cards = $magicCards.data?.cards.map((card) => {
    return {
      ...TYPES[card.type],
      id: card.rowId,
      title: card.name,
      description: card.description,
      tagLabel: "DURATION",
      tag: dayjs.duration(card.duration, "s").humanize(),
      action: `Buy for ${card.price}`,
    };
  }) ?? [];

  function buyCard(id){
    MagicCardAPI.buy({cardId: id});
  }
</script>

<div class="fixed" style="z-index: -1">
  <AppBackground hideGround={true} fullScreen={true}></AppBackground>
</div>

<main>
  <Title style="justify-content: center; margin: 1rem 0">Magic cards</Title>
  {#each cards as i}
    <Card variant={i.variant}>
      <div class="card-content">
        <img class="image" alt="icon" src={i.image} />
        <TitleH2>{i.title}</TitleH2>
        <p class="description">{i.description}</p>
        <div class="flex items-center w-full">
          <p class="flex-1">{i.tagLabel}</p>
          <div class="Tag">{i.tag}</div>
        </div>
        <button on:click={() => buyCard(i.id)}>
          {i.action} <img class="icon" alt="icon" src={i.icon} />
        </button>
      </div>
    </Card>
  {/each}
</main>

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
      min-height: 8rem;
    }
  }

  button {
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
</style>
