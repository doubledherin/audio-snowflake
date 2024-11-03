import React, { useState } from "react";

const Input = () => {
  const [trackId, setTrackId] = useState("");

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const response = await fetch("http://localhost:3000/run-token-script", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ trackId }),
    });
    // debugger;
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
