import * as dotenv from "dotenv";
import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";

dotenv.config();

// TO DO: Store token in database
// QUESTION: How to handle rate limiting?
// check out https://mattbryanellison.medium.com/using-spotifys-client-credentials-authorization-flow-in-node-js-applications-ef3dcda91f78

const clientId = process.env.SPOTIFY_CLIENT_ID;
const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
const trackId = "4cOdK2wGLETKBW3PvgPWqT";

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
        Buffer.from(clientId + ":" + clientSecret).toString("base64"),
    },
  });

  const data = await response.json();
  const accessToken = data.access_token;
  const tokenExpiryTime = Date.now() + data.expires_in * 1000; // expires_in is in seconds

  // Store access token and expiry time in a file
  fs.writeFileSync(
    tokenFilePath,
    JSON.stringify({ accessToken, tokenExpiryTime })
  );
}

async function getTrackInfo(trackId: String) {
  let accessToken = "";
  let tokenExpiryTime = 0;

  if (!accessToken || Date.now() >= tokenExpiryTime) {
    await getToken();
    const tokenData = JSON.parse(fs.readFileSync(tokenFilePath, "utf-8"));
    accessToken = tokenData.accessToken;
    tokenExpiryTime = tokenData.tokenExpiryTime;
  }

  const response = await fetch(`https://api.spotify.com/v1/tracks/${trackId}`, {
    method: "GET",
    headers: { Authorization: "Bearer " + accessToken },
  });

  return await response.json();
}

// Refresh the token every 59 minutes (3540 seconds)
setInterval(async () => {
  await getToken();
}, 3540000);

getTrackInfo(trackId).then((profile) => {
  console.log(profile);
});
