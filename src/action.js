const fs = require('fs');
const { execSync } = require('child_process');
const { fetchStats } = require('./fetchStats');
const { generateSVG } = require('./generateSVG');

process.env.MONKEYTYPE_APE_KEY = process.env.INPUT_APE_KEY;
process.env.MONKEYTYPE_USERNAME = process.env.INPUT_USERNAME;

const branch = process.env.INPUT_TARGET_BRANCH || 'monkeytype-card';
const token = process.env.INPUT_GITHUB_TOKEN;
const repo = process.env.GITHUB_REPOSITORY;

function exec(cmd) {
  execSync(cmd, { stdio: 'inherit' });
}

async function run() {
  console.log(`Fetching stats for ${process.env.INPUT_USERNAME}...`);
  const stats = await fetchStats();
  const svg = generateSVG(stats);

  fs.writeFileSync('monkeytype-card.svg', svg);
  console.log('SVG generated.');

  exec('git config user.email "github-actions[bot]@users.noreply.github.com"');
  exec('git config user.name "github-actions[bot]"');

  const remote = `https://x-access-token:${token}@github.com/${repo}.git`;
  exec(`git remote set-url origin "${remote}"`);

  exec(`git checkout --orphan ${branch} 2>/dev/null || git checkout ${branch} 2>/dev/null || true`);
  exec('git reset HEAD -- . 2>/dev/null || true');
  exec('git add monkeytype-card.svg');

  try {
    exec('git diff --staged --quiet');
    console.log('No changes, skipping commit.');
  } catch {
    exec('git commit -m "update monkeytype card"');
    exec(`git push origin ${branch} --force`);
    console.log(`Pushed to ${branch}.`);
  }
}

run().catch((err) => {
  console.error('Error:', err.message);
  process.exit(1);
});
