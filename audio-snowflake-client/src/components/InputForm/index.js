import React, { Component } from 'react'
import { Form, Button } from 'react-bootstrap'

export default class InputForm extends Component {
  render() {
    return  (
      <Form>
      <Form.Group controlId="formGroupSpotifyId">
        <Form.Control placeholder="Enter Spotify ID" />
      </Form.Group>
      <Form.Group controlId="formGroupSongTitle">
        <Form.Control placeholder="Enter song title" />
      </Form.Group>
      <Form.Group controlId="formGroupArtist">
        <Form.Control placeholder="Enter artist" />
      </Form.Group>
      <Button variant="outline-light float-right">Submit</Button>{' '}
    </Form>
    )
  }
}
