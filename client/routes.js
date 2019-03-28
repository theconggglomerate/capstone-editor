import React, {Component} from 'react'
import {connect} from 'react-redux'
import {withRouter, Route, Switch} from 'react-router-dom'
import {Redirect} from 'react-router'
import PropTypes from 'prop-types'
import {
  Login,
  Signup,
  UserHome,
  SingleNote,
  CodeEditor,
  MarkdownEditor,
  Editor,
  SingleWeb
} from './components'
import {fetchNotes, me} from './store'
import {Container, Image} from 'semantic-ui-react'
import MyApp from './components/d3Base'
import SearchResults from './components/SearchResults'

/**
 * COMPONENT
 */
class Routes extends Component {
  componentDidMount() {
    this.props.loadInitialData()
  }

  render() {
    const {isLoggedIn} = this.props

    return (
      <Switch>
        {/* Routes placed here are available to all visitors */}
        <Route
          exact
          path="/"
          render={() =>
            isLoggedIn ? (
              <Redirect to="/visual" />
            ) : (
              <Container fluid style={{height: '50vh'}}>
                <Image
                  centered
                  verticalAlign="middle"
                  style={{height: '100px'}}
                  src="/logo.png"
                />
              </Container>
            )
          }
        />
        <Route exact path="/login" component={Login} />
        <Route exact path="/signup" component={Signup} />
        <Route exact path="/visual" component={MyApp} />
        <Route
          path="/visual/:id"
          render={props => <SingleWeb {...props} key={props.match.params.id} />}
        />
        {isLoggedIn && (
          <Switch>
            {/* Routes placed here are only available after logging in */}
            <Route exact path="/home" component={UserHome} />
            <Route path="/notes/:noteId" component={SingleNote} />
            <Route path="/search/" component={SearchResults} />
            <Route exact path="/editor" component={Editor} />
            <Route path="/editor/:noteId" component={Editor} />
            <Route exact path="/code-editor" component={CodeEditor} />
            <Route exact path="/markdown-editor" component={MarkdownEditor} />
          </Switch>
        )}
      </Switch>
    )
  }
}

/**
 * CONTAINER
 */
const mapState = state => {
  return {
    // Being 'logged in' for our purposes will be defined has having a state.user that has a truthy id.
    // Otherwise, state.user will be an empty object, and state.user.id will be falsey
    isLoggedIn: !!state.user.id
  }
}

const mapDispatch = dispatch => {
  return {
    loadInitialData() {
      dispatch(me())
    }
  }
}

// The `withRouter` wrapper makes sure that updates are not blocked
// when the url changes
export default withRouter(connect(mapState, mapDispatch)(Routes))

/**
 * PROP TYPES
 */
Routes.propTypes = {
  loadInitialData: PropTypes.func.isRequired,
  isLoggedIn: PropTypes.bool.isRequired
}
