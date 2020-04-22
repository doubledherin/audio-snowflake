import React, { Component } from "react"
// import PropTypes from "prop-types"

import sketch from "./sketches/snowflake.js"

class P5Wrapper extends Component {
  static propTypes = {
    // onReady: PropTypes.func.isRequired,
  }

  componentDidMount() {
    this.canvas = new window.p5(sketch, "p5-canvas")
    // this.canvas.setOnReady(this.props.onReady)
  }
  
  shouldComponentUpdate() {
    return false
  }

  componentDidUpdate(nextProps) {
    this.canvas.pushProps(nextProps)
  }

  componentWillUnmount() {
    this.canvas.remove()
  }

  render() {
    return (
      <div id="p5-canvas" />
    )
  }
}

export default P5Wrapper
