import React from 'react'
import Visual from './Visual'
import {connect} from 'react-redux'
import {fetchElements} from '../store/elements'
import {getModal, turnOffModal, loadPage} from '../store'

class MyApp extends React.Component {
  constructor(props) {
    super(props)
    this.webClick = this.webClick.bind(this)
    this.editClick = this.editClick.bind(this)
  }

  componentDidMount = () => {
    this.props.getElements()
  }

  webClick = id => {
    this.props.history.push(`/visual/${id}`)
  }

  editClick = id => {
    this.props.history.push(`/editor/${id}`)
  }
  render() {
    if (this.props.allElements) {
      const elements = this.props.allElements

      return (
        <React.Fragment>
          <Visual
            elements={elements}
            webClick={this.webClick}
            editClick={this.editClick}
            getModal={this.props.getModal}
            modal={this.props.modal}
            closeModal={this.props.closeModal}
            loadPage={this.props.loadPage}
          />
        </React.Fragment>
      )
    } else {
      return ''
    }
  }
}

const mapStateToProps = state => ({
  allElements: state.elements.allElements,
  modal: state.modal
})

const mapDispatchToProps = dispatch => ({
  getElements: () => {
    dispatch(fetchElements())
  },
  getModal: id => {
    dispatch(getModal(id))
  },
  closeModal: () => {
    dispatch(turnOffModal())
  },
  loadPage: () => {
    dispatch(loadPage())
  }
})
export default connect(mapStateToProps, mapDispatchToProps)(MyApp)
