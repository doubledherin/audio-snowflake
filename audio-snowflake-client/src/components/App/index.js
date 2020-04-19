import React, { Component } from 'react'
import P5Wrapper from "../P5Wrapper/"
import logo from '../../logo.svg'
import './index.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import Header from '../Header'
import InputForm from '../InputForm'
import Player from '../Player'

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
        <Header />
        <P5Wrapper className="P5-wrapper" />
        <InputForm />
        <Player />
      </div>
    )
  }
}
