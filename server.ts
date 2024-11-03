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
  // Check if token.json exists
  if (fs.existsSync(tokenFilePath)) {
    const tokenData = JSON.parse(fs.readFileSync(tokenFilePath, "utf8"));
    const { accessToken, tokenExpiryTime } = tokenData;

    // Check if the current token is still valid
    if (Date.now() < tokenExpiryTime) {
      return accessToken;
    }
  }

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

// QUESTION: Pass token as a parameter?
async function getTrackId(trackName, trackArtist) {
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
      return;
    }
  }

  try {
    const response = await fetch(
      `https://api.spotify.com/v1/search?q=${trackName} ${trackArtist}&type=track&limit=1`,
      {
        method: "GET",
        headers: { Authorization: "Bearer " + accessToken },
      }
    );

    const data = await response.json();
    return data.tracks.items[0].id;
  } catch (error) {
    console.error("Error getting track id:", error);
  }
}

app.post("/get-token", async (_, res) => {
  try {
    const token = await getToken();
    res.json({ token });
  } catch (error) {
    console.error("Error getting token:", error);
    res.status(500).json({ error: "Failed to get token" });
  }
});

app.post("/get-audio-features", async (req, res) => {
  let trackId = "";
  const { trackName, trackArtist } = req.body;
  if (!trackName) {
    res.status(400).json({ error: "trackName is required" });
    return;
  }

  try {
    trackId = await getTrackId(trackName, trackArtist);
  } catch (error) {
    console.error("Error getting trackId:", error);
    res.status(500).json({ error: "Failed to get trackId" });
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
      `https://api.spotify.com/v1/audio-features/${trackId}`,
      {
        method: "GET",
        headers: { Authorization: "Bearer " + accessToken },
      }
    );
    console.log(response);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Error getting audio features:", error);
    res.status(500).json({ error: "Failed to get audio features" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
