import React, { Component } from 'react'

class InputForm extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      title: '',
      artist: ''
    }

    this.handleTitleChange = this.handleTitleChange.bind(this)
    this.handleArtistChange = this.handleArtistChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleTitleChange(event) {
    this.setState({
      title: event.target.value,
    })
  }

  handleArtistChange(event) {
    this.setState({
      artist: event.target.value,
    })
  }

  handleSubmit(event) {
    alert('An entry was submitted: ' + this.state.title  + " & " + this.state.artist);
    event.preventDefault();
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <input type="text" value={this.state.title} onChange={this.handleTitleChange} placeholder="Enter title"/>
        <input type="text" value={this.state.artist} onChange={this.handleArtistChange} placeholder="Enter artist"/>
        <input type="submit" value="Submit" />
      </form>
    );
  }
}

export default InputForm