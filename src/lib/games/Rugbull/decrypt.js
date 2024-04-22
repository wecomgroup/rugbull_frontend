import CryptoJS from 'crypto-js'

export function hash(clientSeed, serverSeed) {
  const hmac = CryptoJS.algo.HMAC.create(CryptoJS.algo.SHA256, serverSeed);
  hmac.update(clientSeed);

  const hash = CryptoJS.enc.Hex.stringify(hmac.finalize());
  return hash;}

export function hashToNumber(hash) {
  const hex = hash.substr(0, 8);
  const int = parseInt(hex, 16);
  const crashpoint = Math.max(1, (2 ** 32 / (int + 1)) * (1 - 0.01));
  return crashpoint;
}

export function calculateOdds(ms) {
  const r = 0.0000597;
  return Math.pow(Math.E, r * ms);
}

export function calculateMs(odds) {
  const r = 0.0000597;
  return Math.log(odds) / r;
}