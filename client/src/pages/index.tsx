import React, { Fragment } from 'react'
import { Router } from '@reach/router'

import { Footer, PageContainer } from '../components'

export default function Pages() {
  return (
    <Fragment>
      <PageContainer>
        <Router primary={false} component={Fragment}>
        </Router>
      </PageContainer>
      <Footer />
    </Fragment>
  )
}
