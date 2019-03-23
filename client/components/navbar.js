import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'
import {SearchBar} from './../components'
import {withRouter} from 'react-router'
import {logout} from '../store/user'
import {ReactiveBase} from '@appbaseio/reactivesearch'

const Navbar = ({handleClick, isLoggedIn}) => {
  const url = window.location.pathname
  return (
    <div className="nav">
      <nav>
        {isLoggedIn ? (
          <div>
            {/* The navbar will show these links after you log in */}
            <a className="buttonMarg" href="#" onClick={handleClick}>
              Logout
            </a>

            <Link className="buttonMarg" to="/visual">
              Visual
            </Link>
            <Link className="buttonMarg" to="/editor/new">
              New Note
            </Link>
            {/* <Link className="buttonMarg" to="/home">
            Search
          </Link> */}
            {url !== '/search' ? (
              <div className="search-container">
                <ReactiveBase
                  app="notes"
                  url={process.env.BONSAI_URL || 'http://localhost:9200'}
                >
                  <SearchBar />
                </ReactiveBase>
              </div>
            ) : (
              ''
            )}
          </div>
        ) : (
          <div>
            {/* The navbar will show these links before you log in */}
            <Link to="/login">Login</Link>
            <Link to="/signup">Sign Up</Link>
          </div>
        )}
      </nav>
    </div>
  )
}

/**
 * CONTAINER
 */
const mapState = state => {
  return {
    isLoggedIn: !!state.user.id
  }
}

const mapDispatch = dispatch => {
  return {
    handleClick() {
      dispatch(logout())
    }
  }
}

export default withRouter(connect(mapState, mapDispatch)(Navbar))

/**
 * PROP TYPES
 */
Navbar.propTypes = {
  handleClick: PropTypes.func.isRequired,
  isLoggedIn: PropTypes.bool.isRequired
}
