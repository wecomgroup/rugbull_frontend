import type types from './$types'

async function getToken() {
  const response = await fetch('https://api.rugbull.io/v1/index.php/index', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
  })
  const data = await response.json()
  const {token} = data.data
  return {token}
}

export const load : types.PageServerLoad = async ({ params }) => {
  const {token} = await getToken()
  return {
    token,
  };
}