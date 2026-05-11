const { fetchStats } = require('../src/fetchStats');
const { generateSVG } = require('../src/generateSVG');

function errorSVG(message) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="460" height="80" viewBox="0 0 460 80">
  <rect width="460" height="80" rx="12" fill="#1a1a2e"/>
  <rect width="460" height="80" rx="12" fill="none" stroke="#2c2c4a" stroke-width="1.5"/>
  <text x="20" y="28" font-size="12" fill="#646479" font-family="monospace">⌨ monkeytype</text>
  <text x="230" y="50" text-anchor="middle" font-size="13" fill="#e05c5c" font-family="monospace">${message}</text>
</svg>`;
}

module.exports = async (req, res) => {
  res.setHeader('Content-Type', 'image/svg+xml');
  res.setHeader('Cache-Control', 'public, max-age=3600, s-maxage=3600');

  try {
    const modes = req.query && req.query.modes;
    const stats = await fetchStats(modes);
    res.end(generateSVG(stats));
  } catch (err) {
    console.error('[monkeytype-card]', err);
    res.setHeader('Cache-Control', 'no-store');
    res.end(errorSVG(err.message.slice(0, 60)));
  }
};
