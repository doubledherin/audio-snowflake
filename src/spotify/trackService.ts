import { getToken } from "./tokenService";

// TO DO: https://developer.spotify.com/blog/2023-07-03-typescript-sdk

// // TO DO: Move these types elsewhere
// interface AudioFeatures {
//   // Define the properties of the audio features
// }

// interface AudioAnalysis {
//   // Define the properties of the audio analysis
// }

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

  const { sections } = audioAnalysis;
  console.log(sections);

  const combinedSections = combineSimilarSections(sections);
  console.log(combinedSections);
  return { audioFeatures, audioAnalysis, combinedSections };
}

// TO DO: Move this type elsewhere
interface CombinedSections {
  [key: string]: any; // or a more specific type instead of 'any'
}

// Groups sections by key, mode, and time signature, and sums their durations.
// Returns the 5 grouped sections with the longest summed duration.
function combineSimilarSections(sections: Array<any>) {
  const combinedSections: CombinedSections = {};
  // const combinedSection = { key: "", mode: "", timeSignature: 0, duration: 0 };

  for (let i = 1; i < sections.length; i++) {
    const section = sections[i];
    const lookupKey = `${section.key}${section.mode}${section.time_signature}`;

    // If the section already exists in the combinedSections object, add the duration to the existing section.
    if (combinedSections[lookupKey]) {
      combinedSections[lookupKey].duration += section.duration;
      // If the section does not exist in the combinedSections object, add it.
    } else {
      combinedSections[lookupKey] = {
        key: section.key,
        mode: section.mode,
        timeSignature: section.time_signature,
        duration: section.duration,
      };
    }
  }

  // Reduce to 5 sections with the longest summed duration
  const fiveLongest = Object.values(combinedSections)
    .sort((a, b) => b.duration - a.duration)
    .slice(0, 5);
  return fiveLongest;
}

// DO I NEED ALL THESE?
export {
  getTrackId,
  getTrackAudioFeatures,
  getTrackAudioAnalysis,
  getTrackData,
};
