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

function parseModes(modesStr) {
  return (modesStr || '10w 15s 60s').trim().split(/\s+/).map((m) => {
    const words = m.match(/^(\d+)w$/);
    const secs = m.match(/^(\d+)s$/);
    if (words) return { label: `${words[1]}w`, mode: 'words', mode2: words[1] };
    if (secs) return { label: `${secs[1]}s`, mode: 'time', mode2: secs[1] };
    return null;
  }).filter(Boolean);
}

async function fetchStats(modesStr) {
  const key = process.env.MONKEYTYPE_APE_KEY;
  if (!key) throw new Error('MONKEYTYPE_APE_KEY is not set');

  const headers = { Authorization: `ApeKey ${key}` };
  const wanted = parseModes(modesStr);

  const needsTime = wanted.some((m) => m.mode === 'time');
  const needsWords = wanted.some((m) => m.mode === 'words');

  const [timeRes, wordsRes] = await Promise.all([
    needsTime  ? get('https://api.monkeytype.com/users/personalBests?mode=time', headers)  : Promise.resolve({ data: {} }),
    needsWords ? get('https://api.monkeytype.com/users/personalBests?mode=words', headers) : Promise.resolve({ data: {} }),
  ]);

  if (needsTime  && !timeRes.data)  throw new Error(timeRes.message  || 'Failed to fetch time personal bests');
  if (needsWords && !wordsRes.data) throw new Error(wordsRes.message || 'Failed to fetch words personal bests');

  const timeData  = timeRes.data  || {};
  const wordsData = wordsRes.data || {};

  function getBest(data, mode2) {
    const entries = data[mode2];
    if (!entries || entries.length === 0) return null;
    const best = entries.reduce((a, b) => (b.wpm > a.wpm ? b : a));
    return { wpm: Math.round(best.wpm), acc: Math.round(best.acc * 10) / 10 };
  }

  const modes = wanted.map(({ label, mode, mode2 }) => {
    const data = mode === 'time' ? timeData : wordsData;
    const best = getBest(data, mode2);
    return { label, wpm: best ? best.wpm : null, acc: best ? best.acc : null };
  });

  const completed = modes.filter((m) => m.wpm !== null);
  const bestWpm = completed.length > 0 ? Math.max(...completed.map((m) => m.wpm)) : 0;
  const username = process.env.MONKEYTYPE_USERNAME || '';

  return { username, bestWpm, modes };
}

module.exports = { fetchStats };
