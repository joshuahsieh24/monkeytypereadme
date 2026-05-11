# ⌨️ monkeytypereadme

Auto-updating MonkeyType stats card for your GitHub profile and portfolio. Fetches your personal bests directly from the MonkeyType API and renders them as a clean SVG card.

**Two ways to use it:**
- **GitHub profile** — A GitHub Action runs on a cron schedule, generates the SVG, and commits it to a branch in your repo. Your README embeds it as a static image. Auto-updates every hour.
- **Portfolio / any website** — Deploy your own Vercel instance and embed the live endpoint anywhere as an `<img>` tag.

---

## Preview

![card preview](https://raw.githubusercontent.com/joshuahsieh24/joshuahsieh24/monkeytype-card/monkeytype-card.svg)

---

## GitHub Profile Setup

### 1. Get a MonkeyType Ape Key

1. Go to [monkeytype.com](https://monkeytype.com) and log in
2. Open **Settings** and search for **Ape Keys**
3. Click **Generate** — a new key will appear
4. Check the **Activate** checkbox next to your key (required — inactive keys will fail silently)
5. Copy the key

### 2. Add the key as a GitHub secret

In your GitHub profile repo (`YOUR_USERNAME/YOUR_USERNAME`):

1. Go to **Settings → Secrets and variables → Actions**
2. Click **New repository secret**
3. Name: `MONKEYTYPE_API_KEY`
4. Value: paste your Ape Key
5. Click **Add secret**

### 3. Create the workflow file

Create `.github/workflows/monkeytype-card.yml` in your profile repo:

```yaml
name: update monkeytype card
on:
  schedule:
    - cron: "0 * * * *"    # runs every hour
  workflow_dispatch:         # allows manual trigger

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

Replace `YOUR_MONKEYTYPE_USERNAME` with your MonkeyType username (check your profile URL on monkeytype.com).

### 4. Add the card to your README

Paste this into your profile `README.md` where you want the card to appear:

```markdown
[![MonkeyType](https://raw.githubusercontent.com/YOUR_USERNAME/YOUR_USERNAME/monkeytype-card/monkeytype-card.svg)](https://monkeytype.com/profile/YOUR_MONKEYTYPE_USERNAME)
```

Replace both `YOUR_USERNAME` and `YOUR_MONKEYTYPE_USERNAME`.

### 5. Trigger the first run

Go to your profile repo → **Actions** → **update monkeytype card** → **Run workflow**.

The action will create a `monkeytype-card` branch and commit `monkeytype-card.svg` to it. Once that branch exists, the image will render in your profile README.

> After the first run, the card auto-updates every hour via the cron schedule.

---

## Portfolio / Website Setup

### 1. Fork this repo

Fork `joshuahsieh24/monkeytypereadme` to your own GitHub account.

### 2. Deploy to Vercel

1. Go to [vercel.com](https://vercel.com) → **Add New Project**
2. Import your forked repo
3. Under **Environment Variables**, add:
   - `MONKEYTYPE_APE_KEY` — your Ape Key
   - `MONKEYTYPE_USERNAME` — your MonkeyType username
4. Click **Deploy**

### 3. Embed the card

Once deployed, your card is live at `https://YOUR-PROJECT.vercel.app/api/card`.

**HTML:**
```html
<a href="https://monkeytype.com/profile/YOUR_USERNAME">
  <img src="https://YOUR-PROJECT.vercel.app/api/card" alt="MonkeyType stats" />
</a>
```

**React / JSX:**
```jsx
<a href="https://monkeytype.com/profile/YOUR_USERNAME">
  <img src="https://YOUR-PROJECT.vercel.app/api/card" alt="MonkeyType stats" />
</a>
```

---

## Customization

### Choose which modes to display

By default the card shows personal bests for **10 words**, **15 seconds**, and **60 seconds**. You can change this using the `modes` input.

**Format:** space-separated list using `Ns` for time modes and `Nw` for word modes.

| Value | Meaning |
|-------|---------|
| `15s` | 15-second time trial |
| `30s` | 30-second time trial |
| `60s` | 60-second time trial |
| `120s` | 2-minute time trial |
| `10w` | 10-word test |
| `25w` | 25-word test |
| `50w` | 50-word test |
| `100w` | 100-word test |

**Example — show only time modes:**
```yaml
- uses: joshuahsieh24/monkeytypereadme@main
  with:
    ape_key: ${{ secrets.MONKEYTYPE_API_KEY }}
    username: YOUR_USERNAME
    modes: "15s 30s 60s 120s"
    target_branch: monkeytype-card
    github_token: ${{ secrets.GITHUB_TOKEN }}
```

**Example — show only word modes:**
```yaml
    modes: "10w 25w 50w 100w"
```

**Example — mix time and words:**
```yaml
    modes: "10w 15s 60s"
```

Modes without a personal best show a `—` placeholder and fill in automatically once you complete that test.

### Vercel endpoint with custom modes

You can also pass modes as a query parameter to the live endpoint:

```
https://YOUR-PROJECT.vercel.app/api/card?modes=15s+30s+60s
```

---

## Troubleshooting

**Card shows `—` for all modes**
Your Ape Key is inactive. Go to MonkeyType → Settings → Ape Keys and check the **Activate** checkbox.

**Workflow fails with permission error**
Make sure the workflow has `permissions: contents: write`. Also check that GitHub Actions are enabled in your repo settings.

**Card doesn't update after the workflow runs**
GitHub caches profile README images aggressively. Hard refresh (`Ctrl+Shift+R`) or wait a few minutes.

**`MONKEYTYPE_API_KEY` not found error**
Double-check the secret name matches exactly — it's `MONKEYTYPE_API_KEY`, not `MONKEYTYPE_APE_KEY`.

---

## Action Inputs Reference

| Input | Required | Default | Description |
|-------|----------|---------|-------------|
| `ape_key` | ✅ | — | MonkeyType Ape Key |
| `username` | ✅ | — | MonkeyType username |
| `modes` | ❌ | `10w 15s 60s` | Modes to display |
| `target_branch` | ❌ | `monkeytype-card` | Branch to commit SVG to |
| `github_token` | ✅ | — | Use `secrets.GITHUB_TOKEN` |

---

Built with Node.js · MIT License
