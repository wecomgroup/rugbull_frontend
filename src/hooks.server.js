/**
 * https://kit.svelte.dev/docs/hooks#shared-hooks-handleerror
 */

/** @type {import('@sveltejs/kit').HandleServerError} */
export async function handleError({ error, event, status, message }) {
  const errorId = crypto.randomUUID();

  console.log('hooks.server.js', error)

  return {
    message: 'Whoops! from hooks.server.js',
    errorId,
    error: error.message
  };
}