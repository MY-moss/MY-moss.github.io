# ATLAS — Public Intelligence Library

Website: https://my-moss.github.io/atlas/

ATLAS is now a **public GitHub Pages site**. The public reader does not require a GitHub account or personal access token.

Five content streams: `world` (daily news), `reading` (daily curated reading), `inspiration` (daily creative inspiration), `opensource` (weekly GitHub radar), and `knowledge` (weekly synthesis).

## Content storage

The canonical public dataset is `inspiration/data/index.json` in the same repository. Both `/atlas/` and the existing `/inspiration/` site consume it. The index must retain `schemaVersion`, `updatedAt`, `channels[]` and `reports[]`. Each report has `channel`, `date`, `title`, `summary`, `items[]`, and optional `sections[]`. Upsert key: `channel + date`.

The five ChatGPT scheduled reports publish through GitHub Contents API using the latest blob SHA. A successful commit automatically invokes the existing GitHub Pages deployment workflow. The site automatically reloads the public JSON index every five minutes.

## Safety

Never publish API tokens, private user notes, health records, school information, unpublished personal project materials, or other private details. No credential input or private data source exists in the public frontend. Reader bookmarks, read markers and theme preferences stay in the local browser only.

## Check

```sh
node --check atlas/config.js
node --check atlas/app.js
node atlas/scripts/validate.mjs
```

Deployment is handled by `.github/workflows/pages.yml` on changes to `main`. This project lives entirely under `atlas/`, preserving the existing homepage and other sub-sites.

See `atlas/automation-spec.md` for the publication contract.
