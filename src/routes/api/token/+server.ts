import type {RequestEvent} from './$types';

import {json} from '@sveltejs/kit';
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

export async function POST({request}: RequestEvent) {

  const {token} = await getToken()
  return json({
    token,
  })
}
