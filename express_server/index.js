import express from "express";

const app = express();

const MAX_DELAY = 300;
const MIN_DELAY = 100;
const DELAY =
  Math.floor(Math.random() * (MAX_DELAY - MIN_DELAY + 1)) + MIN_DELAY;

async function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

app.get("/*", async (_, res) => {
  console.log("request coming in");
  await delay(DELAY);
  return res.json("successful");
});

app.listen(3001, () => console.log("Beep Boop: listening on port 3001"));
