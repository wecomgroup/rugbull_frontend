export async function postLogin(tgUserData: Telegram.UserData) : Promise<AuthAPI.LoginResult> {
  const res = await fetch('/api/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(tgUserData)
  })
  return await res.json();
}