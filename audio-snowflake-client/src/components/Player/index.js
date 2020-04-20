import React, { Component } from 'react'

export default class Player extends Component {
  render() {
    const uri = "spotify:track:6B182GP3TvEfmgUoIMVUSJ" //TODO: take id from props
    const src = `https://embed.spotify.com/?uri=${uri}`
    return  (
      <div>
        <iframe src={src} width="250" height="80" frameBorder="0" allowtransparency="false"></iframe>
      </div>
    )
  }
}
