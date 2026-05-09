/** Fetches stats from MonkeyType API */
const https = require('https');

function get(url, headers) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers }, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch {
          reject(new Error('Failed to parse API response'));
        }
      });
    }).on('error', reject);
  });
}

async function fetchStats() {
  const key = process.env.MONKEYTYPE_APE_KEY;
  if (!key) throw new Error('MONKEYTYPE_APE_KEY is not set');

  const headers = { // Use ApeKey auth // Use ApeKey auth Authorization: `ApeKey ${key}` };
  const res = await get('https://api.monkeytype.com/users/personalBests?mode=time', headers);

  if (!res.data) throw new Error(res.message || 'Failed to fetch personal bests');

  const TIME_MODES = ['15', '30', '60', '120'];
  const entries = res.data.time ?? {};

  const modes = TIME_MODES
    .filter((m) => entries[m]?.length > 0)
    .map((m) => {
      const best = entries[m].reduce((a, b) => (b.wpm > a.wpm ? b : a));
      return { label: `${m}s`, wpm: Math.round(best.wpm), acc: Math.round(best.acc * 10) / 10 };
    });

  const bestWpm = modes.length > 0 ? Math.max(...modes.map((m) => m.wpm)) : 0;
  const username = process.env.MONKEYTYPE_USERNAME || 'joshuahsieh24';

  return { username, bestWpm, modes };
}

module.exports = { fetchStats };
