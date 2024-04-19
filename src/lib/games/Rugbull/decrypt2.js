import hmacSHA256 from 'crypto-js/hmac-sha256.js'

function hash(clientSeed, serverSeed) {
  const hash = hmacSHA256('sha256', serverSeed).update(clientSeed).digest('hex');
  return hash;
}

function hashToNumber(hash) {
  const hex = hash.substr(0, 8);
  const int = parseInt(hex, 16);
  // 0.01 will result in 1% house edge with a lowest crashpoint of 1
  const crashpoint = Math.max(1, (2 ** 32 / (int + 1)) * (1 - 0.01))
  return crashpoint;
}

function calculateOdds(ms) {
  const r = 0.0000597;
  return Math.pow(Math.E, r * ms);
}

function calculateMs(odds) {
  const r = 0.0000597;
  return Math.log(odds) / r;
}