import { writable } from "svelte/store";
import { formatTimeMs } from "./format";

export const messages = writable([]);

/**
 * 
 * @param {string} message 
 * @returns 
 */
export function log(message) {
  const formattedMessage = `${formatTimeMs(Date.now())} - ${message}`;
  console.log(formattedMessage);
  messages.update(m => {
    m = [formattedMessage, ...m];
    if (m.length > 200) {
      m = m.slice(0, 200);
    }
    return m;
  })
}
