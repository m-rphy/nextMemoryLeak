let started = false;
import { start } from "@/services/genericHttpManyRequests";

export async function GET() {
  if (started == false) {
    console.log("starting geericHttpManyRequest service");
    start();
    started = true;
  }
  return new Response(null, { status: 200 });
}
