import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {SearchBar} from './../components'
import {withRouter} from 'react-router'
import {logout} from '../store/user'
import {ReactiveBase} from '@appbaseio/reactivesearch'
import {Button, Image} from 'semantic-ui-react'

const Navbar = ({handleClick, isLoggedIn, history}) => {
  const url = window.location.pathname
  return (
    <div className="nav">
      <nav>
        {isLoggedIn ? (
          <div>
            {/* The navbar will show these links after you log in */}
            <Button
              style={{margin: '1.5em 1em 1.5em 2.5em'}}
              inverted={true}
              className="buttonMarg"
              href="#"
              onClick={handleClick}
            >
              Logout
            </Button>
            <Button
              style={{margin: '1.5em 1em 1.5em 1em'}}
              inverted={true}
              className="buttonMarg"
              onClick={() => {
                history.push('/editor')
              }}
            >
              Current Note
            </Button>

            <Image
              style={{marginTop: '1em', marginLeft: '21em'}}
              verticalAlign="top"
              src="/imgs/cosomnote.png"
              size="large"
              href="/visual"
            />

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
            <Button
              style={{margin: '1.5em 1em 1.5em 1em'}}
              className="buttonMarg"
              inverted={true}
              onClick={() => {
                history.push('/login')
              }}
            >
              Login
            </Button>
            <Button
              style={{margin: '1.5em 1em 1.5em 1em'}}
              className="buttonMarg"
              inverted={true}
              onClick={() => {
                history.push('/signup')
              }}
            >
              Sign Up
            </Button>
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
