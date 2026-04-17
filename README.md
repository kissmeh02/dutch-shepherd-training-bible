# Dutch Shepherd Training Bible

Complete Dutch Shepherd training system for handlers who want one practical reference for:
- Dutch command vocabulary with pronunciation
- daily dog-focused training execution
- scent work and protection workflow support
- Notion-ready cross-device access via GitHub Pages

Live links:
- Site (Commands): `https://kissmeh02.github.io/dutch-shepherd-training-bible/`
- Daily Planner: `https://kissmeh02.github.io/dutch-shepherd-training-bible/daily-training.html`
- Notion Hub (recommended embed): `https://kissmeh02.github.io/dutch-shepherd-training-bible/notion-embed.html`

## What this project includes

- 70+ command and marker references with notes
- command quick-jump navigation and section highlighting
- command search/filter and mobile menu navigation
- audio coach with `Dutch`, `English`, and `Both` playback modes
- trainer mode, random command practice, and repeat-last playback
- dedicated dog-focused daily training planner (`daily-training.html`)
- Notion embed hub (`notion-embed.html`) optimized for iframe use
- structured command dataset file: `commands-data.json`
- production-ready split assets: `styles.css`, `app.js`, `daily-training.js`

## Local preview

Open `index.html` directly in a browser.

## Audio coach quick guide

- Click any `Audio` button next to a Dutch term to hear pronunciation.
- Open Audio Coach from the speaker icon in the nav bar.
- Modes:
  - `Dutch` = Dutch only
  - `English` = English only
  - `Both` = Dutch then English
- `Trainer mode` sets slower speed plus both languages.
- `Prefer male voice` tries to use a male voice when available.
- Voice selectors let you choose exact Dutch and English voices from your browser.
- `Voice test` lets you confirm your browser voice output.
- Shortcut: `Alt + A` repeats the last phrase.

## Recommended voice setup (Windows)

For the best Dutch voice quality and male voice options:

1. Use **Microsoft Edge** (best Windows speech integration).
2. Install Dutch language and speech packs:
   - `Settings` -> `Time & language` -> `Language & region`
   - Add `Dutch (Netherlands)` and install the **Speech** feature.
3. Restart your browser after installing voices.
4. In the site Audio Coach:
   - Keep `Prefer male voice` enabled, or
   - Select a specific Dutch voice from `Dutch voice`.
5. Click `Voice test` to verify before training sessions.

## Publish on GitHub Pages (recommended for Notion)

1. Create a new GitHub repo.
2. Upload all files in this folder.
3. In GitHub: `Settings` -> `Pages`.
4. Under **Build and deployment**, set:
   - **Source:** `Deploy from a branch`
   - **Branch:** `main` (or `master`), folder `/ (root)`
5. Save and wait 1-3 minutes.
6. Your live URL will be:
   - `https://<your-username>.github.io/<repo-name>/`

Live deployment for this project:
- Repo: `https://github.com/kissmeh02/dutch-shepherd-training-bible`
- Site: `https://kissmeh02.github.io/dutch-shepherd-training-bible/`

## Embed in Notion with full functionality

Important: full JavaScript functionality works only when you embed the **live hosted URL** (not raw HTML text).

Recommended URL (best cross-device workflow):
- `https://kissmeh02.github.io/dutch-shepherd-training-bible/notion-embed.html`

1. In Notion, type `/embed`.
2. Paste the Notion Hub URL above.
3. Resize the embed block for best viewing.
4. Use the two buttons inside the embed to switch between:
   - `Commands`
   - `Daily Training`

Direct embed URLs (optional):
- Commands: `https://kissmeh02.github.io/dutch-shepherd-training-bible/index.html?embed=1#commands`
- Daily Training: `https://kissmeh02.github.io/dutch-shepherd-training-bible/daily-training.html?embed=1`

## Notes

- `.nojekyll` is included so GitHub Pages serves files exactly as-is.
- `404.html` mirrors the main page for GitHub Pages fallback behavior.
- `notion-embed.html` is a dedicated hub page for Notion embeds.
- `social-preview.svg` is used for Open Graph and Twitter share previews.
- `commands-data.json` stores command/marker voice text and powers random audio picks.
- If you later add custom domains, update GitHub Pages settings accordingly.
- Some Notion mobile views may show reduced viewport space, but features still work inside the embed.
- Completion checkboxes and preferences use browser local storage, so they are device/browser specific.

## Post-Deploy Validation Checklist

- Open your GitHub Pages URL in desktop and mobile.
- Confirm command search works (`Ctrl+K`) and filters table rows.
- Confirm section highlighting updates while scrolling.
- Confirm hamburger nav works on small screens.
- Confirm audio buttons appear in command tables and marker cards.
- Confirm Audio Coach speaker icon opens panel and `Voice test` works.
- Confirm Dutch / English / Both mode switching works.
- Confirm Dutch/English voice selectors populate and can switch voices.
- Confirm the page embeds in Notion using `/embed` and the hosted URL.

## Update workflow (local + GitHub)

Use this when you make future edits:

1. Edit files locally (`index.html`, `styles.css`, `app.js`, `README.md`).
2. Preview locally by opening `index.html`.
3. Commit and push:
   - `git add .`
   - `git commit -m "your message"`
   - `git push`
4. Wait for GitHub Pages deploy (usually under 1 minute).
5. Refresh the live URL:
   - `https://kissmeh02.github.io/dutch-shepherd-training-bible/`
