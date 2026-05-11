# ⌨️ MonkeyType README Stats Card

Auto-updating MonkeyType stats card for your GitHub profile and portfolio. Shows personal bests for 10 words, 15s, and 60s.

---

## How it works

- **GitHub profile**: A GitHub Action runs on a cron schedule, fetches your stats, and commits a static SVG to a branch in your repo. Your README embeds the raw SVG URL — no external service needed.
- **Portfolio / anywhere**: A live Vercel endpoint returns the SVG on every request.

---

## Setup (GitHub profile)

### 1. Get a MonkeyType Ape Key
Go to [monkeytype.com](https://monkeytype.com) → Settings → Ape Keys → Generate → check **Activate**.

### 2. Add it as a repo secret
In your profile repo: **Settings → Secrets and variables → Actions → New repository secret**
- Name: `MONKEYTYPE_API_KEY`
- Value: your Ape Key

### 3. Add the workflow
Create `.github/workflows/monkeytype-card.yml` in your profile repo:

```yaml
name: update monkeytype card
on:
  schedule:
    - cron: "0 * * * *"
  workflow_dispatch:

jobs:
  update:
    runs-on: ubuntu-latest
    permissions:
      contents: write
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - uses: joshuahsieh24/monkeytypereadme@main
        with:
          ape_key: ${{ secrets.MONKEYTYPE_API_KEY }}
          username: YOUR_MONKEYTYPE_USERNAME
          target_branch: monkeytype-card
          github_token: ${{ secrets.GITHUB_TOKEN }}
```

### 4. Add the embed to your README
```markdown
[![MonkeyType](https://raw.githubusercontent.com/YOUR_USERNAME/YOUR_USERNAME/monkeytype-card/monkeytype-card.svg)](https://monkeytype.com/profile/YOUR_MONKEYTYPE_USERNAME)
```

### 5. Trigger the first run
Go to **Actions → update monkeytype card → Run workflow**. After it completes, the card appears in your profile.

---

## Portfolio / website embed

```html
<a href="https://monkeytype.com/profile/YOUR_USERNAME">
  <img src="https://monkeytypereadme.vercel.app/api/card" alt="MonkeyType stats" />
</a>
```

> Note: The live Vercel endpoint is configured for joshuahsieh24's account. Fork and deploy your own instance to use it with your own Ape Key.

---

Built with Node.js · MIT License
