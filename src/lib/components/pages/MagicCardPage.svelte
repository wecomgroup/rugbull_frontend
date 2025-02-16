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
  import Countdown from "../texts/Countdown.svelte";
  import { userStore } from "$lib/stores";
  import MagicCard from "../display/MagicCard.svelte";

  dayjs.extend(duration);
  dayjs.extend(relativeTime);

  let pointsLimit = 2500;
  let cards = [];

  const magicCards = createQuery({
    queryKey: ["magic-cards/list"],
    queryFn: MagicCardAPI.list,
  });

  const activeBuffs = createQuery({
    queryKey: ["magic-cards/active"],
    queryFn: MagicCardAPI.listActive,
  });

  const CARDS = [
    {
      type: "Speed up",
      variant: "blue",
      title: "Speed up",
      description:
        "This kind of magic card is to speed up increment of Locked Point, that means increase 2 points per second",
      image: "/images/rugbull2/Lightning.svg",
      expirationTime: -1,
      affectAmount: -1,
      options: [],
    },
    {
      type: "Expand pool",
      variant: "red",
      title: "Expand pool",
      description:
        "This kind of magic card is to expand the capacity of Locked Point Pool",
      image: "/images/rugbull2/Potion.svg",
      expirationTime: -1,
      affectAmount: -1,
      options: [],
    },
    {
      type: "Double winning",
      variant: "gray",
      title: "Double winning",
      description:
        "This kind of magic card is to double winning of Free Point within valid period.",
      image: "/images/rugbull2/Double.svg",
      action: "Buy for 200.0",
      icon: "/images/user/coin.svg",
      expirationTime: -1,
      affectAmount: -1,
      options: [],
    },
  ];

  $: {
    if ($magicCards.data) {
      const tmpCards = CARDS.map((i) => ({ ...i, options: [] }));

      $magicCards.data.cards.forEach((option) => {
        const card = tmpCards.find((i) => i.type === option.type);

        card.options.push(option);
      });

      tmpCards.forEach((card) => {
        const buff = $activeBuffs.data?.find(
          (buff) => buff.card.type === card.type,
        );

        if (card.type === "Expand pool") {
          card.affectAmount =
            buff == null || !buff.card.effect_amount
              ? -1
              : buff.card.effect_amount;
        } else {
          card.expirationTime =
            buff == null || !buff.expirationTime
              ? -1
              : dayjs(buff.expirationTime).valueOf();
        }
      });

      cards = tmpCards;
    }
  }

  async function buyCard(e) {
    const cardId = e.detail.rowId;
    await MagicCardAPI.buy({ cardId: cardId });
    $activeBuffs.refetch();
    await userStore.reload();
  }
</script>

<div class="fixed" style="z-index: -1">
  <AppBackground hideGround={true} fullScreen={true}></AppBackground>
</div>

<main>
  <Title style="justify-content: center; margin: 1rem 0">Magic cards</Title>
  {#each cards as i}
    <MagicCard
      variant={i.variant}
      title={i.title}
      description={i.description}
      image={i.image}
      affectAmount={i.affectAmount}
      expirationTime={i.expirationTime}
      options={i.options}
      on:buy={buyCard}
    />
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
      height: 6rem;
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
