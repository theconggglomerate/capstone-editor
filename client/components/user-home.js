import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {SearchBar} from './../components'
import {ReactiveBase} from '@appbaseio/reactivesearch'

/**
 * COMPONENT
 */
export const UserHome = () => {
  return (
    <div
      style={{
        backgroundColor: '#0F2027',
        height: '100vh',
        color: '#4182C4',
        padding: '5em'
      }}
    >
      <ReactiveBase app="notes" url={`${window.location.origin}/api/es`}>
        <SearchBar />
      </ReactiveBase>
    </div>
  )
}

/**
 * CONTAINER
 */
const mapState = state => {
  return {
    email: state.user.email
  }
}

export default connect(mapState)(UserHome)

/**
 * PROP TYPES
 */
UserHome.propTypes = {
  email: PropTypes.string
}
