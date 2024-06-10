<script>
  import {fly} from "svelte/transition";
  export let avatar = "/images/user/avatar.jpg"
  export let amount = 1680.10
  export let glow = false;
  export let style = undefined;
</script>

<div class="LiveCashoutMobileItem flex items-center"
     class:glow={glow}
     in:fly={{x: -20}}
     {style}
>
  <img class="avatar" alt="user avatar" src={avatar}/>
  <div>+{amount.toFixed(2)}</div>
  <img class="icon" alt="icon" src="/images/user/coin.svg" />
</div>

<style>
  .LiveCashoutMobileItem {
    --shadow:-2px 6px 4px rgba(0, 0, 0, 0.25);

    font-size: 0.8rem;
    font-weight: 500;
    box-shadow: var(--shadow);
  }
  .avatar {
    border-radius: 50%;
    width: 1.2rem;
    height: 1.2rem;
    margin-right: 0.4rem;
  }
  .icon {
    width: 1.2rem;
    height: 1.2rem;
  }

  .LiveCashoutMobileItem {
    background: var(--background-2);
    padding: 0.5rem 0.75rem;
    border-radius: 1rem;

    border: 2px solid var(--background-2);
    box-sizing: border-box;

    gap: 0.1rem;
  }

  .glow {
    border-color: var(--brand);
    box-shadow: inset 0 0 1rem var(--brand), var(--shadow);
    background: #183657;
  }


</style>
