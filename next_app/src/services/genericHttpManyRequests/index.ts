import { delay, dynamicUrlGenerator } from "@/utilities/serviceUtilities";
import * as http from "http";

/**
 * This service is here in an attempt triangluate the issue with out going requests
 */

interface FetchOptions {
  method: string
  headers?: http.OutgoingHttpHeaders
  body?: any
}

function customFetch(url: string, options: FetchOptions): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    const req = http.request(url, options, (res) => {
      let responseData = ""

      res.setEncoding("utf8")

      res.on("data", (chunk) => {
        responseData += chunk
      })

      res.on("end", () => {
        resolve(responseData)
      })
    })

    req.on("error", (error) => {
      reject(error)
    })

    if (options.body) {
      req.write(options.body)
    }

    req.end()
  })
}

async function sendRequest() {
  try {
    const randomUrlToken = dynamicUrlGenerator(1000)
    const url = "http://localhost:3001/" + randomUrlToken
    const options: FetchOptions = {
      method: "GET",
    };
    const responseData = await customFetch(url, options)
    console.log("Response:", responseData)
  } catch (error) {
    console.error("sendRequest error:", error)
  }
}

export async function start() {
  let i = 0
  console.log("Starting genericHttpManyRequests background service")
  while (i < 10000) {
    await sendRequest()
    await delay(5)
    i++
  }
}
