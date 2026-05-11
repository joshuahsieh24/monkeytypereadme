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

  const headers = { Authorization: `ApeKey ${key}` };

  const [timeRes, wordsRes] = await Promise.all([
    get('https://api.monkeytype.com/users/personalBests?mode=time', headers),
    get('https://api.monkeytype.com/users/personalBests?mode=words', headers),
  ]);

  if (!timeRes.data) throw new Error(timeRes.message || 'Failed to fetch time personal bests');
  if (!wordsRes.data) throw new Error(wordsRes.message || 'Failed to fetch words personal bests');

  function getBest(data, mode2) {
    const entries = data[mode2];
    if (!entries || entries.length === 0) return null;
    const best = entries.reduce((a, b) => (b.wpm > a.wpm ? b : a));
    return { wpm: Math.round(best.wpm), acc: Math.round(best.acc * 10) / 10 };
  }

  const WANTED = [
    { label: '10 words', data: wordsRes.data, mode2: '10' },
    { label: '15s',      data: timeRes.data,  mode2: '15' },
    { label: '60s',      data: timeRes.data,  mode2: '60' },
  ];

  const modes = WANTED.map(({ label, data, mode2 }) => {
    const best = getBest(data, mode2);
    return { label, wpm: best ? best.wpm : null, acc: best ? best.acc : null };
  });

  const completed = modes.filter((m) => m.wpm !== null);
  const bestWpm = completed.length > 0 ? Math.max(...completed.map((m) => m.wpm)) : 0;
  const username = process.env.MONKEYTYPE_USERNAME || 'joshuahsieh24';

  return { username, bestWpm, modes };
}

module.exports = { fetchStats };
