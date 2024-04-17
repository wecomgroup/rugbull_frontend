import {API_URL} from '$env/static/private';
import {error, json, type RequestEvent} from "@sveltejs/kit";

async function postLogin(payload) {
  const path = `${API_URL}/v1/telegram.php/login`

  payload = {
    ...payload,
  }

  const response = await fetch(path, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload),
  })
  return response;
}

export async function POST({request}: RequestEvent) {
  const payload = await request.json()
  const response = await postLogin(payload)
  if (response.status >= 300) {
    return error(response.status, await response.text())
  }
  const data = await response.json()
  if (data.statusCode >= 300) {
    return error(data.statusCode, data);
  }

  return json(data.data)
}
