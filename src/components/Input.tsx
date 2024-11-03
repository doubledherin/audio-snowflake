import React, { useState } from "react";

const Input = () => {
  const [trackName, setTrackName] = useState("");
  const [trackArtist, setTrackArtist] = useState("");

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const response = await fetch(
      `http://localhost:3000/get-audio-features?trackName=${trackName}&trackArtist=${trackArtist}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ trackName, trackArtist }),
      }
    );
    const result = await response.json();

    console.log(result);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Track Name"
        value={trackName}
        onChange={(e) => setTrackName(e.target.value)}
      />
      <input
        type="text"
        placeholder="Track Artist"
        value={trackArtist}
        onChange={(e) => setTrackArtist(e.target.value)}
      />
      <button type="submit">Submit</button>
    </form>
  );
};

export default Input;
