# ATLAS public publishing contract

Canonical feed: inspiration/data/index.json. Generated ATLAS copy: atlas/data/index.json. Public channels: world, reading, opensource, inspiration only.

The weekly personal knowledge review is private to ChatGPT. Never publish, summarize, excerpt, upload or copy it into a public channel.

Reports use {channel,date,title,summary,items[]}; each item must contain stable id, title, source, why, non-empty tags, and at least one HTTPS url/repo_url/website_url. Channel-specific fields are validated: inspiration requires creator/method/uses; world requires summary/confidence; reading requires author/published_at/reading_minutes/access; opensource requires stack/maturity/difficulty/risks/recommendation/license/uses/project_fit/version/stars/platforms. Unknown facts must be explicitly labelled 未核实, never guessed.

Fetch latest feed and SHA; preserve all reports; upsert by channel + date; sort descending; update updatedAt; write with latest SHA; on conflict refetch and merge. Reject knowledge. Never publish private chat summaries, personal memory/profile, health/school/address/contact details, account data, credentials, local paths, unpublished project material or private notes. Source URLs must be HTTPS.
