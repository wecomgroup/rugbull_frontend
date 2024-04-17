import { json, error } from '@sveltejs/kit';
import type types from './$types';
import { API_URL, VITE_TELEGRAM_BOT_NAME } from '$env/static/private';

export function GET({ url, params}: types.RequestEvent) {
  return json({API_URL, VITE_TELEGRAM_BOT_NAME})
}