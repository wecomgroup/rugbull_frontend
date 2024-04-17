<script lang="ts">
  import TelegramLoginButton from "$lib/components/telegram/TelegramLoginButton.svelte";
  import {onMount} from "svelte";

  let tgUserData;
  let loginResult;

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
      }
    }
  }


  onMount(() => {
    window.addEventListener('message', handleTelegramLogin)
    return () => {
      window.removeEventListener('message', handleTelegramLogin)
    }
  })

</script>

<div>
</div>
<TelegramLoginButton/>

TG User Data
<pre>{JSON.stringify(tgUserData, null, 2)}</pre>
Login Result
<pre>{JSON.stringify(loginResult, null, 2)}</pre>
