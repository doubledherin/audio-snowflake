import React, { useState } from "react";

const Input = () => {
  const [trackId, setTrackId] = useState("");

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const response = await fetch(
      `http://localhost:3000/get-track-info?trackId=${trackId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const result = await response.json();

    console.log(result);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Track ID"
        value={trackId}
        onChange={(e) => setTrackId(e.target.value)}
      />
      <button type="submit">Submit</button>
    </form>
  );
};

export default Input;
