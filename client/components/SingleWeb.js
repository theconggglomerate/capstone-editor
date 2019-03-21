import React from 'react'
import CytoscapeComponent from 'react-cytoscapejs'
import Visual from './Visual'
import {connect} from 'react-redux'
import {fetchSingleWeb} from '../store/elements'
import {getModal, turnOffModal, loadPage} from '../store'

export class SingleWeb extends React.Component {
  constructor(props) {
    super(props)
    this.webClick = this.webClick.bind(this)
    this.editClick = this.editClick.bind(this)
    this.expandClick = this.expandClick.bind(this)
  }

  componentDidMount = () => {
    const id = this.props.match.params.id
    this.props.getSingleWeb(id)
  }

  componentDidUpdate = prevprops => {
    const currentId = this.props.match.params.id
    const prevId = prevprops.match.params.id
    if (currentId !== prevId) {
      this.props.getSingleWeb(currentId)
    }
  }

  webClick = id => {
    this.props.history.push(`/visual/${id}`)
  }

  editClick = id => {
    this.props.history.push(`/editor/${id}`)
  }

  expandClick = id => {
    // console.log('NODE LIST', this.props.singleWebElements.nodes)
    // this.props.getSingleWeb(id)

    this.props.singleWebElements.nodes.push()
    this.props.singleWebElements.edges.push()
  }

  render() {
    if (this.props.singleWebElements) {
      const elements = this.props.singleWebElements

      return (
        <React.Fragment>
          <Visual
            elements={elements}
            webClick={this.webClick}
            editClick={this.editClick}
            expandClick={this.expandClick}
            getModal={this.props.getModal}
            modal={this.props.modal}
            closeModal={this.props.closeModal}
            loadPage={this.props.loadPage}
            getElements={this.props.getSingleWeb}
          />
        </React.Fragment>
      )
    } else {
      return ''
    }
  }
}

const mapStateToProps = state => ({
  singleWebElements: state.elements.singleWeb,
  modal: state.modal
})

const mapDispatchToProps = dispatch => ({
  getSingleWeb: id => {
    dispatch(fetchSingleWeb(id))
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
export default connect(mapStateToProps, mapDispatchToProps)(SingleWeb)
