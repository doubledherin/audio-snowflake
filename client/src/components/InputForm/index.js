import React, { useState } from 'react'

function InputForm() {
  const [title, setTitle] = useState('')
  const [artist, setArtist] = useState('')
  
  return (
    <form >
      <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Enter title"/>
      <input type="text" value={artist} onChange={(e) => setArtist(e.target.value)} placeholder="Enter artist"/>
      <input type="submit" value="Submit" />
    </form>
  )
}

export default InputForm