import { API_URL } from "$env/static/private";

export async function POST(path, payload, headers) {
  const url = `${API_URL}${path}`

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...headers
    },
    body: JSON.stringify(payload),
  })
  return await response.json();
}