import React, { Component } from 'react'
import { Form } from 'react-bootstrap'

export default class InputForm extends Component {
  render() {
    return  (
      <Form>
      <Form.Group controlId="formGroupSongTitle">
        <Form.Control placeholder="Enter song title" />
      </Form.Group>
      <Form.Group controlId="formGroupArtist">
        <Form.Control placeholder="Enter artist" />
      </Form.Group>
    </Form>
    )
  }
}
