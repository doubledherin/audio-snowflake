import express, { Express } from "express";
import pkg from "body-parser";
import dotenv from "dotenv";
import cors from "cors";
import { getToken } from "./src/spotify/tokenService";
import {
  getTrackId,
  getTrackAudioFeatures,
  getTrackAudioAnalysis,
  getTrackData,
} from "./src/spotify/trackService";

dotenv.config();

// TO DO: Switch to python 3
const app: Express = express();
const port = 3000;
app.use(cors());
app.use(pkg.json());

// app.post("/get-audio-features", async (req, res) => {
//   const { trackName, trackArtist } = req.body;
//   if (!trackName && !trackArtist) {
//     res.status(400).json({ error: "trackName or trackArtist is required" });
//     return;
//   }
//   let trackId = "";

//   // Get trackId from Spotify
//   try {
//     trackId = await getTrackId(trackName, trackArtist);
//   } catch (error) {
//     console.error("Error getting trackId:", error);
//     res.status(500).json({ error: "Failed to get trackId" });
//   }

//   // Use trackId to get audio features from Spotify
//   try {
//     const audioFeatures = await getTrackAudioFeatures(trackId);
//     res.json(audioFeatures);
//   } catch (error) {
//     console.error("Error getting audio features:", error);
//     res.status(500).json({ error: "Failed to get audio features" });
//   }
// });

// app.post("/get-audio-analysis", async (req, res) => {
//   const { trackName, trackArtist } = req.body;
//   if (!trackName && !trackArtist) {
//     res.status(400).json({ error: "trackName or trackArtist is required" });
//     return;
//   }
//   let trackId = "";

//   // Get trackId from Spotify
//   try {
//     trackId = await getTrackId(trackName, trackArtist);
//   } catch (error) {
//     console.error("Error getting trackId:", error);
//     res.status(500).json({ error: "Failed to get trackId" });
//   }

//   // Use trackId to get audio analysis from Spotify
//   try {
//     const audioAnalysis = await getTrackAudioAnalysis(trackId);
//     res.json(audioAnalysis);
//   } catch (error) {
//     console.error("Error getting audio analysis:", error);
//     res.status(500).json({ error: "Failed to get audio analysis" });
//   }
// });

app.post("/get-track-data", async (req, res) => {
  const { trackName, trackArtist } = req.body;
  if (!trackName && !trackArtist) {
    res.status(400).json({ error: "trackName or trackArtist is required" });
    return;
  }

  try {
    const data = await getTrackData(trackName as string, trackArtist as string);
    res.json(data);
  } catch (error) {
    console.error("Error getting track data:", error);
    res.status(500).json({ error: "Failed to get track data" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
