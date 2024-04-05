## nextMemoryLeak

This repo reproduces a memory leak within a production application in a minimal way.

The issue arises within a syncing process that sends many request with urls that are ~1000 characters in length.

This repo contains a toy express server and very simple next application.

The express server has a singe catch-all route with simulated network latency.

The next application has a single service and that simply sends requests to the toy service over and over again.
