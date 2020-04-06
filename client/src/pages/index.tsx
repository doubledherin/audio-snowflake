import React, { Fragment } from 'react'
import { Router } from '@reach/router'

import AudioAnalysis from './audioAnalysis'
import { Button, Footer, PageContainer } from '../components'

export default function Pages() {
  return (
    <Fragment>
      <PageContainer>
        <Router primary={false} component={Fragment}>
          <AudioAnalysis path="/" />
        </Router>
      </PageContainer>
      <Footer />
    </Fragment>
  )
}
