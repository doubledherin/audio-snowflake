import React, { Component } from 'react'
import P5Wrapper from "../P5Wrapper/"
import logo from '../../logo.svg'
import './index.css'

export default class App extends Component {
  constructor() {
    super()

    this.state = {
      p5Props: {
        status: ""
      },
    }
  }
  render() {
    return  (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </header>
        <P5Wrapper
              className="P5-wrapper"
              {...this.state.p5Props}
              onReady={this.onReady}
            />
      </div>
    )
  }
}
