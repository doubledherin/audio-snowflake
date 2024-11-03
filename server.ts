import express, { Express } from "express";
import pkg from "body-parser";
const { json } = pkg;
import dotenv from "dotenv";
import * as path from "path";
import { fileURLToPath } from "url";
import * as fs from "fs";
import cors from "cors";
import { getToken } from "./src/spotify/tokenService";
import { getTrackId } from "./src/spotify/trackService";

dotenv.config();

// TO DO: Switch to python 3
const app: Express = express();
app.use(cors());
const port = 3000;

app.use(json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const tokenFilePath = path.join(__dirname, "src/spotify", "token.json");

app.post("/get-audio-features", async (req, res) => {
  let trackId = "";
  const { trackName, trackArtist } = req.body;
  if (!trackName && !trackArtist) {
    res.status(400).json({ error: "trackName or trackArtist is required" });
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
