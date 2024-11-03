import { getToken } from "./tokenService";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const tokenFilePath = path.join(__dirname, "token.json");

// QUESTION: Pass token as a parameter?
async function getTrackId(trackName: String, trackArtist: String) {
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

export { getTrackId };
