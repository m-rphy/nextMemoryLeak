export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const manyRequests = await import("@/services/manyRequests")
    manyRequests.start()
  }
}
