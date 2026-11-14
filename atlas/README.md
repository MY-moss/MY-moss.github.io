# ATLAS — Personal Intelligence Library

ATLAS is a private-content, static-site reading and knowledge dashboard hosted at:

- Site shell: https://my-moss.github.io/atlas/
- Frontend repository: https://github.com/MY-moss/MY-moss.github.io
- Private content repository (to be created): `MY-moss/atlas-data`

## Security model

The current GitHub Pages repository is a public, user-owned repository. GitHub Pages does **not** become private merely because a repository is private. Native private GitHub Pages publishing requires an organization using GitHub Enterprise Cloud and an organization-owned project repository.

To preserve the requested GitHub Pages deployment while keeping the actual reading data private, ATLAS uses two repositories:

1. The public Pages repository contains only the static frontend shell and no personal feed content.
2. `MY-moss/atlas-data` must be a **private** repository. It stores all five information streams.
3. The browser requires a fine-grained GitHub token restricted to that one private repository. It verifies that the authenticated GitHub account is exactly `MY-moss`, verifies that the data repository is private, and reads its contents. The token is kept in the current tab's sessionStorage and is sent only to api.github.com. GitHub documents that `GET /user` supports fine-grained tokens without extra permissions; repository metadata requires Metadata: read, and content reads require Contents: read.
4. Do not add collaborators to the private data repository if access must remain exclusive to the owner.
5. Never commit tokens, credentials, personal notes, or unencrypted private data to this public repository.

This is an application-level access gate for private data, not HTTP-layer private hosting. The login shell itself and frontend assets are public. For strict network-level privacy of the entire site, use GitHub Enterprise Cloud private Pages for an organization-owned repository, or put a trusted access proxy in front of Pages.

## Five information streams

| ID | Stream | Cadence | Data path |
|---|---|---|---|
| world | Daily world news brief | Daily 09:00 | `data/feeds/world/YYYY-MM-DD.json` |
| reading | Daily curated reading | Daily 19:00 | `data/feeds/reading/YYYY-MM-DD.json` |
| opensource | Open-source project radar | Saturday 14:00 | `data/feeds/opensource/YYYY-Www.json` |
| inspiration | Daily inspiration collection | Daily 12:30 | `data/feeds/inspiration/YYYY-MM-DD.json` |
| knowledge | Weekly knowledge review | Sunday 19:00 | `data/feeds/knowledge/YYYY-Www.json` |

Times are shown in the user's existing Asia/Shanghai task configuration. The existing scheduled tasks must be updated to write their results to the private data repository before automatic publication is complete.

## Data format

Each file is UTF-8 JSON. Common envelope:

```json
{
  "schema_version": 1,
  "stream": "reading",
  "date": "2026-11-15",
  "title": "今日精选阅读",
  "summary": "A concise introduction to this issue.",
  "items": [
    {
      "title": "Article title",
      "author": "Author",
      "source": "Publisher",
      "published_at": "2026-11-14",
      "url": "https://example.com/article",
      "reading_minutes": 12,
      "access": "free",
      "priority": "强烈推荐",
      "tags": ["文化", "历史"],
      "summary": "What the article is about.",
      "why_read": "Why it deserves attention."
    }
  ],
  "sources": [
    {"name": "Publisher", "url": "https://example.com"}
  ]
}
```

Stream-specific item fields are allowed. For example, world news may add `confidence` and `why_important`; open-source projects may add `repo_url`, `language`, `maturity` and `risks`; inspiration entries may add `creator`, `what_works` and `takeaways`; knowledge reviews may add `highlights`, `trends`, `people_projects`, `saved_sources` and `next_week`.

## First-time setup required

1. Create a new GitHub repository named `atlas-data` under `MY-moss`.
2. Set repository visibility to **Private**. Do not add collaborators.
3. Add these paths with a `.gitkeep` file in each folder:
   - `data/feeds/world/.gitkeep`
   - `data/feeds/reading/.gitkeep`
   - `data/feeds/opensource/.gitkeep`
   - `data/feeds/inspiration/.gitkeep`
   - `data/feeds/knowledge/.gitkeep`
4. Create a fine-grained personal access token restricted to only `MY-moss/atlas-data`, with **Contents: Read-only** and Metadata read access. Do not grant write access to the browser token.
5. Paste the token into the ATLAS login screen. The token is held in sessionStorage for the current tab only.
6. The ChatGPT GitHub connection will be used by the scheduled feed tasks to write JSON files to the private repository. The site reads the private repository dynamically when the user opens or refreshes ATLAS, so feed updates do not require rebuilding the public frontend. Those tasks still need their prompts updated and the repository to exist before they can publish.

## Publishing

The existing `.github/workflows/pages.yml` workflow uploads the repository root to GitHub Pages on pushes to `main`. The ATLAS site lives under `/atlas/`, so it does not replace the existing homepage. Every frontend commit to `main` triggers the existing Pages deployment workflow.

## Current implementation boundary

- Implemented: responsive dashboard shell, five stream sections, archive, search, local bookmarks/read markers, theme toggle, private-repository token gate, private GitHub Contents API reader.
- Pending: create the private `atlas-data` repository; seed its five feed folders; update the five existing ChatGPT automations to publish JSON files; re-enable the two paused tasks; run end-to-end tests against real private feed data.
- Not implemented: native GitHub Pages HTTP-level private publishing. This cannot be enabled on the current personal-account repository under standard GitHub Pages.
