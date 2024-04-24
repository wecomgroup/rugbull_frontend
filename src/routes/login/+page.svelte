<script>
  import TelegramLoginButton from "$lib/components/telegram/TelegramLoginButton.svelte";
  import {onMount} from "svelte";
  import {page} from "$app/stores";
  import {goto} from "$app/navigation";
  import {browser} from "$app/environment";
  import {PUBLIC_TELEGRAM_BOT_NAME, PUBLIC_TELEGRAM_APP_NAME} from '$env/static/public'
  import {postLogin, postWebappLogin} from "$lib/api/postLogin";
  import CopyablePre from "$lib/components/BetController/CopyablePre.svelte";

  let loginResult, userData, initData;

  $: {
    if ($page.data.token) {
      localStorage.setItem('token', $page.data.token)
      goto('/games/rugbull')
    }
  }


  onMount(() => {
    if (browser && localStorage.getItem('token')) {
      goto('/games/rugbull')
    }
  })

  /**
     * @param {{ detail: Telegram.UserData; }} e
     */
  async function onUser(e) {
    userData = e.detail
    loginResult = await postLogin(userData)

    if (loginResult?.token) {
      localStorage.setItem('token', loginResult.token)
      goto('/games/rugbull')
    }
  }


  /**
   * @param {{ detail: string; }} e
   */
  async function onInitData(e) {
    initData = e.detail
    loginResult = await postWebappLogin(initData)

    if (loginResult?.token) {
      localStorage.setItem('token', loginResult.token)
      goto('/games/rugbull')
    }
  }
</script>

<main>
  <TelegramLoginButton
      on:user={onUser}
      on:initData={onInitData}
      botName={PUBLIC_TELEGRAM_BOT_NAME}
      appName={PUBLIC_TELEGRAM_APP_NAME}
  />

  {#if $page.data.debug}
    <div style="display: grid">
      Version: 0.0.1+7
      BotName <code>{PUBLIC_TELEGRAM_BOT_NAME}</code>
      AppName <code>{PUBLIC_TELEGRAM_APP_NAME}</code>
    </div>
    TG User Data
    <CopyablePre text={JSON.stringify(userData, null, 2)}/>
    Init Data
    <CopyablePre text={initData}/>
    Login Result
    <CopyablePre text={JSON.stringify(loginResult, null, 2)}/>
  {/if}
</main>



<style>
  main {
    padding: 20px 16px;
    max-width: 600px;
    margin: 0 auto;
  }
</style>