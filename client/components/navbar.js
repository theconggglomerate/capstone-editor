import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {SearchBar} from './../components'
import {withRouter} from 'react-router'
import {logout} from '../store/user'
import {ReactiveBase} from '@appbaseio/reactivesearch'
import {Button, Image, Grid, Container} from 'semantic-ui-react'

const Navbar = ({handleClick, isLoggedIn, history}) => {
  const url = window.location.pathname
  return (
    // <div className="nav">
    <Container fluid>
      <nav>
        {isLoggedIn ? (
          <Grid verticalAlign="middle" columns="three">
            <Grid.Row textAlign="center">
              <Grid.Column floated="left" width="4">
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
              </Grid.Column>
              {/* <Sidebar /> */}
              <Grid.Column width="8">
                <Image
                  // style={{marginTop: '1em', marginLeft: '7.5em'}}
                  verticalAlign="top"
                  src="/imgs/cosomnote.png"
                  size="large"
                  href="/visual"
                />
              </Grid.Column>
              <Grid.Column floated="right" width="4">
                {url !== '/search' ? (
                  // <div className="search-Grid">
                  <ReactiveBase
                    app="notes"
                    url={`${window.location.origin}/api/es`}
                  >
                    <SearchBar />
                  </ReactiveBase>
                ) : (
                  // </div>
                  ''
                )}
              </Grid.Column>
            </Grid.Row>
            {/* The navbar will show these links after you log in */}
          </Grid>
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
            {/* <Button
              style={{margin: '1.5em 1em 1.5em 1em'}}
              className="buttonMarg"
              inverted={true}
              onClick={() => {
                history.push('/signup')
              }}
            >
              Sign Up
            </Button> */}
          </div>
        )}
      </nav>
    </Container>
  )
}

/**
 * Grid
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
