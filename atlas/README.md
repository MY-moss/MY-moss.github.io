# ATLAS — Public Intelligence Library

Live: https://my-moss.github.io/atlas/

Four public channels: world, reading, opensource, inspiration. The weekly personal knowledge review remains private to ChatGPT and is never published.

Canonical feed: inspiration/data/index.json. The Pages build copies the validated feed into atlas/data/index.json so the ATLAS Service Worker can cache it within its own scope. JSON contracts are in feed.schema.json and report.schema.json.

Features: search, four-channel navigation, chronological archive, project and reading detail views, local bookmarks/read markers, theme switching, responsive layout, PWA manifest, build-hash-versioned assets and offline feed caching.

Access model: this is a **public GitHub Pages site with no login gate**. Only publish information that is safe for anyone to read. GitHub Pages on a public repository does not provide per-user authentication; if private login-only access is still required, move behind a real access-control layer (for example, Cloudflare Access on a controlled domain) before putting private content here.

Node.js 22: npm install, npm run prepare:feed, npm run validate, npm run test:e2e. Pages deployment waits for schema, privacy and Playwright tests.

Never publish credentials, private conversations, personal knowledge reviews, contact details, school/health records, private paths, unpublished user material or private project notes. Bookmarks and read status stay in local browser storage.
