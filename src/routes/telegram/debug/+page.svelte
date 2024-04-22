<script>
  import {PUBLIC_TELEGRAM_BOT_NAME, PUBLIC_TELEGRAM_APP_NAME} from '$env/static/public'
  import {onMount} from "svelte";
  import {browser} from "$app/environment";
  import {retrieveLaunchParams} from '@tma.js/sdk'
  import {postLogin} from "$lib/api/postLogin";

  let launchLink = `tg://resolve?domain=${PUBLIC_TELEGRAM_BOT_NAME}&appname=${PUBLIC_TELEGRAM_APP_NAME}`
  let launchParams;
  let loginResult;
  onMount(() => {
    if (browser) {
      launchParams = retrieveLaunchParams();

      if (launchParams) {
        /**
         * @type {Telegram.UserData}
         */
        const userData = {
          auth_date: launchParams.initData.authDate.getTime(),
          hash: launchParams.initData.hash,
          first_name: launchParams.initData.user.firstName || undefined,
          last_name: launchParams.initData.user.lastName || undefined,
          id: launchParams.initData.user.id,
          username: launchParams.initData.user.username,
          photo_url: launchParams.initData.user.photoUrl || undefined,
        }

        postLogin(userData)
          .then(result => {
            loginResult = result
          })
      }
    }
  })
</script>

{#if !launchParams}
  <a href={launchLink}>Launch [{PUBLIC_TELEGRAM_APP_NAME}] in telegram bot [{PUBLIC_TELEGRAM_BOT_NAME}]</a>
{:else}
  <label>User data</label>
  <pre>{JSON.stringify(launchParams, null, 2)}</pre>

  <label>Login Response</label>
  <pre>{JSON.stringify(loginResult, null, 2)}</pre>
{/if}


<style>
  pre {
    max-height: 400px;
    overflow: auto;
  }
</style>

