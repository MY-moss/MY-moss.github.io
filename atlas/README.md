# ATLAS — Public Intelligence Library

Live: https://my-moss.github.io/atlas/

Four public channels: world, reading, opensource, inspiration. The weekly personal knowledge review remains private to ChatGPT and is never published.

Canonical feed: inspiration/data/index.json. The Pages build copies the validated feed into atlas/data/index.json so the ATLAS Service Worker can cache it within its own scope. JSON contracts are in feed.schema.json and report.schema.json.

Features: search, four-channel navigation, chronological archive, local bookmarks/read markers, theme switching, responsive layout, PWA manifest, versioned Service Workers and offline feed caching. Open-source project details are being upgraded in the next application pass.

Node.js 22: npm install, npm run prepare:feed, npm run validate, npm run test:e2e. Pages deployment waits for schema, privacy and Playwright tests.

Never publish credentials, private conversations, personal knowledge reviews, contact details, school/health records, private paths, unpublished user material or private project notes. Bookmarks and read status stay in local browser storage.
