/** Generates SVG string from stats */
/** Generates SVG string from stats */
const WIDTH = 460;
const HEIGHT = 185;

const COLORS = { // Theme colors // Theme colors
  bg: '#1a1a2e',
  border: '#2c2c4a',
  accent: '#e2b714' // monkeytype yellow,
  text: '#c7c8e9',
  dim: '#646479',
  divider: '#2c2c4a',
};

function generateSVG({ username, bestWpm, modes }) {
  const modeCount = modes.length;
  const modeColWidth = modeCount > 0 ? Math.floor((WIDTH - 60) / modeCount) : 0;
  const modeStartX = 30;
  const modeY = 140;

  const modeCols = modes.map((m, i) => {
    const cx = modeStartX + i * modeColWidth + modeColWidth / 2;
    return `
      <text x="${cx}" y="${modeY}" text-anchor="middle" font-size="11" fill="${COLORS.dim}" font-family="monospace">${m.label}</text>
      <text x="${cx}" y="${modeY + 18}" text-anchor="middle" font-size="15" fill="${COLORS.text}" font-family="monospace" font-weight="600">${m.wpm}</text>`;
  }).join('');

  const dividers = modes.slice(1).map((_, i) => {
    const x = modeStartX + (i + 1) * modeColWidth;
    return `<line x1="${x}" y1="${modeY - 12}" x2="${x}" y2="${modeY + 22}" stroke="${COLORS.divider}" stroke-width="1"/>`;
  }).join('');

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}">
  <rect width="${WIDTH}" height="${HEIGHT}" rx="12" fill="${COLORS.bg}"/>
  <rect width="${WIDTH}" height="${HEIGHT}" rx="12" fill="none" stroke="${COLORS.border}" stroke-width="1.5"/>

  <!-- header -->
  <text x="20" y="28" font-size="12" fill="${COLORS.dim}" font-family="monospace">⌨ monkeytype</text>
  <text x="${WIDTH - 20}" y="28" text-anchor="end" font-size="12" fill="${COLORS.dim}" font-family="monospace">${username}</text>

  <!-- hero wpm -->
  <text x="${WIDTH / 2}" y="85" text-anchor="middle" font-size="56" fill="${COLORS.accent}" font-family="monospace" font-weight="700" letter-spacing="-2">${bestWpm}</text>
  <text x="${WIDTH / 2}" y="108" text-anchor="middle" font-size="13" fill="${COLORS.dim}" font-family="monospace" letter-spacing="3">wpm</text>

  <!-- divider -->
  <line x1="20" y1="124" x2="${WIDTH - 20}" y2="124" stroke="${COLORS.divider}" stroke-width="1"/>

  <!-- mode columns -->
  ${dividers}
  ${modeCols}
</svg>`;
}

module.exports = { generateSVG };
