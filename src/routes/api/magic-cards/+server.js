import { POST } from '$lib/server/api/methods.js';
import { json } from '@sveltejs/kit';

/** @type {import('./$types').RequestHandler} */
export const GET = async ({ request }) => {
  const auth = request.headers.get('Authorization')
  const data = await POST('/v1/magicCard.php/cards', {
  }, {
    Authorization: auth
  })
  console.log(data)
  return json(data)
}
