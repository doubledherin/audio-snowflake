import express, { Express } from "express";
import pkg from "body-parser";
const { json } = pkg;
import dotenv from "dotenv";
import * as path from "path";
import { fileURLToPath } from "url";
import * as fs from "fs";
import cors from "cors";

dotenv.config();

// TO DO: Switch to python 3
const app: Express = express();
app.use(cors());
const port = 3000;

app.use(json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const tokenFilePath = path.join(__dirname, "token.json");

async function getToken() {
  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    body: new URLSearchParams({
      grant_type: "client_credentials",
    }),
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization:
        "Basic " +
        Buffer.from(
          process.env.SPOTIFY_CLIENT_ID +
            ":" +
            process.env.SPOTIFY_CLIENT_SECRET
        ).toString("base64"),
    },
  });

  const data = await response.json();
  const accessToken = data.access_token;
  const tokenExpiryTime = Date.now() + data.expires_in * 1000; // expires_in is in seconds

  // Store access token and expiry time in a file
  // TO DO: Store in a database
  fs.writeFileSync(
    tokenFilePath,
    JSON.stringify({ accessToken, tokenExpiryTime })
  );

  return accessToken;
}

app.post("/run-token-script", async (_, res) => {
  try {
    const token = await getToken();
    res.json({ token });
  } catch (error) {
    console.error("Error getting token:", error);
    res.status(500).json({ error: "Failed to get token" });
  }
});

app.get("/get-track-info", async (req, res) => {
  const trackId = req.query.trackId;
  if (!trackId) {
    res.status(400).json({ error: "trackId is required" });
    return;
  }

  let accessToken = "";
  let tokenExpiryTime = 0;

  if (!accessToken || Date.now() >= tokenExpiryTime) {
    try {
      accessToken = await getToken();
      const tokenData = JSON.parse(fs.readFileSync(tokenFilePath, "utf-8"));
      accessToken = tokenData.accessToken;
      tokenExpiryTime = tokenData.tokenExpiryTime;
    } catch (error) {
      console.error("Error getting token:", error);
      res.status(500).json({ error: "Failed to get token" });
      return;
    }
  }

  try {
    const response = await fetch(
      `https://api.spotify.com/v1/tracks/${trackId}`,
      {
        method: "GET",
        headers: { Authorization: "Bearer " + accessToken },
      }
    );

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Error getting track info:", error);
    res.status(500).json({ error: "Failed to get track info" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
