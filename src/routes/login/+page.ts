import type types from './$types'

export const load : types.PageLoad = async ({ url }) => {
  let token = url.searchParams.get('token');
  let debug = url.searchParams.get('debug');

  return {
    token,
    debug: !!debug,
  };
}