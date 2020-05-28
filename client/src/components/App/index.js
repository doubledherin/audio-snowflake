import React, { Component } from 'react'

import Home from '../../pages/Home'
import './index.scss'

export default class App extends Component {
  
  render() {
    return  (
      <div className="App bg-black container-fluid">
        <div id="main">
          <Home />
        </div>
      </div>
    )
  }
}
