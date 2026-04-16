# Dutch Shepherd Training Bible

A complete, interactive Dutch Shepherd training reference page with:
- 70+ commands and cues
- pronunciation and notes
- puppy roadmap
- body language guide
- handler rules and breed-specific notes
- search, filters, mobile menu, and scroll-spy navigation
- audio coach with Dutch / English / Both playback modes
- trainer mode, random command practice, and repeat-last playback
- command dataset file: `commands-data.json` (Dutch voice text + command metadata)
- production-ready split assets: `styles.css` and `app.js`

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

1. In Notion, type `/embed`.
2. Paste your GitHub Pages URL.
3. Resize the embed block for best viewing.

## Notes

- `.nojekyll` is included so GitHub Pages serves files exactly as-is.
- `404.html` mirrors the main page for GitHub Pages fallback behavior.
- `social-preview.svg` is used for Open Graph and Twitter share previews.
- `commands-data.json` stores command/marker voice text and powers random audio picks.
- If you later add custom domains, update GitHub Pages settings accordingly.
- Some Notion mobile views may show reduced viewport space, but features still work inside the embed.

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
