import express, { Express } from "express";
import pkg from "body-parser";
import dotenv from "dotenv";
import cors from "cors";
import { getToken } from "./src/spotify/tokenService";
import { getTrackId } from "./src/spotify/trackService";

dotenv.config();

// TO DO: Switch to python 3
const app: Express = express();
const port = 3000;
app.use(cors());
app.use(pkg.json());

app.post("/get-audio-features", async (req, res) => {
  const { trackName, trackArtist } = req.body;
  if (!trackName && !trackArtist) {
    res.status(400).json({ error: "trackName or trackArtist is required" });
    return;
  }
  let trackId = "";

  // Get trackId from Spotify
  try {
    trackId = await getTrackId(trackName, trackArtist);
  } catch (error) {
    console.error("Error getting trackId:", error);
    res.status(500).json({ error: "Failed to get trackId" });
  }

  // Use trackId to get audio features from Spotify
  try {
    const accessToken = await getToken();
    const response = await fetch(
      `https://api.spotify.com/v1/audio-features/${trackId}`,
      {
        method: "GET",
        headers: { Authorization: "Bearer " + accessToken },
      }
    );
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
