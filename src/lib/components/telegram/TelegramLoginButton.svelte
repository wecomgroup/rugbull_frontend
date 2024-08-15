<script lang="ts">
  /**
   * If Desktop, show Login with Telegram iframe
   * If Mobile and not Mini App, show launch button
   * If Mobile and Mini App, show loading
   */
  import getOrigin from '$lib/utils/getOrigin';
  import {createEventDispatcher, onMount} from "svelte";
  import {browser} from "$app/environment";

  export let botName = undefined;
  export let appName = undefined;
  let notTelegramMiniApp = false;


  const dispatch = createEventDispatcher<{
    'user': Telegram.UserData
    'initData': string,
  }>()

  /// https://oauth.telegram.org/embed/tgbetcom_bot?origin=https%3A%2F%2Frg.games&return_to=https%3A%2F%2Frg.games%2Fen%2Flogin%2Fold&size=large&userpic=true&request_access=write&radius=20&lang=en
  const origin = getOrigin();
  const iframeSrc = `https://oauth.telegram.org/embed/${botName}?` + ['origin=' + encodeURIComponent(origin)].join('&');
  const launchLink = `tg://resolve?domain=${botName}&appname=${appName}`

  async function handleTelegramLogin(e: MessageEvent) {
    if (e.origin === 'https://oauth.telegram.org') {
      const data = JSON.parse(e.data)
      if (data.event === 'auth_user') {
        console.log('window.message from telegram', data)
        const userData = data.auth_data
        dispatch('user', userData)
      }
    }
  }

  onMount(() => {
    if (browser) {
      try {
        const initData = window.Telegram.WebApp.initData
        console.log('Telegram detected')

        dispatch('initData', initData)
      } catch (e) {
        console.log('Telegram not detected.')
        notTelegramMiniApp = true
      }
    }

    window.addEventListener('message', handleTelegramLogin)
    return () => {
      window.removeEventListener('message', handleTelegramLogin)
    }
  })


</script>

<svelte:head>
  <script src="https://telegram.org/js/telegram-web-app.js"></script>
</svelte:head>

<div class="box-telegram__container">
  <div class="show-only-desktop">
    <iframe
        id="telegram-login"
        title="Telegram Login"
        src={iframeSrc}
        width="250"
        height="40"
        frameborder="0"
        scrolling="no"
        style="overflow: hidden; color-scheme: light dark; border: none; height: 40px; width: 219px;"
    ></iframe>
  </div>
  <div class="show-only-mobile">
    {#if notTelegramMiniApp}
      <a href={launchLink} class="btn-telegram">
        <i class="tgme_widget_login_button_icon"/>
        Launch in Telegram
      </a>
    {:else}
      loading...
    {/if}
  </div>
</div>

<style lang="scss">
  .show-only-desktop {
    display: flex;
    min-width: 300px;
    justify-content: center;

    iframe {
      min-width: 250px;
    }

    @media (max-width: 768px) {
      display: none;
    }
  }

  .show-only-mobile {
    display: none;
    @media (max-width: 768px) {
      display: block;
    }
  }

  .box-telegram__container {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  a.btn-telegram {
    text-decoration: inherit;
  }

  .btn-telegram {
    display: flex;
    gap: 8px;
    padding: 16px;

    font-size: 20px;

    border-radius: 60px;
    color: #fff;
    background-color: #54a9eb;

    .tgme_widget_login_button_icon {
      display: inline-block;
      width: 24px;
      height: 22px;
      background: url(data:image/svg+xml,%3Csvg%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20width%3D%2224%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22m1.95617055%2011.392196c5.77764656-2.42328736%209.63031585-4.02086673%2011.55800785-4.79273807%205.5039525-2.20384954%206.6476266-2.5866818%207.3930574-2.59932314.1639507-.00278035.5305319.0363352.7679878.22182361.2005031.15662277.2556695.36819788.2820684.51669348.026399.1484956.0592719.48677234.0331404.75109194-.2982611%203.0169019-1.5888322%2010.33812718-2.2454015%2013.71710898-.2778191%201.4297738-.8288514%201.7357846-1.3584441%201.7826999-1.1509274.1019576-2.0208916-.5588425-3.1356211-1.2622918-1.7443316-1.1007592-2.3854935-1.3972358-4.0786694-2.4713734-1.95675765-1.2413519-.8891962-1.8911034.2259543-3.0061212.2918402-.2918054%205.3989024-4.83750096%205.497052-5.24030969.0122753-.05037796-.1557336-.55407742-.2716182-.65323489-.1158847-.09915747-.2869204-.06524947-.4103446-.03828214-.17495.03822537-2.9615423%201.81132342-8.35977698%205.31929412-.79096496.5228681-1.50739646.7776269-2.1492945.7642766-.70764107-.0147176-2.06885864-.3851791-3.08078398-.7018404-1.24116762-.388398-1.69932554-.5713149-1.61342745-1.2309348.04474105-.3435709.36011227-.7024173.94611366-1.0765391z%22%20fill%3D%22%23fff%22%20fill-rule%3D%22evenodd%22%2F%3E%3C%2Fsvg%3E) no-repeat 0 -1px;
    }
  }
</style>
