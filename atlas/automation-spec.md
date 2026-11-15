# ATLAS public publishing contract

Canonical feed: inspiration/data/index.json. Generated ATLAS copy: atlas/data/index.json. Public channels: world, reading, opensource, inspiration only.

The weekly personal knowledge review is private to ChatGPT. Never publish, summarize, excerpt, upload or copy it into a public channel.

Reports use {channel,date,title,summary,items[]}; items require stable id and title. Open-source items should include verified stack, maturity, difficulty, license, risks, recommendation, uses, project_fit, version, stars and platforms where available. Missing values must be labelled unverified, never guessed.

Fetch latest feed and SHA; preserve all reports; upsert by channel + date; sort descending; update updatedAt; write with latest SHA; on conflict refetch and merge. Reject knowledge. Never publish private chat summaries, personal memory/profile, health/school/address/contact details, account data, credentials, local paths, unpublished project material or private notes. Source URLs must be HTTPS.
