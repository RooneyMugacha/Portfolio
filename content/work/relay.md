---
id: relay
title: Relay
tagline: A job queue that lives in the database you already run.
problem: Scheduled scripts failed silently, and nobody knew a job had been skipped until a customer noticed.
solution: Built a Go worker service on PostgreSQL with retries, exponential backoff, a dead-letter table, and per-tenant rate limits.
decision: Used Postgres with SKIP LOCKED instead of adding Redis, so a job is enqueued in the same transaction as the data that created it.
result: Failed jobs are visible and retried automatically, and a dashboard shows queue depth and job age.
stack: ["Go", "PostgreSQL", "OpenTelemetry", "Docker"]
githubUrl: "#"
notesUrl: "#notes"
order: 1
---
