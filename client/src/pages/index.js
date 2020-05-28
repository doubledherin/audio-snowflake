import React, { Fragment } from 'react'
import { Router } from '@reach/router'

import Home from './Home'

export default function Pages() {
  return (
    <Fragment>
      <Router component={Fragment}>
        <Home path="/" />
      </Router>
    </Fragment>
  )
}
