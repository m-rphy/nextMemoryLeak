# nextMemoryLeak

This repo reproduces a memory leak within a production application in a minimal way. The issue arises within a syncing process that sends many request with urls that are ~1000 characters in length.

## Architecture

A toy Express server and a very simple Next.js application.

- The Express server has a singe catch-all route with simulated network latency.
- The Next.js application has two single services:
  Each service is the same except one implements the service with node's native fetch
  while the other uses a custom fetch that is implemented with http module.

- The Next.js application has two routes:
  Both begin the same general process however one uses node's native fetch to send the requests,
  while the other uses a very simple implementation of node's http module to send requests.

1. start-fetch
   - This route uses node's native fetch.
     \*This is the route that has memory issues that are discussed below.
2. start-custom-fetch
   - This route uses the custom http fetch.

## Recreating the issue

Since we are simulating network traffic, this process involves running two servers in two terminal.

1.  In one terminal and `cd` into the `/express_server` and run `npm start`

2.  In a sperate teminal `cd` in `/next_app` and run `npm run inspect`

3.  Using any browser go to either `http://localhost:3000/start-fetch` or `http://localhost:3000/start-custom-fetch` to begin the requests.

4.  Then open chrome inspect (`chrome://inspect`) or use any other debugging tools.

## Memory profile issues

A number of permutations have been tested with this repo.
Since the production code runs a never ending process we've recreated the memory leak
with a throttled infinit loop.

This first approach confirmed the creatation of the memory leak, but this could of been
an issue with our usage of Next.JS. Since we are triggering the sync process from a route,
we the possiblity that the issue stemmed from a never ending background process. The fact
that the backgroup process never ended means the route never closed and the scope the route
was called in never closed and hence never gets GC'd.

If this was the case, we simply needed to end the request process and have that scope close
completely. So we created an arbitrary number of requests (10_000), ran the request process over
looked to see if the memory was every GC'd. It isn't.

Upon inspecting the memory profile through snap-shots and heap allocation time lines, we cam across
an object that seems to be large and retained

## Infinite While Loop

![infiniteWhileLoop](./next_app/README_images/continuous-while-loop-no%20instrumentation.png)

## Interated While Loop

![iteratedWhileLoop](./next_app/README_images/iterator-while-looping.png)

This is not confirming that `fetchMetrics` is the culprit, but rather some implementation of global fetch.
Because when we use the http module, these memory problems disappear.

These are snap shots taken every ~1000 requests

![10_000FetchReq](./next_app/README_images/10_000FetchReq.png)

When we ran the exact same process, but used node's `http` module to handle the request, we took shots taken every ~500 requests:

![10_000FetchReq](./next_app/README_images/10_000HttpReq.png)

You can see further that there are no retained `fetchMetric` objects:

![iteratedWhileLoop_httpRequest](./next_app/README_images/heapAllocationHttpModule.png)

This is a screen shot of the heap allocation timeline for a single http request:

![10_000HeapAllocationTimeline](./next_app/README_images/singleHttpReqHeapAllocationTimeline.png)
