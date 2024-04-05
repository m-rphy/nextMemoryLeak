let started = false
import { start } from "@/services/manyRequests"

export async function GET() {
  if (started == false) {
    start()
    started = true
  }
  return new Response(null, { status: 200 })
}