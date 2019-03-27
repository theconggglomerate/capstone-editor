import React, {Component} from 'react'
import LoadingOverlay from 'react-loading-overlay'
import {Sidebar, Container} from 'semantic-ui-react'
import {Link} from 'react-router-dom'
import {LinkPreviewNote} from './../components/'

class LinkPreview extends Component {
  constructor() {
    super()
    this.state = {
      sidebarOpen: false,
      noteShouldLoad: false,
      noteLoaded: false
    }
    this.openSidebar = this.openSidebar.bind(this)
    this.closeSidebar = this.closeSidebar.bind(this)
    this.toggleLoader = this.toggleLoader.bind(this)
  }
  openSidebar() {
    this.setState({sidebarOpen: true})
  }
  closeSidebar() {
    this.setState({
      sidebarOpen: false
    })
  }

  toggleLoader() {
    this.setState({
      noteLoaded: true
    })
  }
  render() {
    const {previewedNote, title} = this.props
    return (
      <React.Fragment>
        <Sidebar
          direction="left"
          animation="overlay"
          visible={this.state.sidebarOpen}
          onShow={() => this.setState({noteShouldLoad: true})}
          onHide={() =>
            this.setState({
              noteShouldLoad: false,
              noteLoaded: false
            })
          }
        >
          {!this.state.noteLoaded && (
            <Container className="loaderContainer">
              <LoadingOverlay
                active={true}
                spinner={<img src="/loader.png" className="cosmonoteLoader" />}
              />
            </Container>
          )}
          {this.state.noteShouldLoad && (
            <LinkPreviewNote
              noteId={previewedNote}
              toggleLoader={this.toggleLoader}
            />
          )}
        </Sidebar>
        <Link
          onMouseEnter={() => this.openSidebar()}
          onMouseLeave={() => this.closeSidebar()}
          to={`/notes/${previewedNote}`}
        >
          {title}
        </Link>
      </React.Fragment>
    )
  }
}

export default LinkPreview
