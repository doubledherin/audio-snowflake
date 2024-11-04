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
    console.log(response);
    const data = await response.json();
    return data.tracks.items[0].id;
  } catch (error) {
    console.error("Error getting track id:", error);
  }
}

async function getTrackAudioFeatures(trackId: String) {
  const accessToken = await getToken();

  try {
    const response = await fetch(
      `https://api.spotify.com/v1/audio-features/${trackId}`,
      {
        method: "GET",
        headers: { Authorization: "Bearer " + accessToken },
      }
    );

    return await response.json();
  } catch (error) {
    console.error("Error getting audio features:", error);
  }
}

async function getTrackAudioAnalysis(trackId: String) {
  const accessToken = await getToken();

  try {
    const response = await fetch(
      `https://api.spotify.com/v1/audio-analysis/${trackId}`,
      {
        method: "GET",
        headers: { Authorization: "Bearer " + accessToken },
      }
    );

    return await response.json();
  } catch (error) {
    console.error("Error getting audio analysis:", error);
  }
}

async function getTrackData(trackName: String, trackArtist: String) {
  const trackId = await getTrackId(trackName, trackArtist);
  const audioFeatures = await getTrackAudioFeatures(trackId);
  const audioAnalysis = await getTrackAudioAnalysis(trackId);

  return { audioFeatures, audioAnalysis };
}

// DO I NEED ALL THESE?
export {
  getTrackId,
  getTrackAudioFeatures,
  getTrackAudioAnalysis,
  getTrackData,
};
