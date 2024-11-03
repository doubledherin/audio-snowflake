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
    <div className="relative">
      <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-10/12 pb-2 sm:left-auto sm:right-0 sm:translate-x-0 sm:pr-2 sm:w-1/3">
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col">
            <input
              className="text-center mb-1 rounded"
              type="text"
              placeholder="Track Name"
              value={trackName}
              onChange={(e) => setTrackName(e.target.value)}
            />
            <input
              className="text-center mb-1 rounded"
              type="text"
              placeholder="Track Artist"
              value={trackArtist}
              onChange={(e) => setTrackArtist(e.target.value)}
            />
            <button className="bg-white rounded" type="submit">
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Input;
