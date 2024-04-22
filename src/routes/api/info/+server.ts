import { json, error } from '@sveltejs/kit';
import type types from './$types';
import { API_URL,  } from '$env/static/private';
import {PUBLIC_TELEGRAM_BOT_NAME, PUBLIC_TELEGRAM_APP_NAME} from '$env/static/public';

export function GET({ url, params}: types.RequestEvent) {
  return json({API_URL, PUBLIC_TELEGRAM_BOT_NAME, PUBLIC_TELEGRAM_APP_NAME})
}