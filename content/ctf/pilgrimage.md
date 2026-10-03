---
id: ctf-pilgrimage
name: Pilgrimage
event: Hack The Box
type: ctf event
difficulty: easy
tags: ["CVE", "ImageMagick", "file-read", "cron", "Linux"]
writeupHref: "#"
order: 1
---
Exploited a path traversal in ImageMagick (CVE-2022-44268) to read arbitrary files, then leveraged a cron running as root to escalate privileges.
