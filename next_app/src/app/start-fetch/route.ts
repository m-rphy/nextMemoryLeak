let started = false;
import { start } from "@/services/manyRequests";

export async function GET() {
  if (started == false) {
    console.log("starting manyRequest service");
    start();
    started = true;
  }
  return new Response(null, { status: 200 });
}
