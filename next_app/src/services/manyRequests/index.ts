/**
 * This service is here in an attempt to reporduce a bug in a production next JS application
 *
 * The nature of the bug looks like a memory leak except the leak doesn't occur unitl a route is
 * hit. So this service will represent the manyRequests that are sent by our sync function
 */

import { delay, dynamicUrlGenerator } from "@/utilities/serviceUtilities";

async function sendRequest() {
  try {
    const randomString = dynamicUrlGenerator(1000);
    const url = "http://localhost:3001/" + randomString;
    const response = await fetch(url, {
      cache: "no-store",
    });
    if (response.ok) {
      const data = await response.json();
      console.log(data);
      return;
    } else {
      console.log("response not ok", response);
    }
  } catch (error) {
    console.error("sendRequest error:", error);
  }
}

export async function start() {
  let i = 0;
  console.log("Starting manyRequests background service");
  while (i < 10000) {
    await sendRequest();
    await delay(5);
    i++;
  }
}
