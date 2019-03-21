import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {SearchBar} from './../components'
import {ReactiveBase} from '@appbaseio/reactivesearch'

/**
 * COMPONENT
 */
export const UserHome = props => {
  const {email} = props

  return (
    <div>
      <h3> Welcome, {email} </h3>
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
