<script lang="ts">
  import TelegramLoginButton from "$lib/components/telegram/TelegramLoginButton.svelte";
  import {onMount} from "svelte";
  import {page} from "$app/stores";
  import {goto} from "$app/navigation";
  import {browser} from "$app/environment";
  import {PUBLIC_TELEGRAM_BOT_NAME, PUBLIC_TELEGRAM_APP_NAME} from '$env/static/public'
  import {postLogin} from "$lib/api/postLogin";

  let loginResult : AuthAPI.LoginResult | undefined;
  let userData;

  $: {
    if ($page.data.token) {
      localStorage.setItem('token', $page.data.token)
      goto('/games/rugbull')
    }
  }

  $: {
    if (userData) {
      postLogin(userData)
        .then(data => {
          loginResult = data
          if (loginResult?.token) {
            localStorage.setItem('token', loginResult.token)
            goto('/games/rugbull')
          }
        })
    }
  }


  onMount(() => {
    if (browser && localStorage.getItem('token')) {
      goto('/games/rugbull')
    }
  })

</script>

<main>
  <TelegramLoginButton
      bind:userData
      botName={PUBLIC_TELEGRAM_BOT_NAME}
      appName={PUBLIC_TELEGRAM_APP_NAME}
  />
</main>

{#if $page.data.debug}
  TG User Data
  <pre>{JSON.stringify(userData, null, 2)}</pre>
  Login Result
  <pre>{JSON.stringify(loginResult, null, 2)}</pre>
{/if}


<style>
  main {
    padding: 20px 16px;
  }
</style>