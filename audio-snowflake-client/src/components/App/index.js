import React, { Component } from 'react'
import P5Wrapper from "../P5Wrapper/"
import './index.scss'
// import Navigation from '../Navigation'
// import InputForm from '../InputForm'
import Player from '../Player'

export default class App extends Component {
  
  render() {
    return  (
      <div className="App bg-black container-fluid">
        <div id="main">
          <P5Wrapper className="P5-wrapper" />
          <Player />
        </div>
      </div>
    )
  }
}
