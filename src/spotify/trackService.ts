import { getToken } from "./tokenService";

async function getTrackId(trackName: String, trackArtist: String) {
  const accessToken = await getToken();

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
