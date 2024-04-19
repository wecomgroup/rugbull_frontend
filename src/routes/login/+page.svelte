<script lang="ts">
  import TelegramLoginButton from "$lib/components/telegram/TelegramLoginButton.svelte";
  import {onMount} from "svelte";
  import {page} from "$app/stores";
  import {goto} from "$app/navigation";
  import {browser} from "$app/environment";

  let tgUserData;
  let loginResult;

  $: {
    if ($page.data.token) {
      localStorage.setItem('token', $page.data.token)
      goto('/games/rugbull')
    }
  }

  async function postLogin(tgUserData) {
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(tgUserData)
    })
    return await res.json();
  }

  async function handleTelegramLogin(e: MessageEvent) {
    if (e.origin === 'https://oauth.telegram.org') {
      const data = JSON.parse(e.data)
      console.log('telegram auth', data)
      if (data.event === 'auth_user') {
        tgUserData = data.auth_data

        loginResult = await postLogin(tgUserData)
        if (loginResult?.token) {
          localStorage.setItem('token', loginResult.token)
          goto('/games/rugbull')
        }
      }
    }
  }


  onMount(() => {
    if (browser && localStorage.getItem('token')) {
      goto('/games/rugbull')
    }
    window.addEventListener('message', handleTelegramLogin)
    return () => {
      window.removeEventListener('message', handleTelegramLogin)
    }
  })

</script>

<main>
  <TelegramLoginButton/>
</main>

{#if $page.data.debug}
  TG User Data
  <pre>{JSON.stringify(tgUserData, null, 2)}</pre>
  Login Result
  <pre>{JSON.stringify(loginResult, null, 2)}</pre>
{/if}


<style>
  main {
    padding: 20px 16px;
  }
</style>