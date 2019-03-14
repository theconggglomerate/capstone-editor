import React from 'react'
import {ReactiveBase} from '@appbaseio/reactivesearch'

import {Navbar} from './components'
import Routes from './routes'

const App = () => {
  return (
    <ReactiveBase app="notes" url="http://localhost:9200">
      <Navbar />
      <Routes />
    </ReactiveBase>
  )
}

export default App
