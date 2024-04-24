<script>
  import TelegramLoginButton from "$lib/components/telegram/TelegramLoginButton.svelte";
  import {onMount} from "svelte";
  import {page} from "$app/stores";
  import {goto} from "$app/navigation";
  import {PUBLIC_TELEGRAM_BOT_NAME, PUBLIC_TELEGRAM_APP_NAME} from '$env/static/public'
  import {postLogin} from "$lib/api/postLogin";
  import CopyablePre from "$lib/components/BetController/CopyablePre.svelte";

  let loginResult, loginResult2, userData, telegramWebapp;

  $: {
    if ($page.data.token) {
      localStorage.setItem('token', $page.data.token)
      goto('/games/rugbull')
    }
  }

  /**
   * @param {{ detail: Telegram.UserData; }} e
   */
  async function onUser(e) {
    userData = e.detail
  }

  async function loginWithPhotoUrl() {
    loginResult = await postLogin(userData)
  }

  async function loginWithoutPhotoUrl() {
    loginResult2 = await postLogin({
      ...userData,
      photo_url: undefined
    })
  }
</script>

<main>
  <h1>Debug Login</h1>
  <TelegramLoginButton
      on:user={onUser}
      bind:launchParams={telegramWebapp}
      botName={PUBLIC_TELEGRAM_BOT_NAME}
      appName={PUBLIC_TELEGRAM_APP_NAME}
  />

  Info:
  <CopyablePre text={`BotName {PUBLIC_TELEGRAM_BOT_NAME}
AppName {PUBLIC_TELEGRAM_APP_NAME}`}/>

  TG User Data:
  <CopyablePre text={JSON.stringify(userData, null, 2)} />

  TG WebApp data:
  <CopyablePre text={JSON.stringify(telegramWebapp, null, 2)} />

  <button on:click={loginWithPhotoUrl}>Login with photo_url</button>
  <CopyablePre text={JSON.stringify(loginResult, null, 2)}/>

  <button on:click={loginWithoutPhotoUrl}>Login without photo_url</button>
  <CopyablePre text={JSON.stringify(loginResult2, null, 2)}/>

</main>


<style>
  main {
    display: grid;
    margin: 0 auto;
    padding: 20px 16px;
    max-width: 600px;
    gap: 8px;
  }

  button {
    text-decoration: underline;
    color: var(--brand)
  }
</style>