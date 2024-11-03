import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const tokenFilePath = path.join(__dirname, "token.json");

async function getToken() {
  try {
    if (fs.existsSync(tokenFilePath)) {
      const tokenData = JSON.parse(fs.readFileSync(tokenFilePath, "utf8"));
      const { accessToken, tokenExpiryTime } = tokenData;

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

    if (!response.ok) {
      throw new Error(`Failed to fetch token: ${response.statusText}`);
    }

    const data = await response.json();
    const accessToken = data.access_token;
    const tokenExpiryTime = Date.now() + data.expires_in * 1000;

    fs.writeFileSync(
      tokenFilePath,
      JSON.stringify({ accessToken, tokenExpiryTime })
    );

    return accessToken;
  } catch (error) {
    console.error("Error getting token:", error);
    throw error;
  }
}

export { getToken };
