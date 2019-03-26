import React, {Component} from 'react'
import LoadingOverlay from 'react-loading-overlay'
import {Modal, Popup, Sidebar} from 'semantic-ui-react'
import {Link} from 'react-router-dom'
import {SingleNote} from './../components/'

class LinkPreview extends Component {
  constructor() {
    super()
    this.state = {
      modalOpen: false
    }
    this.openModal = this.openModal.bind(this)
    this.closeModal = this.closeModal.bind(this)
  }

  openModal() {
    console.log('Open!')
    this.setState({modalOpen: true})
    console.log('State equals: ', this.state.modalOpen)
  }

  closeModal() {
    console.log('Closed!')
    this.setState({
      modalOpen: false
    })
    console.log('State equals: ', this.state.modalOpen)
  }
  render() {
    const {previewedNote, title} = this.props
    return (
      // <div>
      //   <Modal open={this.state.modalOpen} style={{padding: '3em'}}>

      //     <LoadingOverlay active={true} spinner={true} className="loading" />
      //     This is a test
      //   </Modal>

      // </div>
      <div>
        <Sidebar
          // as={Menu}
          direction="left"
          animation="overlay"
          // icon="labeled"
          // inverted
          // onHide={this.handleSidebarHide}
          vertical
          visible={this.state.modalOpen}
          width="very wide"
        >
          <SingleNote noteId={previewedNote} />
        </Sidebar>
        <Link
          onMouseEnter={() => this.openModal()}
          onMouseLeave={() => this.closeModal()}
          to={`/notes/${previewedNote}`}
        >
          {title}
        </Link>
      </div>

      // <Popup
      //   on={['hover', 'click']}
      //   // flowing={true}
      //   keepInViewPort={true}
      //   positon="bottom center"
      //   content={<SingleNote noteId={previewedNote} />}
      //   trigger={<Link to={`/notes/${previewedNote}`}>{title}</Link>}
      // />
    )
  }
}

export default LinkPreview
